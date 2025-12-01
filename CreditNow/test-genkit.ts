import { ai } from './src/ai/genkit';

async function testGenkit() {
    console.log('Testing Genkit Generation...');
    try {
        const { text } = await ai.generate({
            prompt: 'Hello, are you working?',
        });
        console.log('Genkit Response:', text);
    } catch (e: any) {
        console.error('Genkit Error:', e);
        if (e.cause) console.error('Cause:', e.cause);
    }
}

testGenkit();
