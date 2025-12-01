import fetch from 'node-fetch';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY || 'AIzaSyCMwokg6xUvpJk3l8vWa2dkthy8_Q353C4';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function testKey() {
    console.log('Testing Generation with gemini-1.5-flash...');
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        if (data.models) {
            const geminiModels = data.models
                .filter((m: any) => m.name.includes('flash'))
                .map((m: any) => m.name);
            console.log('Gemini Models:', geminiModels);
        } else {
            console.log('No models found or error structure:', data);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

testKey();
