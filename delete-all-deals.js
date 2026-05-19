const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Deleting all clicks...");
    const clickRes = await prisma.click.deleteMany({});
    console.log(`Deleted ${clickRes.count} clicks.`);

    console.log("Deleting all deals...");
    const dealRes = await prisma.deal.deleteMany({});
    console.log(`Deleted ${dealRes.count} deals.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
