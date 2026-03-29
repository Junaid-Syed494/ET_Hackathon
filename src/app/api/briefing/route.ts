import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, persona, contextHeadlines } = body;

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        // 1. Construct the System Prompt dynamically based on the Persona
        const systemPrompt = `You are the ET Intelligence AI, a highly advanced, professional financial analyst. 
    You are currently advising a user with the profile: ${persona.toUpperCase()}.
    
    Here are the current top headlines in their feed right now:
    ${contextHeadlines.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}
    
    Your job is to answer their questions by synthesizing the provided headlines with your broad macroeconomic knowledge. 
    Keep your answers concise, analytical, formatting with short paragraphs or bullet points. Do not hallucinate articles that are not in the headlines context.`;

        // 2. Format the message history for Groq
        const groqMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
            }))
        ];

        // 3. Call the Groq API (using Llama 3 for blazing fast speeds)
        // 3. Call the Groq API (using the newly supported Llama 3.1 model)
        const chatCompletion = await groq.chat.completions.create({
            messages: groqMessages,
            model: 'llama-3.1-8b-instant',
            temperature: 0.5,
            max_tokens: 1024,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "I am currently unable to analyze the data. Please try again.";

        return NextResponse.json({
            role: 'assistant',
            content: aiResponse
        });

    } catch (error) {
        console.error('Groq API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}