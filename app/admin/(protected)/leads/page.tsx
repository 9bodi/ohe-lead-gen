import Link from "next/link";
import { Logo, LeadFilters } from "@/components/ui";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { getLeads, type LeadsQueryOptions } from "@/lib/admin/leads-query";

const LEVEL_LABELS: Record<string, string> = {
  non_maitrise: "Non maîtrisé",
  fragile: "Fragile",
  fonctionnel: "Fonctionnel",
  maitrise: "Maîtrisé",
};

const LEVEL_DOT: Record<string, string> = {
  non_maitrise: "bg-red-500",
  fragile: "bg-orange-500",
  fonctionnel: "bg-blue-500",
  maitrise: "bg-emerald-500",
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    adaptation?: string;
    marketing?: string;
    period?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page, 10) : 1;

  const options: LeadsQueryOptions = {
    page,
    perPage: 50,
    search: sp.search,
    adaptation: sp.adaptation as LeadsQueryOptions["adaptation"],
    marketing: sp.marketing as LeadsQueryOptions["marketing"],
    period: sp.period as LeadsQueryOptions["period"],
  };

  const { leads, total, totalPages } = await getLeads(options);

  // Conserver les filtres dans les liens de pagination
  const currentParams = new URLSearchParams();
  if (sp.search) currentParams.set("search", sp.search);
  if (sp.adaptation) currentParams.set("adaptation", sp.adaptation);
  if (sp.marketing) currentParams.set("marketing", sp.marketing);
  if (sp.period) currentParams.set("period", sp.period);

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink">
      {/* Header */}
      <div className="border-b border-ohe-line">
        <div className="max-w-[1400px] mx-auto px-14 py-7 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size={32} withLabel />
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/admin" className="text-ohe-muted hover:text-ohe-ink transition-colors">
                Tableau de bord
              </Link>
              <Link href="/admin/leads" className="text-ohe-ink font-medium">
                Tests complétés
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

      {/* Contenu */}
      <div className="max-w-[1400px] mx-auto px-14 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="ohe-eyebrow text-ohe-accent">Administration</div>
            <h1 className="mt-3 text-[40px] leading-[1.05] tracking-[-0.022em] font-normal text-balance">
              Tests <span className="font-serif italic text-ohe-accent">complétés</span>
            </h1>
            <p className="mt-2 text-sm text-ohe-muted">
              {total} {total > 1 ? "tests" : "test"} {currentParams.toString() ? "correspondants aux filtres" : "au total"}
            </p>
          </div>
        </div>

        {/* Barre de filtres */}
        <LeadFilters />

        {/* Tableau */}
        {leads.length === 0 ? (
          <div className="bg-ohe-panel-tint border border-ohe-line rounded-2xl px-10 py-16 text-center">
            <p className="text-ohe-muted">
              {currentParams.toString() ? "Aucun test ne correspond à ces filtres." : "Aucun test pour l'instant."}
            </p>
          </div>
        ) : (
          <div className="bg-ohe-panel border border-ohe-line rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ohe-panel-tint border-b border-ohe-line">
                <tr>
                  <th className="text-left px-5 py-4 font-medium text-ohe-muted ohe-caption" style={{ letterSpacing: "0.18em" }}>Date</th>
                  <th className="text-left px-5 py-4 font-medium text-ohe-muted ohe-caption" style={{ letterSpacing: "0.18em" }}>Email</th>
                  <th className="text-left px-5 py-4 font-medium text-ohe-muted ohe-caption" style={{ letterSpacing: "0.18em" }}>Singulier/pluriel</th>
                  <th className="text-left px-5 py-4 font-medium text-ohe-muted ohe-caption" style={{ letterSpacing: "0.18em" }}>Conjugaison</th>
                  <th className="text-left px-5 py-4 font-medium text-ohe-muted ohe-caption" style={{ letterSpacing: "0.18em" }}>Adaptation</th>
                  <th className="text-left px-5 py-4 font-medium text-ohe-muted ohe-caption" style={{ letterSpacing: "0.18em" }}>Marketing</th>
                  <th className="text-left px-5 py-4 font-medium text-ohe-muted ohe-caption" style={{ letterSpacing: "0.18em" }}>Source</th>
                  <th className="text-right px-5 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ohe-line-soft">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-ohe-panel-tint transition-colors">
                    <td className="px-5 py-4 text-ohe-muted">
                      {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      <div className="text-[11px] opacity-70">
                        {new Date(lead.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-ohe-ink">{lead.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      {lead.result ? (
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${LEVEL_DOT[lead.result.block1Level]}`} />
                          <span className="font-serif italic">{lead.result.block1Correct}/8</span>
                          <span className="text-[11px] text-ohe-muted">{LEVEL_LABELS[lead.result.block1Level]}</span>
                        </div>
                      ) : <span className="text-ohe-muted">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {lead.result ? (
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${LEVEL_DOT[lead.result.block2Level]}`} />
                          <span className="font-serif italic">{lead.result.block2Correct}/8</span>
                          <span className="text-[11px] text-ohe-muted">{LEVEL_LABELS[lead.result.block2Level]}</span>
                        </div>
                      ) : <span className="text-ohe-muted">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {lead.result ? (
                        <div>
                          <span className="font-serif italic">{lead.result.adaptationScore}/3</span>
                          <div className="text-[11px] text-ohe-muted">
                            {lead.result.adaptationProfile === "adapted" ? "Adapté" : "Non adapté"}
                          </div>
                        </div>
                      ) : <span className="text-ohe-muted">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {lead.marketingOptIn ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Oui</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-ohe-line-soft text-ohe-muted">Non</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-ohe-muted text-[12px]">
                      {lead.utmSource || <span className="opacity-50">—</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {lead.result && (
                        <Link href={`/result/${lead.result.id}`} target="_blank" className="text-ohe-accent underline underline-offset-4 hover:no-underline text-[12px]">
                          Voir
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="text-ohe-muted">
              Page {page} sur {totalPages}
            </div>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link href={`/admin/leads?${currentParams.toString()}${currentParams.toString() ? "&" : ""}page=${page - 1}`} className="px-4 py-2 rounded-full border border-ohe-line text-ohe-ink hover:bg-ohe-panel-tint transition-colors">
                  ← Précédent
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/leads?${currentParams.toString()}${currentParams.toString() ? "&" : ""}page=${page + 1}`} className="px-4 py-2 rounded-full border border-ohe-line text-ohe-ink hover:bg-ohe-panel-tint transition-colors">
                  Suivant →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}