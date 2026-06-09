"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

interface LeadFiltersProps {
  showExport?: boolean;
}

export function LeadFilters({ showExport = true }: LeadFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // État local du champ de recherche (pour debounce)
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  // Met à jour les filtres dans l'URL
  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset pagination en cas de changement de filtre
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  // Debounce sur la recherche (500ms)
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

  // Helper pour exporter
  function exportCsv() {
    const params = new URLSearchParams(searchParams.toString());
    window.location.href = `/api/admin/leads/export?${params.toString()}`;
  }

  // Helper pour reset tous les filtres
  function resetFilters() {
    startTransition(() => {
      setSearchInput("");
      router.replace(pathname, { scroll: false });
    });
  }

  const currentPeriod = searchParams.get("period") ?? "all";
  const currentAdaptation = searchParams.get("adaptation") ?? "all";
  const currentMarketing = searchParams.get("marketing") ?? "all";
  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="bg-ohe-panel border border-ohe-line rounded-2xl px-5 py-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Recherche email */}
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher par email..."
            className="w-full px-4 py-2 text-sm border border-ohe-line rounded-full bg-ohe-bg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors"
          />
        </div>

        {/* Période */}
        <select
          value={currentPeriod}
          onChange={(e) => setFilter("period", e.target.value)}
          disabled={isPending}
          className="px-4 py-2 text-sm border border-ohe-line rounded-full bg-ohe-bg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors cursor-pointer"
        >
          <option value="all">Toute période</option>
          <option value="today">Aujourd&apos;hui</option>
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
        </select>

        {/* Adaptation */}
        <select
          value={currentAdaptation}
          onChange={(e) => setFilter("adaptation", e.target.value)}
          disabled={isPending}
          className="px-4 py-2 text-sm border border-ohe-line rounded-full bg-ohe-bg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors cursor-pointer"
        >
          <option value="all">Tous profils</option>
          <option value="adapted">Profil adapté</option>
          <option value="not_adapted">Profil non adapté</option>
        </select>

        {/* Marketing opt-in */}
        <select
          value={currentMarketing}
          onChange={(e) => setFilter("marketing", e.target.value)}
          disabled={isPending}
          className="px-4 py-2 text-sm border border-ohe-line rounded-full bg-ohe-bg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors cursor-pointer"
        >
          <option value="all">Marketing : tous</option>
          <option value="yes">Marketing : oui</option>
          <option value="no">Marketing : non</option>
        </select>

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className="text-xs text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors px-2">
            Réinitialiser
          </button>
        )}

        {showExport && (
          <button type="button" onClick={exportCsv} className="ml-auto inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-ohe-accent text-ohe-accent-ink hover:bg-ohe-ink transition-colors">
            Export CSV
            <span>↓</span>
          </button>
        )}
      </div>
    </div>
  );
}
