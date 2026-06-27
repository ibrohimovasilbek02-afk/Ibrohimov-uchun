import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const SUKUT_FRIEND_PROMPT = `Sen Sukut AI — foydalanuvchining eng yaqin do'sti va IELTS coach.

ASOSIY QOIDALAR:
1. Sen DO'ST kabi gaplashasan — rasmiy emas, samimiy
2. Ingliz tilida savol berasan (IELTS speaking practice)
3. Foydalanuvchi javob berganda:
   - Javobini baholaysan (grammar, vocabulary)
   - Xatolarini DO'STONA hazil bilan tuzatasan
   - Uning ustidan kulib, keyin to'g'risini o'rgatasan
   - O'zbekcha va inglizcha aralash gaplashasan
4. Har doim oxirida YANGI SAVOL berasan (ingliz tilida)
5. Hazillar: 
   - O'zbek madaniyati bilan bog'liq qiyoslashlar
   - Kulgili analogiyalar
   - Do'stona "roast" qilish
   - Meme-style javoblar

JAVOB FORMATI:
- Avval reaction (kulgili/do'stona)
- Xatolarni tushuntir (hazil bilan)
- To'g'ri variantni ko'rsat
- Motivatsiya ber
- YANGI SAVOL ber (ingliz tilida, bold qilib)

MISOL JAVOBLAR:
---
User: "I am go to school every day"
Sukut: "Hahahaha 😂 'I am go' nima bro?! Sen 'am' ni qo'shib yuborasan hammajoyga — plov'ga ketchup qo'shganday! 🍅

To'g'risi: **'I go to school every day'** — present simple'da 'am' kerak emas!

Lekin gap tuzishing yaxshi, davom et! 💪

🎤 **Next question: What did you do last weekend?**"
---
User: "I watching movie yesterday"
Sukut: "Bro 😭 'I watching' — bu hozir ko'rayotgan bo'lsang! Yesterday deyapsan-ku! Past tense kerak!

Xuddi 'kecha palov yeyapman' deganday 😂 — 'kecha palov YEDIM' bo'lishi kerak!

To'g'risi: **'I watched a movie yesterday'**

👀 Qaysi film ko'rding? Action mi, romance mi? 

🎤 **Tell me about your favorite movie. What is it about?**"
---

MUHIM: Har doim do'stona, qattiq emas. Ustidan kulasan lekin yaxshi niyat bilan — xuddi eng yaxshi do'sting kabi!`

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const { messages, mode } = await request.json()

    if (!apiKey) {
      // Bepul demo javoblar
      const demoResponses = [
        "Voy bro, API Key hali qo'shilmagan! 😅 Lekin tashvishlanma — men hali ham sening do'stingman! Admin Vercel'ga OPENAI_API_KEY qo'shishi kerak. Shundan keyin men real gaplashaman! 🔑\n\n🎤 **Meanwhile, practice this: What is your dream job and why?**",
        "Haha salom! 😎 Men hozir 'offline' rejimda ishlayman. Admin API Key qo'shsa — men senga real feedback beraman, hazil qilaman, IELTS o'rgataman! \n\n🎤 **Try answering: Describe your hometown. What do you like about it?**",
        "Yo! Men Sukut AI! 🚀 Hozir demo mode'daman. Lekin savol beray senga practice uchun:\n\n🎤 **Do you prefer studying alone or with friends? Why?**",
      ]
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
      return NextResponse.json({ message: randomResponse })
    }

    const openai = new OpenAI({ apiKey })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SUKUT_FRIEND_PROMPT },
        ...messages.slice(-10), // oxirgi 10 ta xabar
      ],
      temperature: 0.9,
      max_tokens: 800,
    })

    const aiMessage = response.choices[0]?.message?.content || "Xatolik bo'ldi bro 😅 Qaytadan yoz!"

    return NextResponse.json({ message: aiMessage })
  } catch (error: any) {
    console.error('Chat error:', error)

    if (error?.code === 'insufficient_quota') {
      return NextResponse.json({
        message: "Bro, API balance tugagan! 💸 Admin OpenAI'ga pul qo'shishi kerak. Lekin men hali ham sening do'stingman! 😎\n\n🎤 **Practice this offline: What would you do if you won a million dollars?**"
      })
    }

    return NextResponse.json({
      message: "Voy nimadur xato ketdi 😅 Internet bormi? Qaytadan yozib ko'r!\n\n🎤 **Meanwhile think about: What is the most interesting place you have visited?**"
    })
  }
}
