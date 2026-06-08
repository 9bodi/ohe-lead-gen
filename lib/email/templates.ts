// Template HTML de l'email de bilan freemium
import type { ScoreResult } from "@/lib/scoring/compute";

const LEVEL_COLORS = {
  red: { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
  orange: { bg: "#FFEDD5", text: "#9A3412", dot: "#F97316" },
  blue: { bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6" },
  green: { bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
} as const;

const LEVEL_LABELS = {
  non_maitrise: "Non maîtrisé",
  fragile: "Fragile",
  fonctionnel: "Fonctionnel",
  maitrise: "Maîtrisé",
} as const;

interface ResultEmailProps {
  recipientEmail: string;
  score: ScoreResult;
  recommendation: string;
  resultUrl: string;
  contactUrl: string;
  formationUrl: string;
  appUrl: string;
  logoDataUrl: string;
}

export function renderResultEmail(props: ResultEmailProps): { html: string; text: string } {
  const { recipientEmail, score, recommendation, resultUrl, contactUrl, formationUrl, appUrl, logoDataUrl } = props;

  const block1Colors = LEVEL_COLORS[score.block1.color];
  const block2Colors = LEVEL_COLORS[score.block2.color];

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Votre bilan OHé</title>
</head>
<body style="margin:0; padding:0; background:#F4F6FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color:#15171C;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FB; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#FFFFFF; border-radius:16px; overflow:hidden;">

          <!-- Header avec logo -->
          <tr>
            <td style="padding:32px 40px 24px; border-bottom:1px solid #15171C22;">
              <img src="${logoDataUrl}" alt="OHé — Orthographe Héros" width="100" style="display:block; max-width:100px; height:auto;">
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:40px 40px 24px;">
              <div style="font-size:11px; letter-spacing:0.32em; text-transform:uppercase; color:#1E3A8A; margin-bottom:16px;">
                ✱ Votre bilan diagnostic
              </div>
              <h1 style="margin:0; font-size:36px; line-height:1.1; font-weight:normal; color:#15171C;">
                Bravo, votre premier pas est fait.
              </h1>
              <p style="margin:16px 0 0; font-size:16px; line-height:1.55; color:#6A6E78;">
                Vous venez d'évaluer votre maîtrise de l'écrit. Voici vos résultats sur deux compétences clés.
              </p>
            </td>
          </tr>

          <!-- Blocs visibles -->
          <tr>
            <td style="padding:8px 40px 24px;">
              <div style="font-size:11px; letter-spacing:0.32em; text-transform:uppercase; color:#6A6E78; margin-bottom:16px;">
                Vos résultats
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #15171C22;">
                <tr>
                  <td style="padding:18px 0; border-bottom:1px solid #15171C22;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px; font-size:11px; letter-spacing:0.2em; color:#1E3A8A;">01</td>
                        <td>
                          <span style="display:inline-block; width:8px; height:8px; background:${block1Colors.dot}; border-radius:50%; margin-right:10px; vertical-align:middle;"></span>
                          <span style="font-family: Georgia, serif; font-style:italic; font-size:18px; color:#15171C; vertical-align:middle;">Accords des mots</span>
                        </td>
                        <td align="right" style="white-space:nowrap;">
                          <span style="font-family: Georgia, serif; font-style:italic; font-size:16px; color:#15171C; margin-right:12px;">${score.block1.correct} / 8</span>
                          <span style="display:inline-block; padding:4px 10px; background:${block1Colors.bg}; color:${block1Colors.text}; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; border-radius:999px; font-weight:600;">${LEVEL_LABELS[score.block1.level]}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 0; border-bottom:1px solid #15171C22;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px; font-size:11px; letter-spacing:0.2em; color:#1E3A8A;">02</td>
                        <td>
                          <span style="display:inline-block; width:8px; height:8px; background:${block2Colors.dot}; border-radius:50%; margin-right:10px; vertical-align:middle;"></span>
                          <span style="font-family: Georgia, serif; font-style:italic; font-size:18px; color:#15171C; vertical-align:middle;">Conjugaison des verbes</span>
                        </td>
                        <td align="right" style="white-space:nowrap;">
                          <span style="font-family: Georgia, serif; font-style:italic; font-size:16px; color:#15171C; margin-right:12px;">${score.block2.correct} / 8</span>
                          <span style="display:inline-block; padding:4px 10px; background:${block2Colors.bg}; color:${block2Colors.text}; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; border-radius:999px; font-weight:600;">${LEVEL_LABELS[score.block2.level]}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Blocs verrouillés -->
          <tr>
            <td style="padding:8px 40px 24px;">
              <div style="font-size:11px; letter-spacing:0.32em; text-transform:uppercase; color:#6A6E78; margin-bottom:16px;">
                Encore à explorer
              </div>
              ${["Participe passé", "Orthographe lexicale", "Syntaxe", "Compréhension"]
                .map(
                  (title, i) => `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px 0; border-bottom:1px solid #15171C10;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:40px; font-size:11px; letter-spacing:0.2em; color:#6A6E78; opacity:0.5;">0${i + 3}</td>
                          <td>
                            <span style="font-family: Georgia, serif; font-style:italic; font-size:16px; color:#6A6E78; opacity:0.6;">🔒 ${title}</span>
                          </td>
                          <td align="right" style="font-size:11px; color:#6A6E78; font-style:italic; opacity:0.6;">
                            Diagnostic complet
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              `
                )
                .join("")}
              <p style="margin:16px 0 0; font-size:12px; color:#6A6E78; font-style:italic;">
                Votre niveau global (A / B1 / B2 / C) sera précisé après un diagnostic complet sur les 6 compétences.
              </p>
            </td>
          </tr>

          <!-- Recommandation -->
          <tr>
            <td style="padding:24px 40px;">
              <div style="font-size:11px; letter-spacing:0.32em; text-transform:uppercase; color:#1E3A8A; margin-bottom:12px;">
                ✱ Notre recommandation
              </div>
              <p style="margin:0; font-size:17px; line-height:1.55; color:#15171C;">
                ${recommendation}
              </p>
              <p style="margin:16px 0 0; font-size:14px; line-height:1.55; color:#6A6E78;">
                Les fautes ne sont pas une fatalité, juste un problème de méthode. Votre score d'aujourd'hui n'est pas une étiquette, c'est un point de départ.
              </p>
            </td>
          </tr>

          <!-- CTAs -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <div style="font-size:11px; letter-spacing:0.32em; text-transform:uppercase; color:#6A6E78; margin-bottom:20px;">
                Pour aller plus loin
              </div>

              <!-- CTA principal : diagnostic équipe -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1E3A8A; border-radius:999px;">
                    <a href="${contactUrl}" style="display:inline-block; padding:14px 28px; color:#F8FAFD; text-decoration:none; font-size:14px; font-weight:500;">
                      Diagnostiquer mon équipe avec OHé →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:8px 0 24px; font-size:12px; color:#6A6E78; font-style:italic;">
                Évaluez vos collaborateurs sur les 6 compétences et identifiez les besoins de formation.
              </p>

              <!-- CTA secondaire : site formation -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border:1px solid #1E3A8A; border-radius:999px;">
                    <a href="${formationUrl}" style="display:inline-block; padding:12px 24px; color:#1E3A8A; text-decoration:none; font-size:14px; font-weight:500;">
                      Découvrir la formation OHé
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:8px 0 0; font-size:12px; color:#6A6E78; font-style:italic;">
                La méthode prouvée scientifiquement · +40 % en 2 jours · 10 min/jour
              </p>
            </td>
          </tr>

          <!-- Lien vers la page résultat web -->
          <tr>
            <td style="padding:0 40px 24px;">
              <p style="margin:0; font-size:13px; color:#6A6E78;">
                Vous pouvez aussi <a href="${resultUrl}" style="color:#1E3A8A; text-decoration:underline;">consulter votre bilan en ligne</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px; background:#F4F6FB; border-top:1px solid #15171C22;">
              <p style="margin:0 0 8px; font-size:13px; color:#15171C;">
                À très vite,<br>
                <strong>L'équipe OHé</strong> · Orthographe Héros
              </p>
              <p style="margin:0; font-size:12px; color:#6A6E78;">
                Votre conseillère formation · 06 88 57 70 47 · <a href="https://orthographe-heros.fr" style="color:#1E3A8A; text-decoration:none;">orthographe-heros.fr</a>
              </p>
              <p style="margin:16px 0 0; font-size:11px; color:#6A6E78; line-height:1.5;">
                Vous recevez cet e-mail à ${recipientEmail} car vous avez passé le diagnostic OHé. Lien de désinscription disponible prochainement.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Bonjour,

Bravo — vous venez de faire le premier pas : évaluer votre maîtrise de l'écrit.

VOS RÉSULTATS SUR 2 COMPÉTENCES

01. Accords des mots : ${score.block1.correct}/8 — ${LEVEL_LABELS[score.block1.level]}
02. Conjugaison des verbes : ${score.block2.correct}/8 — ${LEVEL_LABELS[score.block2.level]}

ENCORE À EXPLORER

03. Participe passé (verrouillé)
04. Orthographe lexicale (verrouillé)
05. Syntaxe (verrouillé)
06. Compréhension (verrouillé)

Votre niveau global (A/B1/B2/C) sera précisé après un diagnostic complet sur les 6 compétences.

NOTRE RECOMMANDATION

${recommendation}

Les fautes ne sont pas une fatalité, juste un problème de méthode. Votre score d'aujourd'hui n'est pas une étiquette, c'est un point de départ.

POUR ALLER PLUS LOIN

→ Diagnostiquer mon équipe avec OHé : ${contactUrl}
→ Découvrir la formation OHé : ${formationUrl}

Consulter votre bilan en ligne : ${resultUrl}

À très vite,
L'équipe OHé · Orthographe Héros
Votre conseillère formation · 06 88 57 70 47 · orthographe-heros.fr

— Vous recevez cet e-mail car vous avez passé le diagnostic OHé.`;

  return { html, text };
}
