import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink px-14 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex items-baseline gap-4 text-ohe-accent">
          <span className="font-serif italic text-[26px]">OHé</span>
          <span className="ohe-caption opacity-75">Diagnostic</span>
        </div>

        <div className="space-y-4">
          <div className="ohe-eyebrow text-ohe-accent">✱ Page en construction</div>
          <h1 className="text-[60px] leading-[1.02] tracking-[-0.025em] font-normal text-balance">
            Accueil{" "}
            <span className="font-serif italic text-ohe-accent">à venir</span>.
          </h1>
          <p className="text-base text-ohe-muted max-w-[520px] text-pretty">
            La vraie page d&apos;accueil sera construite au palier C.4. En
            attendant, tu peux lancer le test directement.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/test/rules"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium bg-ohe-accent text-ohe-accent-ink hover:bg-ohe-ink transition-colors"
          >
            Démarrer le test <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
