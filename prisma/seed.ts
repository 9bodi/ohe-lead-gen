// prisma/seed.ts
// Script pour insérer des données de test en dev

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Campagne de démo locale pour développer
  const demoCampaign = await prisma.campaign.upsert({
    where: { slug: "demo-locale-2026" },
    update: {},
    create: {
      name: "Démo Locale 2026",
      slug: "demo-locale-2026",
      location: "Bureau OHé — Test interne",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      isActive: true,
    },
  });

  console.log(`✅ Campaign created: ${demoCampaign.name} (slug: ${demoCampaign.slug})`);

  // Une campagne d'exemple "salon RH Paris" pour les tests du backoffice plus tard
  const parisCampaign = await prisma.campaign.upsert({
    where: { slug: "salon-rh-paris-2026" },
    update: {},
    create: {
      name: "Salon RH Paris 2026",
      slug: "salon-rh-paris-2026",
      location: "Porte de Versailles, Hall 4",
      startDate: new Date("2026-09-15"),
      endDate: new Date("2026-09-17"),
      isActive: false,
    },
  });

  console.log(`✅ Campaign created: ${parisCampaign.name} (slug: ${parisCampaign.slug})`);

  console.log("🌱 Seeding done.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
