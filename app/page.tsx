import Link from "next/link";
import { Badge, Eyebrow, Logo, Portrait } from "@/components/ui";
import { TOTAL_COUNT } from "@/lib/questions";

export default function Home() {
  const specs = [
    { num: "01", kpi: "~4 min", label: "Durée moyenne — un café suffit." },
    { num: "02", kpi: `${TOTAL_COUNT} questions`, label: "Sur deux compétences clés : accords et conjugaison." },
    { num: "03", kpi: "Score immédiat", label: "Niveau par bloc et profil d'adaptation." },
    { num: "04", kpi: "Sans préparation", label: "Vos premières intuitions sont les meilleures." },
  ];

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] bg-ohe-bg text-ohe-ink lg:overflow-hidden">
      {/* Colonne gauche : hero */}
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
        <div className="flex items-center justify-between gap-4">
          <Logo size={48} withLabel />
          <Badge>Gratuit · 4 min</Badge>
        </div>

        <div className="mt-12 lg:mt-auto">
          <Eyebrow tone="accent" className="mb-6 lg:mb-8">
            D I A G N O S T I C &nbsp; F R E E M I U M
          </Eyebrow>

          <h1 className="text-[44px] sm:text-[64px] lg:text-[84px] leading-[1.02] lg:leading-[0.98] tracking-[-0.028em] font-normal text-balance m-0">
            Évaluez votre<br />
            niveau en<br />
            <span className="font-serif italic text-ohe-accent">français</span>.
          </h1>

          <p className="mt-6 lg:mt-8 text-base lg:text-[17px] leading-[1.55] text-ohe-muted max-w-[460px] text-pretty">
            Un diagnostic court pour situer vos réflexes en orthographe et
            conjugaison. Résultat immédiat, gratuit, sans engagement.
          </p>

          <div className="mt-8 lg:mt-10 flex items-center gap-4">
            <Link
              href="/test/rules"
              className="inline-flex items-center justify-center gap-[14px] w-full sm:w-auto px-[26px] py-[16px] rounded-full text-sm font-medium tracking-[0.01em] bg-ohe-accent text-ohe-accent-ink border border-transparent hover:bg-ohe-ink transition-colors"
            >
              <span>Commencer le diagnostic</span>
              <span className="text-base">→</span>
            </Link>
          </div>
        </div>

        {/* Byline */}
        <div className="mt-12 lg:mt-16 pt-6 border-t border-ohe-line flex items-center gap-3.5">
          <Portrait size={42} src="/images/roxane.avif" alt="Roxane Joannidès" />
          <div>
            <div className="ohe-caption text-ohe-muted">Conçu par</div>
            <div className="text-sm mt-0.5">
              Roxane Joannidès{" "}
              <span className="text-ohe-muted">· Dr. sciences du langage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite : spec card */}
      <div className="bg-ohe-panel-tint border-t lg:border-t-0 lg:border-l border-ohe-line px-6 py-10 sm:px-10 lg:px-12 lg:py-10 flex flex-col relative overflow-hidden">
        <div className="ohe-eyebrow text-ohe-accent">
          ✱ Ce que vous obtenez
        </div>

        <div className="my-8 lg:my-auto flex flex-col">
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
                  <div className="font-serif italic text-[22px] lg:text-[26px] leading-[1.1] text-ohe-accent">
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

        <div
          className="absolute pointer-events-none select-none font-serif text-[180px] lg:text-[320px] -right-6 -bottom-10 lg:-right-10 lg:-bottom-20"
          style={{
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
