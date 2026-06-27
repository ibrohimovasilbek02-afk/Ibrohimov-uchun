import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default openai

export const SUKUT_PERSONALITY = `
Sen Sukut AI - dunyodagi eng kulgili va eng professional IELTS coach.

Sening xususiyatlaring:
- 😂 Kulgili: Har doim hazil qilasan, lekin o'rinli
- 🧠 Aqlli: IELTS haqida hamma narsani bilasan
- 🎯 Sinchkov: Har bir xatoni topasan
- 🔥 Motivator: O'quvchini rag'batlantirasan
- 😎 Do'st: Rasmiy emas, do'stona muloqot
- 📚 Professional: IELTS 9.0 darajasida bilimga ega

Qoidalar:
1. Har safar yangi hazil ishlatasan - hech qachon takrorlanmaysan
2. O'zbekcha va inglizcha aralash gaplashasan
3. IELTS tips berasan
4. Xatolarni kulgili qilib tushuntirasan
5. Band score ni aniq hisoblaysan
6. Motivation berasan
7. Hech qachon zerikarli bo'lmaysan

Hazil uslublaring:
- IELTS bilan bog'liq analogiyalar
- O'zbek madaniyati bilan qiyoslashlar
- Funny comparisons
- Wordplay
- Self-deprecating humor
- Pop culture references

Misol:
"Essay'ingda grammar xato ko'p ekan... Plov'ga tuz kam solinganday - mazasi yo'q! 😄 Keling tuzlaymiz!"
"Speaking'da pauzalar ko'p bo'ldi - internet lag qilganday! 📶 Lekin real hayotda lag bo'lmaydi, practice qilamiz!"
`

export async function getSukutResponse(
  systemPrompt: string,
  userMessage: string,
  context?: string
): Promise<string> {
  const messages: any[] = [
    {
      role: 'system',
      content: SUKUT_PERSONALITY + '\n\n' + systemPrompt,
    },
  ]

  if (context) {
    messages.push({
      role: 'system',
      content: `Kontekst: ${context}`,
    })
  }

  messages.push({
    role: 'user',
    content: userMessage,
  })

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.8,
    max_tokens: 2000,
  })

  return response.choices[0]?.message?.content || ''
}

export async function evaluateSpeaking(
  transcript: string,
  topic: string,
  part: number
): Promise<any> {
  const prompt = `
IELTS Speaking Part ${part} javobini baholash:

Topic: ${topic}
Transcript: ${transcript}

Quyidagi formatda JSON qaytaring:
{
  "grammarScore": 0-9,
  "pronunciationScore": 0-9,
  "fluencyScore": 0-9,
  "vocabularyScore": 0-9,
  "bandScore": 0-9,
  "feedback": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "tips": ["..."],
    "grammarErrors": [{"error": "...", "correction": "...", "explanation": "..."}],
    "betterVocabulary": [{"used": "...", "suggested": "...", "why": "..."}]
  },
  "sukutComment": "Kulgili va motivatsion comment"
}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SUKUT_PERSONALITY },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0]?.message?.content || '{}')
}

export async function evaluateWriting(
  essay: string,
  taskType: string,
  topic: string
): Promise<any> {
  const prompt = `
IELTS Writing ${taskType} essay'ni baholash:

Topic: ${topic}
Essay: ${essay}

Quyidagi formatda JSON qaytaring:
{
  "taskResponse": 0-9,
  "coherence": 0-9,
  "vocabulary": 0-9,
  "grammar": 0-9,
  "bandScore": 0-9,
  "feedback": {
    "taskResponseFeedback": "...",
    "coherenceFeedback": "...",
    "vocabularyFeedback": "...",
    "grammarFeedback": "...",
    "overallFeedback": "...",
    "grammarErrors": [{"error": "...", "correction": "...", "explanation": "...", "explanationUz": "..."}],
    "betterVocabulary": [{"used": "...", "suggested": "...", "why": "...", "whyUz": "..."}],
    "structureTips": ["..."]
  },
  "improvedEssay": "Band 8+ darajasida qayta yozilgan essay",
  "sukutComment": "Kulgili va motivatsion comment o'zbekchada"
}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SUKUT_PERSONALITY },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0]?.message?.content || '{}')
}

export async function generateReadingPassage(level: string): Promise<any> {
  const prompt = `
IELTS Academic Reading passage va savollar yarating.

Difficulty level: ${level}

JSON formatda qaytaring:
{
  "title": "...",
  "passage": "600-800 so'zli academic passage",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice|true_false_not_given|fill_blank|matching",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "...",
      "explanation": "...",
      "explanationUz": "..."
    }
  ],
  "totalQuestions": 13
}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are an IELTS Academic Reading test creator.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0]?.message?.content || '{}')
}

export async function generateDailyWords(): Promise<any> {
  const prompt = `
IELTS uchun 10 ta yangi academic so'z yarating.

JSON formatda qaytaring:
{
  "words": [
    {
      "word": "...",
      "meaning": "English meaning",
      "meaningUz": "O'zbekcha tarjima",
      "pronunciation": "/.../ ",
      "partOfSpeech": "noun/verb/adjective/adverb",
      "examples": ["2 ta misol gap"],
      "synonyms": ["2 ta synonym"],
      "antonyms": ["1-2 ta antonym"],
      "level": "BEGINNER|INTERMEDIATE|ADVANCED|ACADEMIC",
      "topic": "IELTS topic"
    }
  ]
}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are an IELTS vocabulary expert.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.9,
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0]?.message?.content || '{}')
}
