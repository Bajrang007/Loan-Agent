import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to connect to the database...');
        await prisma.$connect();
        console.log('Successfully connected to the database.');

        // Try a simple query
        const userCount = await prisma.user.count();
        console.log(`Found ${userCount} users.`);

        const loanTypes = await prisma.loanType.findMany();
        console.log(`Found ${loanTypes.length} loan types:`, loanTypes.map(lt => lt.type).join(', '));

    } catch (e) {
        console.error('Error connecting to or querying database:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
