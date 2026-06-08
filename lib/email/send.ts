// Envoi d'emails via Resend
import { Resend } from "resend";
import { readFile } from "fs/promises";
import path from "path";
import { renderResultEmail } from "./templates";
import type { ScoreResult } from "@/lib/scoring/compute";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendResultEmailInput {
  to: string;
  score: ScoreResult;
  recommendation: string;
  resultId: string;
}

// === Cache du logo en mémoire (lu une seule fois au démarrage) ===
let cachedLogoDataUrl: string | null = null;

async function getLogoDataUrl(): Promise<string> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;

  try {
    const logoPath = path.join(process.cwd(), "public", "images", "ohe-logo.png");
    const buffer = await readFile(logoPath);
    const base64 = buffer.toString("base64");
    cachedLogoDataUrl = `data:image/png;base64,${base64}`;
    return cachedLogoDataUrl;
  } catch (e) {
    console.error("Could not load logo for email:", e);
    return ""; // fallback : pas de logo si erreur
  }
}

export async function sendResultEmail(
  input: SendResultEmailInput
): Promise<{ ok: true; messageId: string } | { ok: false; error: string }> {
  const from = process.env.RESEND_FROM_EMAIL ?? "OHé Diagnostic <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const resultUrl = `${appUrl}/result/${input.resultId}`;
  const contactUrl = `${appUrl}/contact`;
  const formationUrl = "https://orthographe-heros.fr";

  const logoDataUrl = await getLogoDataUrl();

  const { html, text } = renderResultEmail({
    recipientEmail: input.to,
    score: input.score,
    recommendation: input.recommendation,
    resultUrl,
    contactUrl,
    formationUrl,
    appUrl,
    logoDataUrl,
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
