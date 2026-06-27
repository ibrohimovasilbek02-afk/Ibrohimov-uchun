import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SUKUT_SYSTEM_PROMPT } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { 
          message: "Salom! Men Sukut AI! 😎 Hozir demo rejimda ishlayman. Real suhbat uchun OpenAI API Key qo'shilishi kerak. Lekin savol bersangiz, mock javob beraman!",
          demo: true 
        },
        { status: 200 }
      )
    }

    const openai = new OpenAI({ apiKey })
    const { messages, mode } = await request.json()

    let systemPrompt = SUKUT_SYSTEM_PROMPT

    if (mode === 'speaking') {
      systemPrompt += `\n\nHozir Speaking Practice rejimida. Foydalanuvchiga IELTS Speaking savollari ber. Javobini baholab, feedback ber. Band score ber.`
    } else if (mode === 'writing') {
      systemPrompt += `\n\nHozir Writing Practice rejimida. Foydalanuvchi essay yozsa, uni IELTS mezonlari bo'yicha baholab ber: Task Response, Coherence, Vocabulary, Grammar. Band score ber. Xatolarni tushuntir.`
    } else if (mode === 'vocabulary') {
      systemPrompt += `\n\nHozir Vocabulary rejimida. IELTS uchun kerakli academic so'zlar o'rgat. Har bir so'zni misol bilan, o'zbekcha tarjima bilan tushuntir.`
    } else if (mode === 'grammar') {
      systemPrompt += `\n\nHozir Grammar rejimida. IELTS uchun kerakli grammar mavzularni o'rgat. Misol gaplar bilan tushuntir. Quiz savollar ber.`
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const aiMessage = response.choices[0]?.message?.content || 'Xatolik yuz berdi'

    return NextResponse.json({ message: aiMessage })
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    if (error?.code === 'invalid_api_key') {
      return NextResponse.json(
        { message: "API Key noto'g'ri. Vercel Settings → Environment Variables da tekshiring.", error: true },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: "Xatolik yuz berdi. Qaytadan urinib ko'ring.", error: true },
      { status: 200 }
    )
  }
}
