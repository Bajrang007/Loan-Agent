'use server';

import { loanAgent } from '@/ai/agent';

export interface Message {
    role: 'user' | 'model';
    content: string;
}

export async function chatWithAgent(history: Message[], message: string) {
    // Construct a prompt that includes history context
    const historyText = history.map(m => `${m.role}: ${m.content}`).join('\n');
    const fullInput = `
    Previous conversation:
    ${historyText}
    
    User: ${message}
  `;

    try {
        const response = await loanAgent(fullInput);
        return {
            text: response.text,
        };
    } catch (error) {
        console.error('Error calling agent:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return {
            text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        };
    }
}
