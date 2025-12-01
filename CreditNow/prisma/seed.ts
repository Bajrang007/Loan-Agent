import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create Loan Types
    const personalLoan = await prisma.loanType.upsert({
        where: { type: 'Personal Loan' },
        update: {},
        create: {
            type: 'Personal Loan',
            rate: 10.5,
            description: 'Unsecured loan for personal use.',
        },
    });

    const homeLoan = await prisma.loanType.upsert({
        where: { type: 'Home Loan' },
        update: {},
        create: {
            type: 'Home Loan',
            rate: 5.5,
            description: 'Loan for purchasing a property.',
        },
    });

    const autoLoan = await prisma.loanType.upsert({
        where: { type: 'Auto Loan' },
        update: {},
        create: {
            type: 'Auto Loan',
            rate: 7.0,
            description: 'Loan for purchasing a vehicle.',
        },
    });

    console.log('Created Loan Types:', { personalLoan, homeLoan, autoLoan });

    // 2. Create Users
    const john = await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            email: 'john@example.com',
            name: 'John Doe',
            income: 80000,
            creditScore: 750,
        },
    });

    const jane = await prisma.user.upsert({
        where: { email: 'jane@example.com' },
        update: {},
        create: {
            email: 'jane@example.com',
            name: 'Jane Smith',
            income: 15000,
            creditScore: 580,
        },
    });

    const mike = await prisma.user.upsert({
        where: { email: 'mike@example.com' },
        update: {},
        create: {
            email: 'mike@example.com',
            name: 'Mike Johnson',
            income: 45000,
            creditScore: 680,
        },
    });

    console.log('Created Users:', { john, jane, mike });

    // 3. Create Existing Loans
    const loan1 = await prisma.loan.create({
        data: {
            amount: 5000,
            months: 24,
            monthlyPayment: 231.5, // Approx
            status: 'APPROVED',
            userId: mike.id,
            loanTypeId: personalLoan.id,
        },
    });

    console.log('Created Loan:', loan1);

    console.log('Seeding finished.');
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
