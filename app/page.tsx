import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // En dev, on liste les campagnes actives pour faciliter la navigation
  const campaigns = await prisma.campaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink px-14 py-10">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="flex items-baseline gap-4 text-ohe-accent">
          <span className="font-serif italic text-[26px] tracking-tight">OHé</span>
          <span className="ohe-caption opacity-75">Diagnostic</span>
        </div>

        <div className="space-y-4">
          <div className="ohe-eyebrow text-ohe-accent">✱ Environnement de développement</div>
          <h1 className="text-[60px] leading-[1.02] tracking-[-0.025em] font-normal text-balance">
            Lead-gen<br />
            <span className="font-serif italic text-ohe-accent">salon OHé</span>.
          </h1>
          <p className="text-base text-ohe-muted max-w-[520px] text-pretty">
            Application interne. Sélectionne une campagne active pour ouvrir
            son écran d&apos;accueil visiteur.
          </p>
        </div>

        <div className="space-y-3">
          <div className="ohe-caption text-ohe-muted">
            Campagnes actives ({campaigns.length})
          </div>
          {campaigns.length === 0 ? (
            <p className="text-sm text-ohe-muted italic">
              Aucune campagne active. Lance{" "}
              <code className="bg-ohe-panel-tint px-2 py-1 rounded text-ohe-ink">
                npm run db:seed
              </code>
              .
            </p>
          ) : (
            <ul className="divide-y divide-ohe-line border-y border-ohe-line">
              {campaigns.map((c) => (
                <li key={c.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-ohe-muted mt-0.5">
                      {c.location ?? "Sans lieu"}
                    </div>
                  </div>
                  <Link
                    href={`/${c.slug}`}
                    className="text-sm text-ohe-accent underline underline-offset-4 hover:no-underline"
                  >
                    /{c.slug} →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
