import { Feedback } from './core';
import OpenAI from 'openai';

export async function openAIFeedback(code: string, type: string): Promise<Feedback> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY environment variable not set.');
  const openai = new OpenAI({ apiKey });
  const prompt = `You are a code reviewer. Analyze the following code for ${type} and provide a summary and line-specific suggestions.\n\nCODE:\n${code}`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a code review assistant.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 512,
  });
  const text = completion.choices[0].message?.content || '';
  // Simple parse: expect summary first, then suggestions as "Line X: ..."
  const summaryMatch = text.match(/Summary:(.*?)(Suggestions:|$)/is);
  const summary = summaryMatch ? summaryMatch[1].trim() : '';
  const suggestions: { line: number; message: string }[] = [];
  const suggestionRegex = /Line (\d+): (.+)/g;
  let m;
  while ((m = suggestionRegex.exec(text))) {
    suggestions.push({ line: parseInt(m[1]), message: m[2] });
  }
  return { summary, suggestions };
} 