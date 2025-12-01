import { ai } from './genkit';
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

export const calculateLoan = ai.defineTool(
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
        console.log('calculateLoan called with:', amount, months, rate);
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

export const checkEligibility = ai.defineTool(
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

export const getLoanTypes = ai.defineTool(
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

export const applyForLoan = ai.defineTool(
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

export const get_customer_loans = ai.defineTool(
    {
        name: 'get_customer_loans',
        description: 'Fetches active loans for a customer. Requires customer_id.',
        inputSchema: z.object({
            customer_id: z.string().describe('The ID of the customer'),
        }),
        outputSchema: z.array(
            z.object({
                loan_type: z.string(),
                principal: z.number(),
                outstanding_amount: z.number(),
                emi_amount: z.number(),
                status: z.string(),
            })
        ),
    },
    async ({ customer_id }) => {
        console.log('get_customer_loans called with:', customer_id);
        try {
            console.log('Fetching loans from backend...');
            const loans = await fetchApi('/loans/my-loans');
            console.log('Loans fetched:', loans.length);
            return loans.map((loan: any) => {
                const principal = Number(loan.amount);
                let outstanding_amount = principal;
                let emi_amount = 0;

                if (loan.repayments && loan.repayments.length > 0) {
                    const pendingRepayments = loan.repayments.filter((r: any) => r.paymentStatus === 'PENDING');
                    outstanding_amount = pendingRepayments.reduce((sum: number, r: any) => sum + Number(r.amountDue), 0);
                    emi_amount = Number(loan.repayments[0].amountDue);
                }

                return {
                    loan_type: loan.product?.title || 'Unknown Loan',
                    principal: principal,
                    outstanding_amount: parseFloat(outstanding_amount.toFixed(2)),
                    emi_amount: parseFloat(emi_amount.toFixed(2)),
                    status: loan.status
                };
            });
        } catch (error) {
            return [];
        }
    }
);

export const get_emi_details = ai.defineTool(
    {
        name: 'get_emi_details',
        description: 'Fetches the next EMI date and amount for a specific loan.',
        inputSchema: z.object({
            loan_id: z.string().describe('The ID of the loan'),
        }),
        outputSchema: z.object({
            next_emi_date: z.string(),
            amount: z.number(),
            status: z.string(),
        }),
    },
    async ({ loan_id }) => {
        try {
            // In a real app, fetch from DB using loan_id
            // Mocking response for now
            const today = new Date();
            const nextMonth = new Date(today.setMonth(today.getMonth() + 1));

            return {
                next_emi_date: nextMonth.toISOString().split('T')[0],
                amount: 2330.00,
                status: 'PENDING'
            };
        } catch (error) {
            throw new Error('Failed to fetch EMI details');
        }
    }
);

export const generate_payment_link = ai.defineTool(
    {
        name: 'generate_payment_link',
        description: 'Generates a secure payment link for the customer.',
        inputSchema: z.object({
            customer_id: z.string(),
            amount: z.number(),
        }),
        outputSchema: z.object({
            payment_url: z.string(),
            expiry: z.string(),
        }),
    },
    async ({ customer_id, amount }) => {
        // Mock payment link generation
        const expiry = new Date(Date.now() + 30 * 60000); // 30 mins
        return {
            payment_url: `https://creditnow.com/pay/${customer_id}?amt=${amount}`,
            expiry: expiry.toISOString()
        };
    }
);

export const schedule_notification = ai.defineTool(
    {
        name: 'schedule_notification',
        description: 'Schedules a reminder notification for the user.',
        inputSchema: z.object({
            channel: z.string().describe('e.g., WhatsApp, SMS, Email'),
            time: z.string().describe('ISO timestamp for the reminder'),
            type: z.string().describe('Type of notification, e.g., reminder'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ channel, time, type }) => {
        // Mock scheduling
        console.log(`Scheduled ${type} via ${channel} at ${time}`);
        return {
            success: true,
            message: `Reminder scheduled for ${time} via ${channel}.`
        };
    }
);

export const get_account_statement = ai.defineTool(
    {
        name: 'get_account_statement',
        description: 'Generates an account statement for a date range.',
        inputSchema: z.object({
            start_date: z.string().optional(),
            end_date: z.string().optional(),
        }),
        outputSchema: z.object({
            pdf_url: z.string(),
            period: z.string(),
        }),
    },
    async ({ start_date, end_date }) => {
        // Mock PDF generation
        return {
            pdf_url: 'https://creditnow.com/docs/statement_2024.pdf',
            period: `${start_date || 'Last 3 months'} to ${end_date || 'Today'}`
        };
    }
);

export const create_support_ticket = ai.defineTool(
    {
        name: 'create_support_ticket',
        description: 'Creates a support ticket for the user.',
        inputSchema: z.object({
            issue_summary: z.string(),
            category: z.string(),
        }),
        outputSchema: z.object({
            ticket_id: z.string(),
            sla: z.string(),
        }),
    },
    async ({ issue_summary, category }) => {
        // Mock ticket creation
        const ticketId = 'TKT-' + Math.floor(Math.random() * 10000);
        return {
            ticket_id: ticketId,
            sla: '24 hours'
        };
    }
);
