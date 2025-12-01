import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying seed data...');

    const userCount = await prisma.user.count();
    const loanTypeCount = await prisma.loanType.count();
    const loanCount = await prisma.loan.count();

    console.log(`Users: ${userCount}`);
    console.log(`Loan Types: ${loanTypeCount}`);
    console.log(`Loans: ${loanCount}`);

    const john = await prisma.user.findUnique({ where: { email: 'john@example.com' } });
    if (john) {
        console.log('Found John:', john.email);
    } else {
        console.error('John not found!');
    }

    const personalLoan = await prisma.loanType.findUnique({ where: { type: 'Personal Loan' } });
    if (personalLoan) {
        console.log('Found Personal Loan Type');
    } else {
        console.error('Personal Loan Type not found!');
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
