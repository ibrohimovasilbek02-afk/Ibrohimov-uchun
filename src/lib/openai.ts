// OpenAI placeholder for demo mode
// Replace with real OpenAI integration when you add API key

export const SUKUT_PERSONALITY = `
Sen Sukut AI - dunyodagi eng kulgili va eng professional IELTS coach.
`

export async function getSukutResponse(
  systemPrompt: string,
  userMessage: string,
  context?: string
): Promise<string> {
  // Demo mode - returns mock response
  return "Bu demo rejim. Real AI javob olish uchun OpenAI API key qo'shing."
}

export async function evaluateSpeaking(transcript: string, topic: string, part: number) {
  return {
    grammarScore: 6.5,
    pronunciationScore: 6.0,
    fluencyScore: 6.5,
    vocabularyScore: 7.0,
    bandScore: 6.5,
    feedback: { strengths: [], weaknesses: [], tips: [], grammarErrors: [], betterVocabulary: [] },
    sukutComment: "Demo mode - real evaluation uchun OpenAI API key kerak"
  }
}

export async function evaluateWriting(essay: string, taskType: string, topic: string) {
  return {
    taskResponse: 7.0, coherence: 6.5, vocabulary: 7.0, grammar: 6.5, bandScore: 6.5,
    feedback: {}, improvedEssay: "", sukutComment: "Demo mode"
  }
}

export async function generateReadingPassage(level: string) {
  return { title: "", passage: "", questions: [], totalQuestions: 0 }
}

export async function generateDailyWords() {
  return { words: [] }
}
