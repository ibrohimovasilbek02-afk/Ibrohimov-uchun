export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  xp: number
  coins: number
  level: number
  streak: number
  bandPrediction: number | null
  isPremium: boolean
  goal: string | null
  lastBand: number | null
}

export interface SpeakingSessionType {
  id: string
  part: number
  topic: string
  questions: string[]
  answers: string[]
  feedback: SpeakingFeedback
  grammarScore: number | null
  pronunciationScore: number | null
  fluencyScore: number | null
  vocabularyScore: number | null
  bandScore: number | null
  duration: number | null
  createdAt: string
}

export interface SpeakingFeedback {
  strengths: string[]
  weaknesses: string[]
  tips: string[]
  grammarErrors: GrammarError[]
  betterVocabulary: VocabSuggestion[]
}

export interface GrammarError {
  error: string
  correction: string
  explanation: string
}

export interface VocabSuggestion {
  used: string
  suggested: string
  why: string
}

export interface WritingSessionType {
  id: string
  taskType: 'TASK1' | 'TASK2'
  topic: string
  essay: string
  feedback: WritingFeedback
  taskResponse: number | null
  coherence: number | null
  vocabulary: number | null
  grammar: number | null
  bandScore: number | null
  improvedEssay: string | null
  createdAt: string
}

export interface WritingFeedback {
  taskResponseFeedback: string
  coherenceFeedback: string
  vocabularyFeedback: string
  grammarFeedback: string
  overallFeedback: string
  grammarErrors: WritingGrammarError[]
  betterVocabulary: WritingVocabSuggestion[]
  structureTips: string[]
}

export interface WritingGrammarError {
  error: string
  correction: string
  explanation: string
  explanationUz: string
}

export interface WritingVocabSuggestion {
  used: string
  suggested: string
  why: string
  whyUz: string
}

export interface ReadingQuestion {
  id: number
  type: 'multiple_choice' | 'true_false_not_given' | 'fill_blank' | 'matching'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  explanationUz: string
}

export interface WordType {
  id: string
  word: string
  meaning: string
  meaningUz: string
  pronunciation: string | null
  partOfSpeech: string | null
  examples: string[]
  synonyms: string[]
  antonyms: string[]
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ACADEMIC'
  topic: string | null
}

export interface DailyProgressType {
  date: string
  xpEarned: number
  speakingMinutes: number
  writingWords: number
  readingPassages: number
  listeningMinutes: number
  wordsLearned: number
  grammarLessons: number
}

export interface AchievementType {
  id: string
  name: string
  description: string
  icon: string
  category: string
  unlockedAt?: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  image: string | null
  xp: number
  level: number
  streak: number
}
