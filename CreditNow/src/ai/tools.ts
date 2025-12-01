import { tool } from 'genkit';
import { z } from 'zod';
import { getAuthToken } from './context';

const BACKEND_URL = 'http://localhost:5000/api';

const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
};

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
        description: 'Checks if a user is eligible for a loan.',
        inputSchema: z.object({}),
        outputSchema: z.object({
            isEligible: z.boolean(),
            reason: z.string().optional(),
            maxLoanAmount: z.number().optional(),
        }),
    },
    async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    isEligible: false,
                    reason: 'You need to be logged in to check eligibility.',
                };
            }

            // TODO: Implement a real eligibility endpoint in backend.
            await fetchApi('/loans/my-loans');

            return {
                isEligible: true,
                maxLoanAmount: 50000, // Mock amount
            };
        } catch (error: any) {
            return {
                isEligible: false,
                reason: error.message || 'Unable to check eligibility.',
            };
        }
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
        try {
            return [
                { type: 'Personal Loan', rate: 12.5, description: 'Unsecured personal loan' },
                { type: 'Home Loan', rate: 8.5, description: 'Loan for purchasing property' }
            ];
        } catch (error) {
            return [];
        }
    }
);

export const applyForLoan = tool(
    {
        name: 'applyForLoan',
        description: 'Applies for a loan for the user.',
        inputSchema: z.object({
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
    async ({ loanType, amount, months }) => {
        try {
            let productId = 1;
            if (loanType.toLowerCase().includes('home')) productId = 2;

            const result = await fetchApi('/loans/apply', {
                method: 'POST',
                body: JSON.stringify({
                    productId,
                    amount,
                    tenure: months
                })
            });

            return {
                success: true,
                message: 'Loan application submitted successfully!',
                loanId: result.id?.toString()
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Failed to apply for loan.'
            };
        }
    }
);

export const getMyLoans = tool(
    {
        name: 'getMyLoans',
        description: 'Lists all active loans for the user.',
        inputSchema: z.object({}),
        outputSchema: z.array(
            z.object({
                id: z.string(),
                type: z.string(),
                amount: z.number(),
                status: z.string(),
            })
        ),
    },
    async () => {
        try {
            const loans = await fetchApi('/loans/my-loans');
            return loans.map((loan: any) => ({
                id: loan.id.toString(),
                type: loan.product?.title || 'Unknown',
                amount: Number(loan.amount),
                status: loan.status
            }));
        } catch (error) {
            return [];
        }
    }
);
