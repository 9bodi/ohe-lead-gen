import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BlockResult } from "@/components/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

const LEVEL_TO_LABEL: Record<string, string> = {
  non_maitrise: "Non maîtrisé",
  fragile: "Fragile",
  fonctionnel: "Fonctionnel",
  maitrise: "Maîtrisé",
};

const LEVEL_TO_COLOR: Record<string, "red" | "orange" | "blue" | "green"> = {
  non_maitrise: "red",
  fragile: "orange",
  fonctionnel: "blue",
  maitrise: "green",
};

const DIAGNOSTIC_COMPLET_URL = "#";
const FORMATION_OHE_URL = "#";

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;

  const result = await prisma.freemiumResult.findUnique({
    where: { id },
    include: { lead: true },
  });

  if (!result) {
    notFound();
  }

  const totalScore = result.block1Score + result.block2Score;
  const isAdapted = result.adaptationProfile === "adapted";
  const isLowScore = totalScore <= 1;

  let recommendation: string;
  if (isLowScore && isAdapted) {
    recommendation =
      "Vos résultats révèlent des axes de progression en accords et conjugaison. Votre profil correspond exactement au public que la formation OHé accompagne.";
  } else if (!isLowScore && isAdapted) {
    recommendation =
      "Vous maîtrisez bien les accords et la conjugaison. Le diagnostic complet révèle si vos autres compétences atteignent le même niveau.";
  } else if (isLowScore && !isAdapted) {
    recommendation =
      "Vos résultats montrent des difficultés à l'écrit. Nous vous invitons à nous contacter pour trouver la solution adaptée à votre situation.";
  } else {
    recommendation =
      "Vos résultats sont bons sur ces deux compétences. Votre profil suggère que la formation OHé n'est peut-être pas la priorité — contactez-nous pour en discuter.";
  }

  const formattedDate = new Date(result.completedAt)
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  const primaryCtaClass = "inline-flex items-center gap-3 px-7 py-4 rounded-full text-sm font-medium bg-ohe-accent text-ohe-accent-ink hover:bg-ohe-ink transition-colors";
  const secondaryCtaClass = "inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium bg-transparent text-ohe-accent border border-ohe-accent hover:bg-ohe-accent-soft transition-colors";
  const tertiaryCtaClass = "text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors";

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink">
      <div className="border-b border-ohe-line">
        <div className="max-w-[920px] mx-auto px-14 py-7 flex items-baseline justify-between">
          <div className="flex items-baseline gap-4 text-ohe-accent">
            <span className="font-serif italic text-[22px]">OHé</span>
            <span className="ohe-caption opacity-75">Diagnostic</span>
          </div>
          <div className="ohe-caption text-ohe-muted">BILAN · {formattedDate}</div>
        </div>
      </div>

      <div className="max-w-[920px] mx-auto px-14 py-12 space-y-12">
        <div>
          <div className="ohe-eyebrow text-ohe-accent inline-flex items-center gap-3">
            <span className="opacity-65">✱</span>
            <span>B I L A N &nbsp; D I A G N O S T I C</span>
          </div>
          <h1 className="mt-6 text-[56px] leading-[1.05] tracking-[-0.022em] font-normal text-balance">
            Votre bilan <span className="font-serif italic text-ohe-accent">en deux compétences</span>.
          </h1>
          <p className="mt-4 text-base text-ohe-muted text-pretty max-w-[560px]">
            Voici vos résultats sur les accords des mots et la conjugaison. Quatre autres compétences clés restent à explorer pour un diagnostic complet.
          </p>
        </div>

        <div>
          <div className="ohe-eyebrow text-ohe-muted mb-4">Détail par compétence</div>
          <div className="border-t border-ohe-line">
            <BlockResult
              mode="visible"
              num="01"
              title="Accords des mots"
              correct={result.block1Correct}
              total={8}
              level={result.block1Level}
              label={LEVEL_TO_LABEL[result.block1Level]}
              color={LEVEL_TO_COLOR[result.block1Level]}
            />
            <BlockResult
              mode="visible"
              num="02"
              title="Conjugaison"
              correct={result.block2Correct}
              total={8}
              level={result.block2Level}
              label={LEVEL_TO_LABEL[result.block2Level]}
              color={LEVEL_TO_COLOR[result.block2Level]}
            />
            <BlockResult mode="locked" num="03" title="Participe passé" />
            <BlockResult mode="locked" num="04" title="Orthographe lexicale" />
            <BlockResult mode="locked" num="05" title="Syntaxe" />
            <BlockResult mode="locked" num="06" title="Compréhension" />
          </div>
        </div>

        <div className="bg-ohe-panel-tint border border-ohe-line rounded-2xl px-10 py-8 space-y-6">
          <div className="ohe-eyebrow text-ohe-muted">Niveau global</div>
          <div className="flex items-end justify-between gap-8">
            <div className="flex-1">
              <div className="text-[13px] text-ohe-muted mb-2">Lettre attribuée</div>
              <div className="relative inline-block">
                <span
                  className="font-serif italic text-ohe-ink"
                  style={{
                    fontSize: 88,
                    lineHeight: 0.9,
                    letterSpacing: "-0.03em",
                    filter: "blur(8px)",
                    userSelect: "none",
                  }}
                >
                  ?
                </span>
              </div>
              <div className="text-[13px] text-ohe-muted italic mt-2">Disponible avec le diagnostic complet</div>
            </div>
            <div className="flex-[2]">
              <div className="text-[13px] text-ohe-muted mb-3">Échelle de niveau</div>
              <div className="grid grid-cols-4 gap-0 border border-ohe-line rounded-lg overflow-hidden opacity-40">
                {[
                  { letter: "A", range: "0-37 %" },
                  { letter: "B1", range: "37-60 %" },
                  { letter: "B2", range: "60-80 %" },
                  { letter: "C", range: "80-100 %" },
                ].map((item, i) => (
                  <div
                    key={item.letter}
                    className={`px-3 py-3 text-center bg-ohe-panel ${i > 0 ? "border-l border-ohe-line" : ""}`}
                  >
                    <div className="font-serif italic text-[20px] text-ohe-ink">{item.letter}</div>
                    <div className="text-[10px] text-ohe-muted mt-1">{item.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="ohe-eyebrow text-ohe-accent mb-4">Recommandation</div>
          <p className="text-[18px] leading-[1.55] text-ohe-ink text-pretty max-w-[680px]">{recommendation}</p>
        </div>

        <div className="border-t border-ohe-line pt-10 space-y-4">
          <div className="ohe-eyebrow text-ohe-muted mb-4">Pour aller plus loin</div>

          <div>
            <Link href={DIAGNOSTIC_COMPLET_URL} className={primaryCtaClass}>
              <span>Faire le diagnostic complet</span>
              <span className="text-base">{"\u2192"}</span>
            </Link>
            <p className="mt-3 text-[13px] text-ohe-muted italic">48 questions, 6 compétences, niveau A/B1/B2/C détaillé</p>
          </div>

          <div className="pt-4">
            <Link href={FORMATION_OHE_URL} className={secondaryCtaClass}>
              Découvrir la formation OHé
            </Link>
          </div>

          <div className="pt-6">
            <Link href="/" className={tertiaryCtaClass}>
              Terminer
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-ohe-line text-[12px] text-ohe-muted">
          Une copie de ce bilan a été envoyée à <span className="text-ohe-ink">{result.lead.email}</span>.
        </div>
      </div>
    </main>
  );
}