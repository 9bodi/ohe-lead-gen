import Link from "next/link";
import { Logo } from "@/components/ui";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [leadsCount, contactsCount, resultsCount] = await Promise.all([
    prisma.lead.count(),
    prisma.contactRequest.count(),
    prisma.freemiumResult.count(),
  ]);

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink">
      <div className="border-b border-ohe-line">
        <div className="max-w-[1400px] mx-auto px-14 py-7 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size={32} withLabel />
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/admin" className="text-ohe-ink font-medium">
                Tableau de bord
              </Link>
              <Link href="/admin/leads" className="text-ohe-muted hover:text-ohe-ink transition-colors">
                Leads
              </Link>
              <Link href="/admin/contacts" className="text-ohe-muted hover:text-ohe-ink transition-colors">
                Demandes de contact
              </Link>
            </nav>
          </div>
          <form action={logoutAdmin}>
            <button type="submit" className="text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-14 py-12 space-y-12">
        <div>
          <div className="ohe-eyebrow text-ohe-accent">✱ Administration</div>
          <h1 className="mt-4 text-[48px] leading-[1.05] tracking-[-0.022em] font-normal text-balance">
            Tableau de bord{" "}
            <span className="font-serif italic text-ohe-accent">OHé</span>.
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-ohe-panel border border-ohe-line rounded-2xl px-7 py-7">
            <div className="ohe-caption text-ohe-muted">Leads freemium</div>
            <div className="mt-3 font-serif italic text-[56px] leading-none text-ohe-accent">{leadsCount}</div>
            <div className="mt-3 text-sm text-ohe-muted">Visiteurs ayant complété le test</div>
          </div>
          <div className="bg-ohe-panel border border-ohe-line rounded-2xl px-7 py-7">
            <div className="ohe-caption text-ohe-muted">Demandes de contact</div>
            <div className="mt-3 font-serif italic text-[56px] leading-none text-ohe-accent">{contactsCount}</div>
            <div className="mt-3 text-sm text-ohe-muted">Prospects B2B à traiter</div>
          </div>
          <div className="bg-ohe-panel border border-ohe-line rounded-2xl px-7 py-7">
            <div className="ohe-caption text-ohe-muted">Tests complétés</div>
            <div className="mt-3 font-serif italic text-[56px] leading-none text-ohe-accent">{resultsCount}</div>
            <div className="mt-3 text-sm text-ohe-muted">Résultats freemium en base</div>
          </div>
        </div>

        <div className="border-t border-ohe-line pt-10 space-y-4">
          <div className="ohe-eyebrow text-ohe-muted mb-6">Sections</div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/leads" className="block bg-ohe-panel-tint border border-ohe-line rounded-2xl px-7 py-6 hover:border-ohe-accent transition-colors">
              <div className="font-serif italic text-[24px] text-ohe-ink">Leads freemium →</div>
              <div className="mt-2 text-sm text-ohe-muted">Tous les visiteurs ayant complété le diagnostic gratuit. Export CSV disponible.</div>
            </Link>
            <Link href="/admin/contacts" className="block bg-ohe-panel-tint border border-ohe-line rounded-2xl px-7 py-6 hover:border-ohe-accent transition-colors">
              <div className="font-serif italic text-[24px] text-ohe-ink">Demandes de contact →</div>
              <div className="mt-2 text-sm text-ohe-muted">Prospects B2B ayant demandé un échange. À traiter rapidement.</div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
