import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BlockResult, Logo, ResultActions, DiagMatrix } from "@/components/ui";


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

const APP_OHE_URL = "https://app.orthographe-heros.fr/connexion?invitation=1";

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;

  const result = await prisma.freemiumResult.findUnique({
    where: { id },
    include: { lead: true },
  });

  if (!result) {
    notFound();
  }

  const formattedDate = new Date(result.completedAt)
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  const primaryCtaClass =
    "inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-4 rounded-full text-sm font-medium bg-ohe-accent text-ohe-accent-ink hover:bg-ohe-ink transition-colors";
  const secondaryCtaClass =
    "inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-medium bg-transparent text-ohe-accent border border-ohe-accent hover:bg-ohe-accent-soft transition-colors";
  const tertiaryCtaClass =
    "text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors";

  const niveaux = [
    { letter: "A", range: "0–37 %", label: "Élémentaire", besoin: "Besoins de base" },
    { letter: "B1", range: "40–60 %", label: "Indépendant intermédiaire", besoin: "Besoins techniques" },
    { letter: "B2", range: "62–80 %", label: "Indépendant avancé", besoin: "Besoins professionnels" },
        { letter: "C", range: "82–100 %", label: "Expérimenté / expert", besoin: "Besoins experts" },

  ];

  const diagComplet = [
    "Conçu par docteure Roxane Joannidès",
    "Seul ou en équipe",
    "15 min · 48 questions",
    "Cartographie précise des forces et axes d'amélioration",
    "Préconisation des solutions adaptées pour un parcours sans faute",
  ];

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink">
      <div className="border-b border-ohe-line">
                <div className="max-w-[920px] mx-auto px-6 py-5 sm:px-10 lg:px-14 lg:py-7 flex items-center justify-between gap-4">
          <Logo size={32} withLabel />
          <div className="flex items-center gap-5">
            <div className="ohe-caption text-ohe-muted text-right hidden sm:block">
              BILAN · {formattedDate}
            </div>
            <ResultActions />
          </div>
        </div>

      </div>

      <div className="max-w-[920px] mx-auto px-6 py-10 sm:px-10 lg:px-14 lg:py-12 space-y-12">
        {/* En-tête */}
        <div>
          <div className="text-ohe-accent flex items-center gap-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] sm:tracking-[0.32em]">
            <span className="opacity-65"></span>
            <span>Bilan du diagnostic</span>
          </div>
                    <h1 className="mt-6 text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.07] lg:leading-[1.05] tracking-[-0.022em] font-normal text-balance">
            Votre bilan{" "}
            <span className="font-serif italic text-ohe-accent">orthographique</span>
          </h1>

          <p className="mt-4 text-base text-ohe-muted text-pretty max-w-[620px] leading-[1.55]">
            Ce test est une version abrégée du diagnostic conçu par docteure Joannidès.
            Il vous offre un premier aperçu de votre niveau en accord et en conjugaison.
            Quatre autres compétences clés restent à explorer pour obtenir un diagnostic complet.
          </p>
        </div>

        {/* Détail par compétence */}
        <div>
          <div className="ohe-eyebrow text-ohe-muted mb-4">Détail par compétence</div>
          <div className="border-t border-ohe-line">
            <BlockResult
              mode="visible"
              num="01"
              title="Singulier/pluriel"
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
            <BlockResult mode="locked" num="04" title="Orthographe des mots" />
            <BlockResult mode="locked" num="05" title="Syntaxe" />
            <BlockResult mode="locked" num="06" title="Compréhension" />
          </div>
        </div>

        {/* Niveau global (verrouillé) */}
        <div className="bg-ohe-panel-tint border border-ohe-line rounded-2xl px-5 py-6 sm:px-10 sm:py-8 space-y-6">
          <div className="ohe-eyebrow text-ohe-muted">Niveau global</div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
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
              <div className="text-[13px] text-ohe-muted mt-2">
                Disponible avec le diagnostic complet
              </div>
            </div>
            <div className="flex-[2] w-full">
              <div className="text-[13px] text-ohe-muted mb-3">Échelle de niveau</div>
              <div className="flex flex-col gap-2">
                {niveaux.map((n) => (
                  <div
                    key={n.letter}
                    className="flex items-baseline gap-3 border-b border-ohe-line-soft pb-2 last:border-0"
                  >
                    <span className="font-serif italic text-[20px] text-ohe-accent w-9 shrink-0">
                      {n.letter}
                    </span>
                    <div className="flex-1">
                      <div className="text-[14px] text-ohe-ink">
                        {n.label}{" "}
                        <span className="text-ohe-muted">· {n.besoin}</span>
                      </div>
                      <div className="text-[12px] text-ohe-muted">{n.range}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nouveau bloc : diagnostic complet */}
        <div className="bg-ohe-accent-soft border border-ohe-line rounded-2xl px-5 py-6 sm:px-10 sm:py-8">
          <div className="ohe-eyebrow text-ohe-accent mb-4">Le diagnostic complet</div>
          <h2 className="text-[24px] sm:text-[28px] leading-[1.2] font-normal text-ohe-ink text-balance">
            Découvrez le diagnostic orthographique{" "}
            <span className="font-serif italic text-ohe-accent">complet</span>
          </h2>
          <ul className="mt-6 space-y-3">
            {diagComplet.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-ohe-ink">
                <span className="text-ohe-accent mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
                  

          {/* Aperçu matrice vierge */}
          <DiagMatrix />
        </div>

        {/* Pour aller plus loin — 3 CTA */}
        <div className="border-t border-ohe-line pt-10 space-y-6">
          <div className="ohe-eyebrow text-ohe-muted">Pour aller plus loin</div>

          <div>
            <Link href={`/contact?type=btoc&from=${result.id}`} className={primaryCtaClass}>
              <span>Réaliser mon diagnostic complet</span>
              <span className="text-base">{"\u2192"}</span>
            </Link>
          </div>

                    <div>
            <Link href={`/contact?type=btob&from=${result.id}`} className={secondaryCtaClass}>
              <span>Réaliser le diagnostic au sein de mon entreprise</span>
              <span className="text-base">{"\u2192"}</span>
            </Link>
          </div>


          <div className="pt-2">
            <a
              href={APP_OHE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={tertiaryCtaClass}
            >
              Découvrir l'app OHé Orthographe pour une remise à niveau rapide et facile →
            </a>
          </div>
        </div>

        {/* Footer email */}
        <div className="pt-8 border-t border-ohe-line text-[12px] text-ohe-muted">
          Une copie de ce bilan a été envoyée à{" "}
          <span className="text-ohe-ink break-all">{result.lead.email}</span>.
        </div>
      </div>
    </main>
  );
}
