import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Admin: Create Loan Product
export const createLoanProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, interestRate, maxAmount, minAmount, tenureMonths } = req.body;

        const product = await prisma.loanProduct.create({
            data: {
                title,
                description,
                interestRate,
                maxAmount,
                minAmount,
                tenureMonths
            }
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// User: Apply for Loan
export const applyForLoan = async (req: AuthRequest, res: Response) => {
    try {
        const { productId, loanType, amount, tenure } = req.body;
        const userId = req.user!.id;

        let product;

        // If productId is provided, use it
        if (productId) {
            product = await prisma.loanProduct.findUnique({ where: { id: productId } });
            if (!product) {
                return res.status(404).json({ message: 'Loan product not found' });
            }
        }
        // If loanType is provided, find or create a default product
        else if (loanType) {
            // Define default loan products
            const defaultProducts: Record<string, any> = {
                'personal': {
                    title: 'Personal Loan',
                    description: 'Quick personal loan for your needs',
                    interestRate: 12.0,
                    maxAmount: 500000,
                    minAmount: 10000,
                    tenureMonths: 60
                },
                'two-wheeler': {
                    title: 'Two Wheeler Loan',
                    description: 'Finance your dream bike',
                    interestRate: 10.5,
                    maxAmount: 150000,
                    minAmount: 20000,
                    tenureMonths: 36
                },
                'used-car': {
                    title: 'Used Car Loan',
                    description: 'Get your pre-owned car',
                    interestRate: 11.5,
                    maxAmount: 500000,
                    minAmount: 50000,
                    tenureMonths: 60
                },
                'tractor': {
                    title: 'Tractor Loan',
                    description: 'Finance agricultural equipment',
                    interestRate: 9.5,
                    maxAmount: 1000000,
                    minAmount: 100000,
                    tenureMonths: 84
                },
                'consumer-durable': {
                    title: 'Consumer Durable Loan',
                    description: 'Buy home appliances and electronics',
                    interestRate: 13.0,
                    maxAmount: 100000,
                    minAmount: 5000,
                    tenureMonths: 24
                }
            };

            const productData = defaultProducts[loanType];
            if (!productData) {
                return res.status(400).json({ message: 'Invalid loan type' });
            }

            // Try to find existing product
            product = await prisma.loanProduct.findFirst({
                where: { title: productData.title }
            });

            // Create if doesn't exist
            if (!product) {
                product = await prisma.loanProduct.create({
                    data: productData
                });
            }
        } else {
            return res.status(400).json({ message: 'Either productId or loanType is required' });
        }

        // Validate amount
        const minAmount = Number(product.minAmount);
        const maxAmount = Number(product.maxAmount);

        if (amount < minAmount || amount > maxAmount) {
            return res.status(400).json({
                message: `Loan amount must be between ₹${minAmount} and ₹${maxAmount}`
            });
        }

        // Create application
        const application = await prisma.loanApplication.create({
            data: {
                userId,
                productId: product.id,
                amount,
                tenure,
                interestRate: product.interestRate
export const getMyLoans = async (req: AuthRequest, res: Response) => {
                    try {
                        const userId = req.user!.id;
                        const loans = await prisma.loanApplication.findMany({
                            where: { userId },
                            include: { product: true, repayments: true }
                        });
                        res.json(loans);
                    } catch (error) {
                        res.status(500).json({ message: 'Server error', error });
                    }
                };

                // Admin: Get All Applications
                export const getAllApplications = async (req: AuthRequest, res: Response) => {
                    try {
                        const loans = await prisma.loanApplication.findMany({
                            include: { user: true, product: true }
                        });
                        res.json(loans);
                    } catch (error) {
                        res.status(500).json({ message: 'Server error', error });
                    }
                };

                // Admin: Approve/Reject Loan
                export const updateLoanStatus = async (req: AuthRequest, res: Response) => {

                    try {
                        const { id } = req.params;
                        const { status } = req.body; // APPROVED, REJECTED
                        const adminId = req.user!.id;

                        const loan = await prisma.loanApplication.update({
                            where: { id: Number(id) },
                            data: { status }
                        });

                        // Generate Repayments if Approved
                        if (status === 'APPROVED') {
                            const amount = Number(loan.amount);
                            const rate = Number(loan.interestRate) / 100 / 12;
                            const tenure = loan.tenure;

                            // EMI Calculation: [P x R x (1+R)^N]/[(1+R)^N-1]
                            const emi = (amount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);

                            const repayments = [];
                            let currentDate = new Date();

                            for (let i = 1; i <= tenure; i++) {
                                currentDate.setMonth(currentDate.getMonth() + 1);
                                repayments.push({
                                    loanId: loan.id,
                                    dueDate: new Date(currentDate),
                                    amountDue: emi,
                                    paymentStatus: 'PENDING'
                                });
                            }

                            // Bulk create repayments
                            // Note: createMany is not supported in SQLite, but we are using MySQL now.
                            // However, to be safe with all providers or if createMany has issues in older prisma, loop or use createMany.
                            // MySQL supports createMany.
                            await prisma.loanRepayment.createMany({
                                data: repayments as any // Type cast if necessary due to strict typing
                            });
                        }

                        // Log admin action
                        await prisma.adminAction.create({
                            data: {
                                adminId,
                                loanId: loan.id,
                                action: status === 'APPROVED' ? 'APPROVE' : 'REJECT',
                                note: `Loan ${status} by admin`
                            }
                        });

                        res.json(loan);
                    } catch (error) {
                        res.status(500).json({ message: 'Server error', error });
                    }
                };
