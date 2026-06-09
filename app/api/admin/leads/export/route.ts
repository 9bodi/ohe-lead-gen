import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getAllLeadsForExport, type LeadsQueryOptions } from "@/lib/admin/leads-query";

const LEVEL_LABELS: Record<string, string> = {
  non_maitrise: "Non maîtrisé",
  fragile: "Fragile",
  fonctionnel: "Fonctionnel",
  maitrise: "Maîtrisé",
};

// Échappe les valeurs pour CSV (escape guillemets, gère virgules et sauts de ligne)
function csvEscape(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(";") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  // Protection auth admin
  const authed = await isAuthenticated();
  if (!authed) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Récupérer les filtres depuis l'URL
  const sp = req.nextUrl.searchParams;
  const options: LeadsQueryOptions = {
    search: sp.get("search") ?? undefined,
    adaptation: (sp.get("adaptation") as LeadsQueryOptions["adaptation"]) ?? undefined,
    marketing: (sp.get("marketing") as LeadsQueryOptions["marketing"]) ?? undefined,
    period: (sp.get("period") as LeadsQueryOptions["period"]) ?? undefined,
  };

  const leads = await getAllLeadsForExport(options);

  // Construire le CSV
  // Séparateur point-virgule (compatible Excel FR), encodage UTF-8 avec BOM
  const headers = [
    "Date",
    "Heure",
    "Email",
    "Bloc 1 Score",
    "Bloc 1 Niveau",
    "Bloc 2 Score",
    "Bloc 2 Niveau",
    "Adaptation Score",
    "Adaptation Profil",
    "Marketing Opt-in",
    "Durée (sec)",
    "UTM Source",
    "UTM Campaign",
    "UTM Medium",
  ];

  const rows = leads.map((lead) => {
    const date = new Date(lead.createdAt);
    const dateStr = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const timeStr = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    return [
      csvEscape(dateStr),
      csvEscape(timeStr),
      csvEscape(lead.email),
      csvEscape(lead.result ? `${lead.result.block1Correct}/8` : ""),
      csvEscape(lead.result ? LEVEL_LABELS[lead.result.block1Level] : ""),
      csvEscape(lead.result ? `${lead.result.block2Correct}/8` : ""),
      csvEscape(lead.result ? LEVEL_LABELS[lead.result.block2Level] : ""),
      csvEscape(lead.result ? `${lead.result.adaptationScore}/3` : ""),
      csvEscape(lead.result ? (lead.result.adaptationProfile === "adapted" ? "Adapté" : "Non adapté") : ""),
      csvEscape(lead.marketingOptIn ? "Oui" : "Non"),
      csvEscape(lead.result ? String(Math.round(lead.result.durationMs / 1000)) : ""),
      csvEscape(lead.utmSource),
      csvEscape(lead.utmCampaign),
      csvEscape(lead.utmMedium),
    ].join(";");
  });

  const csv = [headers.map(csvEscape).join(";"), ...rows].join("\n");
  // BOM UTF-8 pour qu'Excel reconnaisse l'encodage
  const bom = "\uFEFF";
  const body = bom + csv;

  const filename = `ohe-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
