import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FormClient } from "./form-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FormPage({ params }: PageProps) {
  const { slug } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
  });

  if (!campaign || !campaign.isActive) {
    notFound();
  }

  return <FormClient campaignSlug={campaign.slug} />;
}
