import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Eyebrow, Badge, Portrait } from "@/components/ui";
import { StartTestButton } from "./welcome-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WelcomePage({ params }: PageProps) {
  const { slug } = await params;

  // Charger la campagne depuis la DB
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
  });

  // Si la campagne n'existe pas ou n'est pas active → 404
  if (!campaign || !campaign.isActive) {
    notFound();
  }

  const specs = [
    {
      num: "01",
      kpi: "~5 min",
      label: "Durée moyenne — un café suffit.",
    },
    {
      num: "02",
      kpi: "13 questions",
      label: "Sélectionnées sur les erreurs les plus fréquentes.",
    },
    {
      num: "03",
      kpi: "Score immédiat",
      label: "Niveau, points forts et axes prioritaires.",
    },
    {
      num: "04",
      kpi: "Sans préparation",
      label: "Vos premières intuitions sont les meilleures.",
    },
  ];

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] bg-ohe-bg text-ohe-ink overflow-hidden">
      {/* === Colonne gauche : hero éditorial === */}
      <div className="flex flex-col px-14 py-10">
        {/* Header */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-4 text-ohe-accent">
            <span className="font-serif italic text-[26px] tracking-tight">OHé</span>
            <span className="ohe-caption opacity-75">Diagnostic</span>
          </div>
          <Badge>Démo · gratuite</Badge>
        </div>

        {/* Hero — pushed to bottom of column */}
        <div className="mt-auto">
          <Eyebrow tone="accent" className="mb-8">
            D I A G N O S T I C &nbsp; I N D I V I D U E L
          </Eyebrow>

          <h1 className="text-[84px] leading-[0.98] tracking-[-0.028em] font-normal text-balance m-0">
            Évaluez votre<br />
            niveau en<br />
            <span className="font-serif italic text-ohe-accent">français</span>.
          </h1>

          <p className="mt-8 text-[17px] leading-[1.55] text-ohe-muted max-w-[460px] text-pretty">
            Treize questions courtes pour situer vos réflexes en orthographe.
            Score, axes de progression et méthode adaptée à votre profil —
            en moins de cinq minutes.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <StartTestButton slug={campaign.slug} />
            <button
              type="button"
              className="text-sm text-ohe-accent underline underline-offset-4 decoration-ohe-accent/40 hover:decoration-ohe-accent transition-colors py-4 px-2 cursor-pointer"
            >
              Voir un exemple
            </button>
          </div>
        </div>

        {/* Byline */}
        <div className="mt-16 pt-6 border-t border-ohe-line flex items-center gap-3.5">
          <Portrait size={42} />
          <div>
            <div className="ohe-caption text-ohe-muted">Conçu par</div>
            <div className="text-sm mt-0.5">
              Roxane Joannidès{" "}
              <span className="text-ohe-muted">· Dr. sciences du langage</span>
            </div>
          </div>
        </div>
      </div>

      {/* === Colonne droite : spec card === */}
      <div className="bg-ohe-panel-tint border-l border-ohe-line px-12 py-10 flex flex-col relative">
        <div className="ohe-eyebrow text-ohe-accent">
          ✱ Ce que vous obtenez
        </div>

        <div className="my-auto flex flex-col">
          {specs.map((row, i) => {
            const isFirst = i === 0;
            const isLast = i === specs.length - 1;
            return (
              <div
                key={row.num}
                className={`
                  grid grid-cols-[46px_1fr] gap-[18px] py-[22px]
                  ${isFirst ? "border-t border-ohe-line" : ""}
                  ${isLast ? "border-b border-ohe-line" : "border-b border-ohe-line-soft"}
                `}
              >
                <div className="text-[11px] tracking-[0.2em] text-ohe-accent pt-2 font-medium">
                  {row.num}
                </div>
                <div>
                  <div className="font-serif italic text-[26px] leading-[1.1] text-ohe-accent">
                    {row.kpi}
                  </div>
                  <div className="text-[13px] text-ohe-muted mt-1.5 text-pretty">
                    {row.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Watermark asterisk décoratif */}
        <div
          className="absolute pointer-events-none select-none font-serif"
          style={{
            right: -40,
            bottom: -80,
            fontSize: 320,
            lineHeight: 1,
            color: "var(--color-ohe-accent-soft)",
          }}
        >
          ✱
        </div>
      </div>
    </main>
  );
}

// Pré-génère les pages des campagnes actives au build
export async function generateStaticParams() {
  // En dev on retourne vide, Next.js générera à la demande
  return [];
}
