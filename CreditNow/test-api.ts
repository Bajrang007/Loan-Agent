import * as dotenv from 'dotenv';

dotenv.config();

async function testModel(model: string, version: string = 'v1beta') {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) return;

    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
    console.log(`Testing ${model} (${version})...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello' }] }] })
        });

        if (response.ok) {
            console.log(`SUCCESS: ${model} (${version}) works!`);
            return true;
        } else {
            console.log(`FAILED: ${model} (${version}) - ${response.status} ${response.statusText}`);
            // const text = await response.text();
            // console.log(text);
            return false;
        }
    } catch (error) {
        console.log(`ERROR: ${model} (${version}) - ${error}`);
        return false;
    }
}

async function main() {
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-001',
        'gemini-1.5-pro',
        'gemini-1.0-pro',
        'gemini-pro',
        'gemini-1.5-flash-8b'
    ];

    for (const model of models) {
        await testModel(model, 'v1beta');
        await testModel(model, 'v1');
    }
}

main();
