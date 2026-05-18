import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestClient } from "./test-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const { slug } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
  });

  if (!campaign || !campaign.isActive) {
    notFound();
  }

  return <TestClient campaignSlug={campaign.slug} />;
}
