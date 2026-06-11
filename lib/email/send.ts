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
interface SendContactNotificationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company: string;
  jobTitle?: string | null;
  teamSize?: string | null;
  message?: string | null;
  contactId: string;
  freemiumResultId?: string | null;
}

export async function sendContactNotification(
  input: SendContactNotificationInput
): Promise<{ ok: true; messageId: string } | { ok: false; error: string }> {
  const from = process.env.RESEND_FROM_EMAIL ?? "OHé Diagnostic <onboarding@resend.dev>";
  const to = process.env.CONTACT_NOTIFICATION_EMAIL ?? "contact@orthographe-heros.fr";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Lien direct vers le bilan freemium associé, si la demande vient d'un résultat
  const resultLine = input.freemiumResultId
    ? `Bilan associé : ${appUrl}/result/${input.freemiumResultId}\n`
    : "";

  const fullName = `${input.firstName} ${input.lastName}`.trim();

  const text =
    `Nouvelle demande de contact reçue depuis le diagnostic OHé.\n\n` +
    `Nom : ${fullName}\n` +
    `Email : ${input.email}\n` +
    `Téléphone : ${input.phone || "—"}\n` +
    `Entreprise : ${input.company}\n` +
    `Rôle : ${input.jobTitle || "—"}\n` +
    `Équipe à évaluer : ${input.teamSize || "—"}\n` +
    `Message : ${input.message || "—"}\n\n` +
    resultLine;

  const html =
    `<div style="font-family: Arial, sans-serif; font-size: 15px; color: #1a1a1a; line-height: 1.6;">` +
    `<h2 style="color: #1E3A8A; margin-bottom: 16px;">Nouvelle demande de contact</h2>` +
    `<p style="margin: 0 0 16px;">Reçue depuis le diagnostic OHé.</p>` +
    `<table style="border-collapse: collapse; width: 100%; max-width: 520px;">` +
    `<tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Nom</td><td style="padding: 6px 0;">${fullName}</td></tr>` +
    `<tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Email</td><td style="padding: 6px 0;"><a href="mailto:${input.email}">${input.email}</a></td></tr>` +
    `<tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Téléphone</td><td style="padding: 6px 0;">${input.phone || "—"}</td></tr>` +
    `<tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Entreprise</td><td style="padding: 6px 0;">${input.company}</td></tr>` +
    `<tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Rôle</td><td style="padding: 6px 0;">${input.jobTitle || "—"}</td></tr>` +
    `<tr><td style="padding: 6px 12px 6px 0; font-weight: bold;">Équipe à évaluer</td><td style="padding: 6px 0;">${input.teamSize || "—"}</td></tr>` +
    `<tr><td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 6px 0;">${(input.message || "—").replace(/\n/g, "<br>")}</td></tr>` +
    `</table>` +
    (input.freemiumResultId
      ? `<p style="margin: 16px 0 0;"><a href="${appUrl}/result/${input.freemiumResultId}" style="color: #1E3A8A;">Voir le bilan associé →</a></p>`
      : "") +
    `</div>`;

  try {
    const response = await resend.emails.send({
      from,
      to,
      subject: `Nouvelle demande de contact — ${input.company}`,
      html,
      text,
    });

    if (response.error) {
      console.error("Resend error (contact notif):", response.error);
      return { ok: false, error: response.error.message };
    }

    return { ok: true, messageId: response.data?.id ?? "" };
  } catch (e) {
    console.error("sendContactNotification — exception:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}
