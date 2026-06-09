// Requêtes Prisma pour la liste des leads admin
import { prisma } from "@/lib/prisma";

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
}

export interface LeadsQueryResult {
  leads: LeadWithResult[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function getLeads(options: LeadsQueryOptions = {}): Promise<LeadsQueryResult> {
  const page = Math.max(1, options.page ?? 1);
  const perPage = Math.max(1, Math.min(100, options.perPage ?? 50));

  const skip = (page - 1) * perPage;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
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
    prisma.lead.count(),
  ]);

  return {
    leads: leads as LeadWithResult[],
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}
