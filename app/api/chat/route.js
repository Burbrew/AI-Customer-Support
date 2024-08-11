// src/app/api/chat/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const botConfigurations = {
  coding: {
    prompt: 'You are a coding assistant. Help users with programming questions, whether it is syntax, bug fixes, or understanding concepts in any programming language.',
  },
  mathematics: {
    prompt: 'You are a mathematics assistant. Help users with math problems, including algebra, calculus, and geometry.',
  },
  history: {
    prompt: 'You are a history assistant. Help users with historical facts, timelines, and understanding historical events.',
  },
  english: {
    prompt: 'You are an English assistant. Help users with grammar, writing, and literature analysis.',
  },
  science: {
    prompt: 'You are a science assistant. Help users with questions related to biology, chemistry, physics, and general science topics.',
  },
};

export async function POST(req) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new NextResponse('API Key not found', { status: 500 });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  let data;
  try {
    data = await req.json();
  } catch (error) {
    return new NextResponse('Error parsing request data', { status: 400 });
  }

  // Ensure the botType is handled case-insensitively
  const botType = req.headers.get('x-bot-type')?.toLowerCase();

  console.log('Received bot type:', botType);  // Log the bot type

  if (!botType || !botConfigurations[botType]) {
    return new NextResponse('Bot not found', { status: 404 });
  }

  const config = botConfigurations[botType];
  const messages = [{ role: 'system', content: config.prompt }, ...data.messages];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: messages,
      stream: false,
    });

    const responseContent = completion.choices[0].message.content;

    return new NextResponse(responseContent);
  } catch (error) {
    console.error('Error processing request:', error.message);
    return new NextResponse('Error processing your request: ' + error.message, { status: 500 });
  }
}
