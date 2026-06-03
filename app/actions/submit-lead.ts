"use server";

import { prisma } from "@/lib/prisma";
import { submitLeadSchema, type SubmitLeadInput } from "@/lib/schemas/lead";
import { computeScore } from "@/lib/scoring/compute";

export type SubmitLeadResult =
  | { ok: true; resultId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function submitLead(
  input: SubmitLeadInput
): Promise<SubmitLeadResult> {
  // === 1. Validation Zod ===
  const parsed = submitLeadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path && !fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    return {
      ok: false,
      error: "Formulaire invalide",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // === 2. Récupérer la campagne par défaut (web-freemium) ===
  const campaign = await prisma.campaign.findUnique({
    where: { slug: "web-freemium" },
  });

  if (!campaign || !campaign.isActive) {
    return {
      ok: false,
      error: "Service indisponible — veuillez réessayer plus tard.",
    };
  }

  // === 3. Calcul du score (côté serveur, authoritative) ===
  const score = computeScore({ answers: data.testPayload.answers });

  // === 4. Créer Lead + FreemiumResult en transaction ===
  try {
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          campaignId: campaign.id,
          email: data.email,
          marketingOptIn: data.marketingOptIn,
          utmSource: data.testPayload.utm?.source ?? null,
          utmCampaign: data.testPayload.utm?.campaign ?? null,
          utmMedium: data.testPayload.utm?.medium ?? null,
        },
      });

      const freemiumResult = await tx.freemiumResult.create({
        data: {
          leadId: lead.id,
          block1Correct: score.block1.correct,
          block1Score: score.block1.score,
          block1Level: score.block1.level,
          block2Correct: score.block2.correct,
          block2Score: score.block2.score,
          block2Level: score.block2.level,
          adaptationScore: score.adaptation.score,
          adaptationProfile: score.adaptation.profile,
          rawAnswers: score.rawAnswers as unknown as object,
          durationMs: data.testPayload.durationMs,
        },
      });

      return freemiumResult;
    });

    return { ok: true, resultId: result.id };
  } catch (e) {
    console.error("submitLead — db error:", e);
    return {
      ok: false,
      error: "Une erreur est survenue. Merci de réessayer.",
    };
  }
}
