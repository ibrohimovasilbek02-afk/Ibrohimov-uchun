import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SUKUT_SYSTEM_PROMPT } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        bandScore: 6.5,
        taskResponse: 7.0,
        coherence: 6.0,
        vocabulary: 7.0,
        grammar: 6.5,
        feedback: "Demo rejim.",
        sukutComment: "Demo rejimda ishlayman. API Key qo'shilsa, essay'ni real tekshiraman! ✍️",
        demo: true,
      })
    }

    const openai = new OpenAI({ apiKey })
    const { essay, taskType, topic } = await request.json()

    const prompt = `IELTS Writing ${taskType} essay'ni baholab ber.

Topic: ${topic}
Essay: "${essay}"

JSON formatda javob ber:
{
  "bandScore": 0-9,
  "taskResponse": 0-9,
  "coherence": 0-9,
  "vocabulary": 0-9,
  "grammar": 0-9,
  "feedback": {
    "taskResponseFeedback": "...",
    "coherenceFeedback": "...",
    "vocabularyFeedback": "...",
    "grammarFeedback": "..."
  },
  "grammarErrors": [{"error": "xato", "correction": "to'g'risi", "explanationUz": "o'zbekcha tushuntirish"}],
  "improvedEssay": "Band 8+ versiyasi",
  "sukutComment": "Kulgili comment o'zbekchada"
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
    console.error('Writing API error:', error)
    return NextResponse.json(
      { error: 'Xatolik', sukutComment: 'Nimadir xato ketdi! 🔄' },
      { status: 500 }
    )
  }
}
