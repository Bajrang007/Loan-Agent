
import 'dotenv/config';
import { loanAgent } from './src/ai/agent';

async function main() {
    try {
        console.log("Attempting to call loanAgent...");
        const response = await loanAgent('My income is $30,000 and credit score is 700. Am I eligible?');
        console.log('Response:', response);
    } catch (error) {
        console.error('Error caught in repro script:', error);
    }
}

main();
