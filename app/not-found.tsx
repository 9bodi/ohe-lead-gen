import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-ohe-bg text-ohe-ink px-6">
      <div className="text-center max-w-md">
        <div className="ohe-caption text-ohe-accent mb-4">✱ 404</div>
        <h1 className="text-[60px] leading-[1.02] tracking-[-0.025em] font-normal text-balance">
          Cette page<br />
          <span className="font-serif italic text-ohe-accent">n&apos;existe pas</span>.
        </h1>
        <p className="mt-6 text-base text-ohe-muted text-pretty">
          La page demandée n&apos;a pas été trouvée.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-3 text-sm text-ohe-accent underline underline-offset-4"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
