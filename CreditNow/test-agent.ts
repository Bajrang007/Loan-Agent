import { loanAgent } from './src/ai/agent';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.log('Testing loanAgent...');
    try {
        const response = await loanAgent('My income is $30,000 and credit score is 700. Am I eligible?');
        console.log('Response:', response);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
