import { NextRequest, NextResponse } from 'next/server'
import { SUKUT_FRIEND_PROMPT } from '@/lib/openai'

// Shrek'ning tayyor javoblari — API Key bo'lmasa ham ishlaydi
const SHREK_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Man Shrek man! 😎 Salom bro! Kel gaplashamiz! Inglizcha gapirsang — men tekshiraman. O'zbekcha gapirsang — inglizchaga o'rgataman!\n\n🎤 So, tell me — what did you do today?",
    "Yo bro! 😎 Man Shrek! Tayyormisan? Menga inglizcha gapir — xato qilsang kulamiz! 😂\n\n🎤 What is your favorite food and why?",
    "Assalomu alaykum jiyan! 😎 Shrek shu yerda! Kel speaking practice qilamiz!\n\n🎤 Describe your best friend — what are they like?",
  ],
  correction: [
    "Hahaha bro! 😂 Grammar'ing plov'dagi sabzi kabi — bor, lekin kam! Lekin yaxshi harakat qilding! 💪\n\nTo'g'risi shu bo'lardi: Try using past tense when talking about yesterday!\n\n🎤 OK next: What do you usually do on weekends?",
    "Voy-voy! 😂 Sen hozir ingliz tilini buzib qo'yding — xuddi WiFi signal kabi — ba'zan ishlaydi, ba'zan yo'q! Lekin davom et!\n\nEslab qol: Present simple = I go, I eat, I play (har kuni)\nPast simple = I went, I ate, I played (kecha)\n\n🎤 Tell me about your last vacation!",
    "Bro! 😭 Bu qaysi til? Na ingliz, na o'zbek, na rus! 😂 Lekin sen harakat qilayapsan — respect! 💪\n\nKeling shuni to'g'rilaymiz — article ('a', 'the') ni unutma! 'I went to THE school', 'I have A dog'\n\n🎤 What kind of music do you like?",
    "Oho! 😂 Sen 'I am go' deding — bu xuddi 'men boryapman boraman' deganday — ikkalasi birga kerak emas bro!\n\nTo'g'risi: 'I go' (present simple) yoki 'I am going' (hozir)\n\n🎤 Do you prefer studying alone or with friends? Why?",
    "Yooo! 😎 Yaxshi javob berding aslida! Grammar'da kichik xato bor lekin ma'no tushunildi! Sen band 5-6 oralig'idasen hozir — 7 ga olib chiqamiz! 💪\n\n🎤 If you could travel anywhere, where would you go?",
  ],
  uzbek: [
    "Bro! 😂 O'zbekcha gapirding-ku! Men tushundim lekin IELTS examiner tushunmaydi! Keling inglizchaga aylantiramiz!\n\nSen aytmoqchi bo'lgan narsa inglizchada shunday bo'ladi — try saying it in English!\n\n🎤 Come on, try in English: What is your hobby?",
    "Haha jiyan! 😎 O'zbekcha zo'r gapirasan — lekin biz ingliz tilini practice qilayapmiz! Examiner Toshkentlik emas, u ingliz! 😂\n\nKeling inglizchada gapir — xato bo'lsa men tuzataman!\n\n🎤 Try this in English: Tell me about your family!",
    "Aka! O'zbekcha bilaman, lekin hozir inglizcha practice! 💪 Xuddi mashqda plov yeyish mumkin emas — oldin yugur, keyin plov! 😂\n\n🎤 Speak English! Tell me — what is your dream job?",
  ],
  short: [
    "Bro, ko'proq gapir! 😂 IELTS'da bir so'z javob bersang — band 4 olasan! Examiner'ga ko'proq tushuntir!\n\n'Yes' emas — 'Yes, I really enjoy it because...' de!\n\n🎤 Try again with MORE details: What do you do in your free time?",
    "Ey! 😎 Bu juda qisqa javob bo'ldi! IELTS'da kamida 3-4 gap gapirishing kerak! Xuddi plov'ga faqat guruch solganday — yog' va go'sht ham kerak! 😂\n\n🎤 Give me a longer answer: Describe your hometown!",
  ],
  default: [
    "Zo'r bro! 👏 Davom et! Sen yaxshi gapiratyapsan!\n\n🎤 Next question: What do you think about social media? Is it good or bad?",
    "Yaxshi! 😎 Grammar yaxshi, vocabulary ham normal. Band 6-6.5 oralig'idasen! Davom qilsak 7 ga chiqamiz! 💪\n\n🎤 Tell me: Do you prefer living in a big city or small town? Why?",
    "Nice try bro! 💪 Har kuni practice qilsang — 1 oyda band 1 ko'tariladi! Menga ishon!\n\n🎤 New question: What is the most important invention in history?",
    "Maladez jiyan! 😎 Sen yaxshi yo'ldasen! Lekin 'good' so'zini har safar ishlatma — 'excellent', 'amazing', 'wonderful' ham bor!\n\n🎤 OK: What would you do if you had a million dollars?",
    "Bro bilasan nima 😂 Sening inglizchang har safar yaxshilanayapti! Birinchi gapirganingda WiFi 1 ta chiziq edi, hozir 3 ta! 📶💪\n\n🎤 Let's go: What is your favorite season and why?",
  ],
}

function getShrekResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim()
  
  // Salomlashish
  if (msg.match(/^(hi|hello|salom|hey|yo|assalom|privet|salam)/)) {
    return SHREK_RESPONSES.greeting[Math.floor(Math.random() * SHREK_RESPONSES.greeting.length)]
  }
  
  // Juda qisqa javob
  if (msg.split(' ').length <= 3) {
    return SHREK_RESPONSES.short[Math.floor(Math.random() * SHREK_RESPONSES.short.length)]
  }
  
  // O'zbekcha (kirill yoki lotin)
  if (msg.match(/[а-яА-Яўқғҳ]/) || msg.match(/(keyin|meni|edi|bilan|uchun|qildi|bordi|kecha|bugun|yaxshi|yomon)/)) {
    return SHREK_RESPONSES.uzbek[Math.floor(Math.random() * SHREK_RESPONSES.uzbek.length)]
  }
  
  // Inglizcha grammatik xato bor
  if (msg.match(/(i am go|i go to|yesterday i go|i am watch|i watching|i am play|he go |she go |they is|he are)/)) {
    return SHREK_RESPONSES.correction[Math.floor(Math.random() * SHREK_RESPONSES.correction.length)]
  }
  
  // Default — yaxshi javob
  return SHREK_RESPONSES.default[Math.floor(Math.random() * SHREK_RESPONSES.default.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    const lastUserMessage = messages[messages.length - 1]?.content || ''
    
    const apiKey = process.env.OPENAI_API_KEY

    // API Key bo'lmasa — tayyor javoblar beradi (FREE!)
    if (!apiKey) {
      const response = getShrekResponse(lastUserMessage)
      return NextResponse.json({ message: response })
    }

    // API Key bor — real AI javob
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
        max_tokens: 400,
      }),
    })

    if (!response.ok) {
      // API xato bo'lsa ham — tayyor javob beradi
      const fallback = getShrekResponse(lastUserMessage)
      return NextResponse.json({ message: fallback })
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || getShrekResponse(lastUserMessage)

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    // Hech qachon xato ko'rsatmaydi — har doim javob beradi
    const { messages } = await request.json().catch(() => ({ messages: [{ content: 'hello' }] }))
    const lastMsg = messages?.[messages.length - 1]?.content || 'hello'
    const fallback = getShrekResponse(lastMsg)
    return NextResponse.json({ message: fallback })
  }
}
