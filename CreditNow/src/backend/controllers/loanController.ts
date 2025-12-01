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
        const { productId, amount, tenure } = req.body;
        const userId = req.user!.id;

        // Validate product
        const product = await prisma.loanProduct.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: 'Loan product not found' });
        }

        // Create application
        const application = await prisma.loanApplication.create({
            data: {
                userId,
                productId,
                amount,
                tenure,
                interestRate: product.interestRate
            }
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// User: Get My Loans
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
