"use server";

import { prisma } from "@/lib/prisma";
import { submitLeadSchema, type SubmitLeadInput } from "@/lib/schemas/lead";
import { computeScore, getResultMessage } from "@/lib/scoring/compute";
import { sendResultEmail } from "@/lib/email/send";

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

  // === 2. Récupérer la campagne par défaut ===
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
  const recommendation = getResultMessage(score);

  // === 4. Créer Lead + FreemiumResult en transaction ===
  let resultId: string;
  try {
    const result = await prisma.$transaction(async (tx) => {
            const lead = await tx.lead.create({
        data: {
          campaignId: campaign.id,
          email: data.email,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          organization: data.organization || null,
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

    resultId = result.id;
  } catch (e) {
    console.error("submitLead — db error:", e);
    return {
      ok: false,
      error: "Une erreur est survenue. Merci de réessayer.",
    };
  }

  // === 5. Envoi de l'email (non bloquant — on log l'erreur mais on retourne quand même succès) ===
  // Si l'envoi échoue, le lead reste créé en DB.
  // L'équipe OHé pourra le contacter manuellement depuis le backoffice.
  const emailResponse = await sendResultEmail({
    to: data.email,
    score,
    recommendation,
    resultId,
  });

  if (!emailResponse.ok) {
    console.error("submitLead — email send failed:", emailResponse.error);
    // On n'échoue PAS la submission pour autant. L'utilisateur voit son bilan
    // sur la page web, et le lead est en base.
  } else {
    console.log("submitLead — email sent:", emailResponse.messageId);
  }

  return { ok: true, resultId };
}
