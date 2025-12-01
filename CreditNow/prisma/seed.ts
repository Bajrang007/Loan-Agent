import { PrismaClient, Role, LoanStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create Loan Products
    const personalLoan = await prisma.loanProduct.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: 'Personal Loan',
            description: 'Unsecured loan for personal use.',
            interestRate: 10.5,
            maxAmount: 500000,
            minAmount: 10000,
            tenureMonths: 60
        },
    });

    const homeLoan = await prisma.loanProduct.upsert({
        where: { id: 2 },
        update: {},
        create: {
            title: 'Home Loan',
            description: 'Loan for purchasing a property.',
            interestRate: 8.5,
            maxAmount: 10000000,
            minAmount: 500000,
            tenureMonths: 240
        },
    });

    const twoWheelerLoan = await prisma.loanProduct.upsert({
        where: { id: 3 },
        update: {},
        create: {
            title: 'Two-Wheeler Loan',
            description: 'Loan for purchasing a two-wheeler.',
            interestRate: 11.0,
            maxAmount: 200000,
            minAmount: 20000,
            tenureMonths: 36
        },
    });

    console.log('Created Loan Products');

    // 2. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@creditnow.com' },
        update: {},
        create: {
            email: 'admin@creditnow.com',
            name: 'Admin User',
            passwordHash,
            role: Role.ADMIN,
            phone: '9999999999'
        },
    });

    const user1 = await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            email: 'john@example.com',
            name: 'John Doe',
            passwordHash,
            role: Role.USER,
            phone: '9876543210',
            address: '123 Main St, City'
        },
    });

    // ... (previous users)

    const sarah = await prisma.user.upsert({
        where: { email: 'sarah@example.com' },
        update: {},
        create: {
            email: 'sarah@example.com',
            name: 'Sarah Connor',
            passwordHash,
            role: Role.USER,
            phone: '9876543211',
            address: '456 Terminator Blvd'
        },
    });

    const mike = await prisma.user.upsert({
        where: { email: 'mike@example.com' },
        update: {},
        create: {
            email: 'mike@example.com',
            name: 'Mike Ross',
            passwordHash,
            role: Role.USER,
            phone: '9876543212',
            address: '789 Pearson Specter'
        },
    });

    const emily = await prisma.user.upsert({
        where: { email: 'emily@example.com' },
        update: {},
        create: {
            email: 'emily@example.com',
            name: 'Emily Blunt',
            passwordHash,
            role: Role.USER,
            phone: '9876543213',
            address: '321 Quiet Place'
        },
    });

    const david = await prisma.user.upsert({
        where: { email: 'david@example.com' },
        update: {},
        create: {
            email: 'david@example.com',
            name: 'David Beckham',
            passwordHash,
            role: Role.USER,
            phone: '9876543214',
            address: '101 Football Lane'
        },
    });

    const lisa = await prisma.user.upsert({
        where: { email: 'lisa@example.com' },
        update: {},
        create: {
            email: 'lisa@example.com',
            name: 'Lisa Kudrow',
            passwordHash,
            role: Role.USER,
            phone: '9876543215',
            address: '202 Friends Apt'
        },
    });

    console.log('Created Additional Users');

    // 3. Create Loan Applications
    // John's Loan (Existing)
    await prisma.loanApplication.create({
        data: {
            userId: user1.id,
            productId: twoWheelerLoan.id,
            amount: 50000,
            tenure: 24,
            interestRate: 11.0,
            status: LoanStatus.APPROVED,
            repayments: {
                create: [
                    { dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), amountDue: 2330.00 },
                    { dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)), amountDue: 2330.00 }
                ]
            }
        },
    });

    // Sarah: Home Loan (Pending)
    await prisma.loanApplication.create({
        data: {
            userId: sarah.id,
            productId: homeLoan.id,
            amount: 5000000,
            tenure: 240,
            interestRate: 8.5,
            status: LoanStatus.PENDING
        }
    });

    // Mike: Personal Loan (Rejected)
    await prisma.loanApplication.create({
        data: {
            userId: mike.id,
            productId: personalLoan.id,
            amount: 100000,
            tenure: 12,
            interestRate: 10.5,
            status: LoanStatus.REJECTED
        }
    });

    // Emily: Two Wheeler (Approved & Active)
    await prisma.loanApplication.create({
        data: {
            userId: emily.id,
            productId: twoWheelerLoan.id,
            amount: 80000,
            tenure: 36,
            interestRate: 11.0,
            status: LoanStatus.APPROVED,
            repayments: {
                create: [
                    { dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), amountDue: 2600.00 }
                ]
            }
        }
    });

    // David: Personal Loan (Approved)
    await prisma.loanApplication.create({
        data: {
            userId: david.id,
            productId: personalLoan.id,
            amount: 200000,
            tenure: 48,
            interestRate: 10.5,
            status: LoanStatus.APPROVED
        }
    });

    console.log('Created Loan Applications for all users');

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
