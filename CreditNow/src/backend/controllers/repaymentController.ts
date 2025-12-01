import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// User: Get Repayment Schedule
export const getRepayments = async (req: AuthRequest, res: Response) => {
    try {
        const { loanId } = req.params;
        const userId = req.user!.id;

        // Verify loan belongs to user
        const loan = await prisma.loanApplication.findUnique({
            where: { id: Number(loanId) }
        });

        if (!loan || loan.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const repayments = await prisma.loanRepayment.findMany({
            where: { loanId: Number(loanId) },
            include: { payments: true }
        });

        res.json(repayments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// User: Make Payment
export const makePayment = async (req: AuthRequest, res: Response) => {
    try {
        const { repaymentId, amount, method } = req.body;

        const repayment = await prisma.loanRepayment.findUnique({
            where: { id: Number(repaymentId) }
        });

        if (!repayment) {
            return res.status(404).json({ message: 'Repayment not found' });
        }

        // Create Payment Record
        const payment = await prisma.payment.create({
            data: {
                repaymentId: Number(repaymentId),
                amount,
                method, // CARD, UPI, NETBANKING
                status: 'success',
                transactionId: `TXN-${Date.now()}`
            }
        });

        // Update Repayment Status
        const totalPaid = Number(repayment.amountPaid) + Number(amount);
        const status = totalPaid >= Number(repayment.amountDue) ? 'PAID' : 'PENDING'; // Or PARTIAL if we had it

        await prisma.loanRepayment.update({
            where: { id: Number(repaymentId) },
            data: {
                amountPaid: totalPaid,
                paymentStatus: status,
                paidAt: status === 'PAID' ? new Date() : null
            }
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
