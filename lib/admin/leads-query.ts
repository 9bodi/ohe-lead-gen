// Requêtes Prisma pour la liste des leads admin
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type LeadWithResult = {
  id: string;
  email: string;
  marketingOptIn: boolean;
  utmSource: string | null;
  utmCampaign: string | null;
  utmMedium: string | null;
  createdAt: Date;
  result: {
    id: string;
    block1Correct: number;
    block1Level: string;
    block2Correct: number;
    block2Level: string;
    adaptationScore: number;
    adaptationProfile: string;
    durationMs: number;
  } | null;
};

export interface LeadsQueryOptions {
  page?: number;
  perPage?: number;
  // Filtres
  search?: string;            // recherche par email
  adaptation?: "adapted" | "not_adapted" | "all";
  marketing?: "yes" | "no" | "all";
  period?: "today" | "7d" | "30d" | "all";
}

export interface LeadsQueryResult {
  leads: LeadWithResult[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

function buildWhereClause(options: LeadsQueryOptions): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};

  // Recherche email
  if (options.search && options.search.trim()) {
    where.email = { contains: options.search.trim(), mode: "insensitive" };
  }

  // Filtre marketing
  if (options.marketing === "yes") {
    where.marketingOptIn = true;
  } else if (options.marketing === "no") {
    where.marketingOptIn = false;
  }

  // Filtre période
  if (options.period && options.period !== "all") {
    const now = new Date();
    let since: Date;
    if (options.period === "today") {
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (options.period === "7d") {
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      // 30d
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    where.createdAt = { gte: since };
  }

  // Filtre adaptation (sur la relation result)
  if (options.adaptation === "adapted") {
    where.result = { adaptationProfile: "adapted" };
  } else if (options.adaptation === "not_adapted") {
    where.result = { adaptationProfile: "not_adapted" };
  }

  return where;
}

export async function getLeads(options: LeadsQueryOptions = {}): Promise<LeadsQueryResult> {
  const page = Math.max(1, options.page ?? 1);
  const perPage = Math.max(1, Math.min(100, options.perPage ?? 50));
  const skip = (page - 1) * perPage;

  const where = buildWhereClause(options);

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      include: {
        result: {
          select: {
            id: true,
            block1Correct: true,
            block1Level: true,
            block2Correct: true,
            block2Level: true,
            adaptationScore: true,
            adaptationProfile: true,
            durationMs: true,
          },
        },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    leads: leads as LeadWithResult[],
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

// Version sans pagination pour l'export CSV
export async function getAllLeadsForExport(options: LeadsQueryOptions = {}): Promise<LeadWithResult[]> {
  const where = buildWhereClause(options);

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      result: {
        select: {
          id: true,
          block1Correct: true,
          block1Level: true,
          block2Correct: true,
          block2Level: true,
          adaptationScore: true,
          adaptationProfile: true,
          durationMs: true,
        },
      },
    },
  });

  return leads as LeadWithResult[];
}
