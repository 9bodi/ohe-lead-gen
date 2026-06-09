import Link from "next/link";
import { Logo, ContactFilters } from "@/components/ui";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { getContacts, type ContactsQueryOptions } from "@/lib/admin/contacts-query";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    period?: string;
    withFreemium?: string;
    teamSize?: string;
  }>;
}

export default async function ContactsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page, 10) : 1;

  const options: ContactsQueryOptions = {
    page,
    perPage: 50,
    search: sp.search,
    period: sp.period as ContactsQueryOptions["period"],
    withFreemium: sp.withFreemium as ContactsQueryOptions["withFreemium"],
    teamSize: sp.teamSize,
  };

  const { contacts, total, totalPages } = await getContacts(options);

  const currentParams = new URLSearchParams();
  if (sp.search) currentParams.set("search", sp.search);
  if (sp.period) currentParams.set("period", sp.period);
  if (sp.withFreemium) currentParams.set("withFreemium", sp.withFreemium);
  if (sp.teamSize) currentParams.set("teamSize", sp.teamSize);

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink">
      <div className="border-b border-ohe-line">
        <div className="max-w-[1400px] mx-auto px-14 py-7 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size={32} withLabel />
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/admin" className="text-ohe-muted hover:text-ohe-ink transition-colors">
                Tableau de bord
              </Link>
              <Link href="/admin/leads" className="text-ohe-muted hover:text-ohe-ink transition-colors">
                Leads
              </Link>
              <Link href="/admin/contacts" className="text-ohe-ink font-medium">
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

      <div className="max-w-[1400px] mx-auto px-14 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="ohe-eyebrow text-ohe-accent">✱ Administration</div>
            <h1 className="mt-3 text-[40px] leading-[1.05] tracking-[-0.022em] font-normal text-balance">
              Demandes de <span className="font-serif italic text-ohe-accent">contact</span>
            </h1>
            <p className="mt-2 text-sm text-ohe-muted">
              {total} {total > 1 ? "demandes" : "demande"} {currentParams.toString() ? "correspondantes aux filtres" : "au total"}
            </p>
          </div>
        </div>

        <ContactFilters />

        {contacts.length === 0 ? (
          <div className="bg-ohe-panel-tint border border-ohe-line rounded-2xl px-10 py-16 text-center">
            <p className="text-ohe-muted">
              {currentParams.toString() ? "Aucune demande ne correspond à ces filtres." : "Aucune demande pour l'instant."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-ohe-panel border border-ohe-line rounded-2xl px-6 py-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    {/* Ligne 1 : nom + entreprise + date */}
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <div className="font-serif italic text-[22px] text-ohe-ink">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-sm text-ohe-muted">·</div>
                      <div className="text-sm font-medium text-ohe-ink">
                        {contact.company}
                      </div>
                      {contact.jobTitle && (
                        <>
                          <div className="text-sm text-ohe-muted">·</div>
                          <div className="text-[13px] text-ohe-muted italic">
                            {contact.jobTitle}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Ligne 2 : email + date */}
                    <div className="mt-2 flex items-center gap-4 text-[13px] text-ohe-muted">
                      <a href={`mailto:${contact.email}`} className="text-ohe-accent underline underline-offset-4 hover:no-underline">
                        {contact.email}
                      </a>
                      <span>·</span>
                      <span>
                        Reçue le {new Date(contact.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                        {" à "}
                        {new Date(contact.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Ligne 3 : badges (taille équipe + freemium) */}
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {contact.teamSize && (
                        <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] rounded-full bg-ohe-accent-soft text-ohe-accent">
                          Équipe : {contact.teamSize}
                        </span>
                      )}
                      {contact.freemiumResultId ? (
                        <Link href={`/result/${contact.freemiumResultId}`} target="_blank" className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                          A fait le test freemium →
                        </Link>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full bg-ohe-line-soft text-ohe-muted">
                          Contact direct
                        </span>
                      )}
                    </div>

                    {/* Message (si présent) */}
                    {contact.message && (
                      <div className="mt-4 pt-4 border-t border-ohe-line-soft">
                        <div className="ohe-caption text-ohe-muted mb-2">Message</div>
                        <p className="text-[14px] text-ohe-ink leading-[1.55] whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <a href={`mailto:${contact.email}?subject=Re%20%3A%20Diagnostic%20d%27%C3%A9quipe%20OH%C3%A9`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium bg-ohe-accent text-ohe-accent-ink hover:bg-ohe-ink transition-colors whitespace-nowrap">
                      Répondre
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="text-ohe-muted">Page {page} sur {totalPages}</div>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link href={`/admin/contacts?${currentParams.toString()}${currentParams.toString() ? "&" : ""}page=${page - 1}`} className="px-4 py-2 rounded-full border border-ohe-line text-ohe-ink hover:bg-ohe-panel-tint transition-colors">
                  ← Précédent
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/contacts?${currentParams.toString()}${currentParams.toString() ? "&" : ""}page=${page + 1}`} className="px-4 py-2 rounded-full border border-ohe-line text-ohe-ink hover:bg-ohe-panel-tint transition-colors">
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
