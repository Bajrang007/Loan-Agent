import { tool } from 'genkit';
import { z } from 'zod';
import db from '@/lib/db';

export const calculateLoan = tool(
    {
        name: 'calculateLoan',
        description: 'Calculates the monthly payment for a loan based on amount, months, and interest rate.',
        inputSchema: z.object({
            amount: z.number().describe('The total loan amount'),
            months: z.number().describe('The duration of the loan in months'),
            rate: z.number().describe('The annual interest rate in percentage (e.g., 5.5 for 5.5%)'),
        }),
        outputSchema: z.object({
            monthlyPayment: z.number(),
            totalPayment: z.number(),
            totalInterest: z.number(),
        }),
    },
    async ({ amount, months, rate }) => {
        const monthlyRate = rate / 100 / 12;
        const monthlyPayment =
            (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        const totalPayment = monthlyPayment * months;
        const totalInterest = totalPayment - amount;

        return {
            monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
            totalPayment: parseFloat(totalPayment.toFixed(2)),
            totalInterest: parseFloat(totalInterest.toFixed(2)),
        };
    }
);

export const checkEligibility = tool(
    {
        name: 'checkEligibility',
        description: 'Checks if a user is eligible for a loan based on their email.',
        inputSchema: z.object({
            email: z.string().email().describe('Email of the applicant'),
        }),
        outputSchema: z.object({
            isEligible: z.boolean(),
            reason: z.string().optional(),
            maxLoanAmount: z.number().optional(),
        }),
    },
    async ({ email }) => {
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return {
                isEligible: false,
                reason: 'User not found. Please register first.',
            };
        }

        if (user.creditScore < 600) {
            return {
                isEligible: false,
                reason: 'Credit score is too low. Minimum required is 600.',
            };
        }

        if (user.income < 20000) {
            return {
                isEligible: false,
                reason: 'Income is too low. Minimum annual income required is $20,000.',
            };
        }

        const maxLoanAmount = user.income * 0.5;

        return {
            isEligible: true,
            maxLoanAmount,
        };
    }
);

export const getLoanTypes = tool(
    {
        name: 'getLoanTypes',
        description: 'Returns a list of available loan types and their current starting interest rates.',
        inputSchema: z.object({}),
        outputSchema: z.array(
            z.object({
                type: z.string(),
                rate: z.number(),
                description: z.string(),
            })
        ),
    },
    async () => {
        const types = await db.loanType.findMany();
        return types.map(t => ({
            type: t.type,
            rate: t.rate,
            description: t.description,
        }));
    }
);

export const applyForLoan = tool(
    {
        name: 'applyForLoan',
        description: 'Applies for a loan for the user.',
        inputSchema: z.object({
            email: z.string().email(),
            loanType: z.string(),
            amount: z.number(),
            months: z.number(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
            loanId: z.string().optional(),
        }),
    },
    async ({ email, loanType, amount, months }) => {
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return { success: false, message: 'User not found.' };
        }

        const type = await db.loanType.findUnique({ where: { type: loanType } });
        if (!type) {
            return { success: false, message: 'Invalid loan type.' };
        }

        // Calculate payment
        const monthlyRate = type.rate / 100 / 12;
        const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

        const loan = await db.loan.create({
            data: {
                amount,
                months,
                monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
                status: 'PENDING',
                userId: user.id,
                loanTypeId: type.id,
            },
        });

        return {
            success: true,
            message: `Loan application submitted successfully! Your monthly payment will be $${monthlyPayment.toFixed(2)}.`,
            loanId: loan.id,
        };
    }
);

export const getMyLoans = tool(
    {
        name: 'getMyLoans',
        description: 'Lists all active loans for the user.',
        inputSchema: z.object({
            email: z.string().email(),
        }),
        outputSchema: z.array(
            z.object({
                id: z.string(),
                type: z.string(),
                amount: z.number(),
                status: z.string(),
            })
        ),
    },
    async ({ email }) => {
        const user = await db.user.findUnique({
            where: { email },
            include: {
                loans: {
                    include: { loanType: true },
                },
            },
        });

        if (!user) return [];

        return user.loans.map(loan => ({
            id: loan.id,
            type: loan.loanType.type,
            amount: loan.amount,
            status: loan.status,
        }));
    }
);
