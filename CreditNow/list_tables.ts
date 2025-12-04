import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.$queryRaw`SHOW TABLES`;
        console.log(result);
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
