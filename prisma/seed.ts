// prisma/seed.ts
// Script pour insérer la campagne web-freemium par défaut

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Campagne par défaut : tous les leads du site OHé y sont rattachés
  const webFreemium = await prisma.campaign.upsert({
    where: { slug: "web-freemium" },
    update: {},
    create: {
      name: "Web Freemium",
      slug: "web-freemium",
      type: "web_freemium",
      isActive: true,
    },
  });

  console.log(`✅ Campaign: ${webFreemium.name} (${webFreemium.slug})`);

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
