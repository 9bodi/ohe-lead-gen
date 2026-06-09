"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

const TEAM_SIZE_LABELS: Record<string, string> = {
  "1-10": "1-10",
  "11-50": "11-50",
  "51-200": "51-200",
  "201-500": "201-500",
  "500+": "500+",
};

export function ContactFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const current = searchParams.get("search") ?? "";
      if (searchInput !== current) {
        setFilter("search", searchInput);
      }
    }, 500);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function exportCsv() {
    const params = new URLSearchParams(searchParams.toString());
    window.location.href = `/api/admin/contacts/export?${params.toString()}`;
  }

  function resetFilters() {
    startTransition(() => {
      setSearchInput("");
      router.replace(pathname, { scroll: false });
    });
  }

  const currentPeriod = searchParams.get("period") ?? "all";
  const currentWithFreemium = searchParams.get("withFreemium") ?? "all";
  const currentTeamSize = searchParams.get("teamSize") ?? "all";
  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="bg-ohe-panel border border-ohe-line rounded-2xl px-5 py-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher (nom, email, entreprise...)"
            className="w-full px-4 py-2 text-sm border border-ohe-line rounded-full bg-ohe-bg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors"
          />
        </div>

        <select value={currentPeriod} onChange={(e) => setFilter("period", e.target.value)} disabled={isPending} className="px-4 py-2 text-sm border border-ohe-line rounded-full bg-ohe-bg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors cursor-pointer">
          <option value="all">Toute période</option>
          <option value="today">Aujourd&apos;hui</option>
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
        </select>

        <select value={currentTeamSize} onChange={(e) => setFilter("teamSize", e.target.value)} disabled={isPending} className="px-4 py-2 text-sm border border-ohe-line rounded-full bg-ohe-bg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors cursor-pointer">
          <option value="all">Toute taille</option>
          {Object.keys(TEAM_SIZE_LABELS).map((size) => (
            <option key={size} value={size}>{size} pers.</option>
          ))}
        </select>

        <select value={currentWithFreemium} onChange={(e) => setFilter("withFreemium", e.target.value)} disabled={isPending} className="px-4 py-2 text-sm border border-ohe-line rounded-full bg-ohe-bg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors cursor-pointer">
          <option value="all">Tous prospects</option>
          <option value="yes">A fait le test freemium</option>
          <option value="no">Contact direct</option>
        </select>

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className="text-xs text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors px-2">
            Réinitialiser
          </button>
        )}

        <button type="button" onClick={exportCsv} className="ml-auto inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-ohe-accent text-ohe-accent-ink hover:bg-ohe-ink transition-colors">
          Export CSV
          <span>↓</span>
        </button>
      </div>
    </div>
  );
}
