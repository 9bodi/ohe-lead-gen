// Envoi d'emails via Resend
import { Resend } from "resend";
import { renderResultEmail } from "./templates";
import type { ScoreResult } from "@/lib/scoring/compute";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendResultEmailInput {
  to: string;
  score: ScoreResult;
  recommendation: string;
  resultId: string;
}

export async function sendResultEmail(
  input: SendResultEmailInput
): Promise<{ ok: true; messageId: string } | { ok: false; error: string }> {
  const from = process.env.RESEND_FROM_EMAIL ?? "OHé Diagnostic <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const resultUrl = `${appUrl}/result/${input.resultId}`;
  const contactUrl = `${appUrl}/contact`;
  const formationUrl = "https://orthographe-heros.fr";

  // URL publique du logo, chargée par le client mail.
  // Les clients (Gmail, Outlook, etc.) bloquent les images en data: URI (base64),
  // il faut donc pointer vers une vraie URL hébergée publiquement.
  const logoUrl = `${appUrl}/images/ohe-logo.png`;

  const { html, text } = renderResultEmail({
    recipientEmail: input.to,
    score: input.score,
    recommendation: input.recommendation,
    resultUrl,
    contactUrl,
    formationUrl,
    appUrl,
    logoUrl,
  });

  try {
    const response = await resend.emails.send({
      from,
      to: input.to,
      subject: "Votre diagnostic OHé est prêt 🔑",
      html,
      text,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return { ok: false, error: response.error.message };
    }

    return { ok: true, messageId: response.data?.id ?? "" };
  } catch (e) {
    console.error("sendResultEmail — exception:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}
