import { chatWithAgent } from './src/app/actions';

async function test() {
    console.log('1. Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token:', token ? 'Yes' : 'No');

    console.log('2. Asking Agent: "What are my active loans?"');
    const response = await chatWithAgent([], 'What are my active loans?', token);
    console.log('Agent Response:', response);
}

test();
