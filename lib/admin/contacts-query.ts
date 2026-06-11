// Requêtes Prisma pour les demandes de contact (B2C waitlist + B2B équipe)
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type ContactWithResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  teamSize: string | null;
  message: string | null;
  profile: string | null;
  requestType: string | null;
  freemiumResultId: string | null;
  createdAt: Date;
};

export interface ContactsQueryOptions {
  page?: number;
  perPage?: number;
  search?: string;
  period?: "today" | "7d" | "30d" | "all";
  withFreemium?: "yes" | "no" | "all";
  teamSize?: string;
  profile?: string; // valeur enum profile, ou "all"
}

export interface ContactsQueryResult {
  contacts: ContactWithResult[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

function buildWhereClause(options: ContactsQueryOptions): Prisma.ContactRequestWhereInput {
  const where: Prisma.ContactRequestWhereInput = {};

  if (options.search && options.search.trim()) {
    const s = options.search.trim();
    where.OR = [
      { email: { contains: s, mode: "insensitive" } },
      { firstName: { contains: s, mode: "insensitive" } },
      { lastName: { contains: s, mode: "insensitive" } },
      { company: { contains: s, mode: "insensitive" } },
    ];
  }

  if (options.period && options.period !== "all") {
    const now = new Date();
    let since: Date;
    if (options.period === "today") {
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (options.period === "7d") {
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    where.createdAt = { gte: since };
  }

  if (options.withFreemium === "yes") {
    where.freemiumResultId = { not: null };
  } else if (options.withFreemium === "no") {
    where.freemiumResultId = null;
  }

  if (options.teamSize && options.teamSize !== "all") {
    where.teamSize = options.teamSize;
  }

  if (options.profile && options.profile !== "all") {
    where.profile = options.profile;
  }

  return where;
}

export async function getContacts(options: ContactsQueryOptions = {}): Promise<ContactsQueryResult> {
  const page = Math.max(1, options.page ?? 1);
  const perPage = Math.max(1, Math.min(100, options.perPage ?? 50));
  const skip = (page - 1) * perPage;

  const where = buildWhereClause(options);

  const [contacts, total] = await Promise.all([
    prisma.contactRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.contactRequest.count({ where }),
  ]);

  return {
    contacts: contacts as ContactWithResult[],
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function getAllContactsForExport(options: ContactsQueryOptions = {}): Promise<ContactWithResult[]> {
  const where = buildWhereClause(options);

  const contacts = await prisma.contactRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return contacts as ContactWithResult[];
}