const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
    console.log(`Total Users in Database: ${users.length}`);
    users.forEach((u, i) => {
        console.log(`${i+1}. ID: ${u.id}`);
        console.log(`   Name: ${u.name || 'No Name'} | Email: ${u.email || 'No Email'}`);
        console.log(`   Role: ${u.role} | Created: ${u.createdAt.toISOString()}`);
    });
}
main().catch(console.error).finally(() => prisma.$disconnect());
