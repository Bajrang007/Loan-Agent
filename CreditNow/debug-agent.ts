import { loanAgent } from './src/ai/agent';
import { authContext } from './src/ai/context';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAgent() {
    console.log('1. Logging in to get token...');
    let token = '';
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'john@example.com', password: 'password123' })
        });
        const loginData: any = await loginRes.json();
        if (loginRes.ok) {
            token = loginData.token;
            console.log('Login Successful.');
        } else {
            console.error('Login Failed:', loginData);
            return;
        }
    } catch (e) {
        console.error('Login Error:', e);
        return;
    }

    console.log('\n2. Running Agent Tests...');

    const testQueries = [
        "Calculate monthly payment for a loan of 50000 for 12 months at 10% interest",
    ];

    for (const query of testQueries) {
        console.log(`\n--- Testing Query: "${query}" ---`);
        try {
            const response = await authContext.run({ token }, async () => {
                const result = await loanAgent(query);
                return result;
            });
            console.log('Agent Response:', response);
        } catch (e: any) {
            console.error('Agent Error:', e);
            if (e.cause) console.error('Cause:', e.cause);
        }
    }
}

testAgent();
