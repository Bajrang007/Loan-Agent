import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
    console.log('1. Testing Health...');
    try {
        const health = await fetch('http://localhost:5000/');
        console.log('Health Status:', health.status);
        const text = await health.text();
        console.log('Health Response:', text);
    } catch (e) {
        console.error('Health Check Failed:', e);
        return;
    }

    console.log('\n2. Logging in...');
    let token = '';
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'john@example.com', password: 'password123' })
        });
        console.log('Login Status:', loginRes.status);
        const loginData: any = await loginRes.json();
        if (loginRes.ok) {
            token = loginData.token;
            console.log('Login Successful. Token obtained.');
        } else {
            console.error('Login Failed:', loginData);
            return;
        }
    } catch (e) {
        console.error('Login Error:', e);
        return;
    }

    console.log('\n3. Fetching My Loans...');
    try {
        const loansRes = await fetch(`${BASE_URL}/loans/my-loans`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Loans Status:', loansRes.status);
        const loansData = await loansRes.json();
        console.log('Loans Data:', JSON.stringify(loansData, null, 2));
    } catch (e) {
        console.error('Fetch Loans Error:', e);
    }
}

testBackend();
