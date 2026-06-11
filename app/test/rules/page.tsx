import Link from "next/link";
import { Eyebrow, Logo } from "@/components/ui";

export default function RulesPage() {
  const rules = [
    {
      num: "01",
      title: "Chronométré",
      body: "Vous avez 10 secondes pour répondre à chaque question. Au-delà, la question passe automatiquement.",
    },
    {
      num: "02",
      title: "Pas de retour en arrière",
      body: "Une fois validée, votre réponse est définitive. Vos premières intuitions sont les meilleures.",
    },
    {
      num: "03",
      title: "Résultat à la fin",
      body: "Votre maîtrise et votre besoin seront affichés à la fin du test. Aucun affichage de score pendant les questions.",
    },
  ];

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink flex flex-col">
      {/* Header : logo + retour */}
      <div className="px-6 py-6 sm:px-10 lg:px-14 flex items-center justify-between gap-4">
        <Logo size={32} withLabel />
        <Link
          href="/accueil"
          className="text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors shrink-0"
        >
          ← Retour
        </Link>
      </div>

      {/* Contenu centré */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
        <div className="max-w-[720px] w-full">
          <Eyebrow tone="accent">A V A N T &nbsp; D E &nbsp; C O M M E N C E R</Eyebrow>

          <h1 className="mt-6 text-[38px] sm:text-[48px] lg:text-[56px] leading-[1.06] lg:leading-[1.05] tracking-[-0.022em] font-normal text-balance">
            Trois règles
          </h1>

          <div className="mt-8 lg:mt-10 flex flex-col">
            {rules.map((rule, i) => {
              const isFirst = i === 0;
              const isLast = i === rules.length - 1;
              return (
                <div
                  key={rule.num}
                  className={`
                    grid grid-cols-[44px_1fr] sm:grid-cols-[60px_1fr] gap-4 sm:gap-6 py-5 sm:py-6
                    ${isFirst ? "border-t border-ohe-line" : ""}
                    ${isLast ? "border-b border-ohe-line" : "border-b border-ohe-line-soft"}
                  `}
                >
                  <div className="text-[11px] tracking-[0.2em] text-ohe-accent pt-1.5 font-medium">
                    {rule.num}
                  </div>
                  <div>
                    <div className="text-[20px] sm:text-[22px] font-medium text-ohe-ink">
                      {rule.title}
                    </div>
                    <div className="text-[14px] text-ohe-muted mt-2 text-pretty leading-[1.55]">
                      {rule.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA seul */}
          <div className="mt-8 lg:mt-10">
            <Link
              href="/test"
              className="inline-flex items-center justify-center gap-[14px] w-full sm:w-auto px-[26px] py-[16px] rounded-full text-sm font-medium tracking-[0.01em] bg-ohe-accent text-ohe-accent-ink border border-transparent hover:bg-ohe-ink transition-colors"
            >
              <span>Je commence</span>
              <span className="text-base">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
