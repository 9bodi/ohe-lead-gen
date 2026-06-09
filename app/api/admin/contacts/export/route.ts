import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getAllContactsForExport, type ContactsQueryOptions } from "@/lib/admin/contacts-query";

function csvEscape(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(";") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const options: ContactsQueryOptions = {
    search: sp.get("search") ?? undefined,
    period: (sp.get("period") as ContactsQueryOptions["period"]) ?? undefined,
    withFreemium: (sp.get("withFreemium") as ContactsQueryOptions["withFreemium"]) ?? undefined,
    teamSize: sp.get("teamSize") ?? undefined,
  };

  const contacts = await getAllContactsForExport(options);

  const headers = [
    "Date",
    "Heure",
    "Prénom",
    "Nom",
    "Email",
    "Entreprise",
    "Rôle",
    "Taille équipe",
    "Message",
    "A fait le freemium",
    "ID résultat freemium",
  ];

  const rows = contacts.map((c) => {
    const date = new Date(c.createdAt);
    const dateStr = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const timeStr = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    return [
      csvEscape(dateStr),
      csvEscape(timeStr),
      csvEscape(c.firstName),
      csvEscape(c.lastName),
      csvEscape(c.email),
      csvEscape(c.company),
      csvEscape(c.jobTitle),
      csvEscape(c.teamSize),
      csvEscape(c.message),
      csvEscape(c.freemiumResultId ? "Oui" : "Non"),
      csvEscape(c.freemiumResultId),
    ].join(";");
  });

  const csv = [headers.map(csvEscape).join(";"), ...rows].join("\n");
  const bom = "\uFEFF";
  const body = bom + csv;

  const filename = `ohe-contacts-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
