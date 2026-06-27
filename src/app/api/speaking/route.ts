import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SUKUT_SYSTEM_PROMPT } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        bandScore: 6.5,
        grammarScore: 7.0,
        pronunciationScore: 6.0,
        fluencyScore: 6.5,
        vocabularyScore: 7.0,
        feedback: "Demo rejim. Real baholash uchun OpenAI API Key kerak.",
        sukutComment: "Salom! Men demo rejimda ishlayman. API Key qo'shilsa, real feedback beraman! 😎",
        demo: true,
      })
    }

    const openai = new OpenAI({ apiKey })
    const { transcript, topic, part } = await request.json()

    const prompt = `IELTS Speaking Part ${part} javobini baholab ber.

Topic: ${topic}
Foydalanuvchi javobi: "${transcript}"

Quyidagi JSON formatda javob ber:
{
  "bandScore": 0-9 orasida,
  "grammarScore": 0-9,
  "pronunciationScore": 0-9,
  "fluencyScore": 0-9,
  "vocabularyScore": 0-9,
  "strengths": ["kuchli tomonlari"],
  "weaknesses": ["yaxshilash kerak"],
  "tips": ["maslahatlar"],
  "grammarErrors": [{"error": "xato", "correction": "to'g'risi", "explanation": "tushuntirish"}],
  "sukutComment": "Kulgili va motivatsion comment o'zbekchada"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SUKUT_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0]?.message?.content || '{}')
    return NextResponse.json(result)
  } catch (error) {
    console.error('Speaking API error:', error)
    return NextResponse.json(
      { error: 'Xatolik', sukutComment: 'Nimadir xato ketdi, qaytadan urinib ko\'ring! 🔄' },
      { status: 500 }
    )
  }
}
