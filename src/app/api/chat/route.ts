import { NextRequest, NextResponse } from 'next/server'
import { SUKUT_FRIEND_PROMPT } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const { messages } = await request.json()

    if (!apiKey) {
      const demoResponses = [
        "Yo bro! 😎 Hozir men demo rejimda ishlayman. Admin OPENAI_API_KEY qo'shishi kerak Vercel Settings → Environment Variables ga. Shundan keyin men real gaplashaman!\n\nLekin hozir ham practice qil:\n\n🎤 What is your dream job and why?",
        "Salom do'stim! 😄 API Key hali yo'q — lekin tashvishlanma. Admin qo'shadi. Hozircha o'zing practice qil:\n\n🎤 Describe your best friend. What do they look like?",
        "Hey! 🔥 Men hozir offline'man. Lekin sen shunchaki inglizcha yozib tur — keyinroq men check qilaman 😂\n\n🎤 If you could travel anywhere, where would you go?",
        "Bro! 😎 Real chat uchun API Key kerak. Lekin gap yo'q — senga savol beray:\n\n🎤 What do you usually do on weekends? Tell me in detail!",
        "Assalomu alaykum do'stim! 👋 Men Sukut — hozir demo mode'daman. Lekin savol beray:\n\n🎤 Do you prefer living in a city or countryside? Why?",
      ]
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
      return NextResponse.json({ message: randomResponse })
    }

    // Real OpenAI call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SUKUT_FRIEND_PROMPT },
          ...messages.slice(-10),
        ],
        temperature: 0.9,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI error:', error)
      
      if (error?.error?.code === 'insufficient_quota') {
        return NextResponse.json({
          message: "Bro, API balance tugagan! 💸 Admin OpenAI'ga pul qo'shishi kerak.\n\nLekin senga savol beray:\n\n🎤 What would you do if you had a million dollars?"
        })
      }
      
      return NextResponse.json({
        message: "Hmm nimadur xato ketdi 🤔 Qaytadan yozib ko'r!\n\n🎤 Meanwhile: Tell me about your hometown!"
      })
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || "Xatolik bo'ldi 😅"

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({
      message: "Internet bilan muammo borga o'xshaydi 😅\n\nQaytadan urinib ko'r!\n\n🎤 While waiting: What is the most interesting book you have read?"
    })
  }
}
