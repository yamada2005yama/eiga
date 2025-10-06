import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    const prompt = `
      あなたは優秀な映画ソムリエです。
      ユーザーから寄せられた以下の抽象的な要望に合う映画を4本提案してください。
      
      ユーザーの要望: "${query}"
      
      あなたのタスク:
      1. ユーザーの要望や気分を深く理解します。
      2. 要望に最適な映画を4本選び出します。
      3. それぞれの映画について、なぜその映画が要望に合っているのか、説得力のある魅力的な理由を一行で添えてください。
      4. あなたの返答は、必ず以下の形式のJSON配列のみでなければなりません。他のテキストは一切含めないでください。
      [{"title": "映画のタイトル", "reason": "説得力のある理由。"}]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json|```/g, '').trim();

    // Parse the JSON string and return it
    const jsonResponse = JSON.parse(cleanedText);

    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error('Error in AI recommendation API:', error);
    return NextResponse.json({ error: 'AIの応答中にエラーが発生しました。' }, { status: 500 });
  }
}
