import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Create or find a user
        let user = await prisma.user.findFirst({ where: { email: 'test_loan@example.com' } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: 'Test Loan User',
                    email: 'test_loan@example.com',
                    passwordHash: 'hashedpassword',
                    role: 'USER'
                }
            });
        }

        const userId = user.id;
        const loanType = 'personal';
        const amount = 50000;
        const tenure = 12;

        console.log('Simulating loan application...');

        // Logic from controller
        let product;

        // Define default loan products
        const defaultProducts: Record<string, any> = {
            'personal': {
                title: 'Personal Loan',
                description: 'Quick personal loan for your needs',
                interestRate: 12.0,
                maxAmount: 500000,
                minAmount: 10000,
                tenureMonths: 60
            }
        };

        const productData = defaultProducts[loanType];

        // Try to find existing product
        product = await prisma.loanProduct.findFirst({
            where: { title: productData.title }
        });

        // Create if doesn't exist
        if (!product) {
            console.log('Creating product...');
            product = await prisma.loanProduct.create({
                data: productData
            });
        }

        console.log('Product found/created:', product);
        console.log('Type of minAmount:', typeof product.minAmount);
        console.log('Value of minAmount:', product.minAmount);

        // Validate amount - mimicking the controller logic exactly
        // The controller has: if (amount < product.minAmount || amount > product.maxAmount)
        // Let's see if this throws or behaves weirdly
        try {
            // @ts-ignore
            if (amount < product.minAmount || amount > product.maxAmount) {
                console.log('Amount validation failed');
            } else {
                console.log('Amount validation passed');
            }
        } catch (e) {
            console.error('Error during comparison:', e);
        }

        console.log('Creating application...');
        const application = await prisma.loanApplication.create({
            data: {
                userId,
                productId: product.id,
                amount,
                tenure,
                interestRate: product.interestRate
            }
        });

        console.log('Application created:', application);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
