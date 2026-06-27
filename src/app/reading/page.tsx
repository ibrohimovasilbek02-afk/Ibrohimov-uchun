'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Play,
  Timer,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const mockPassage = {
  title: "The Impact of Artificial Intelligence on Modern Education",
  passage: `Artificial Intelligence (AI) has revolutionized numerous sectors, and education is no exception. In recent years, AI-powered tools have begun to reshape how students learn, how teachers instruct, and how educational institutions operate. This transformation raises both excitement and concern among educators, policymakers, and parents alike.

One of the most significant applications of AI in education is personalized learning. Traditional classroom settings often struggle to accommodate the diverse learning needs of individual students. AI algorithms can analyze a student's performance data, identify their strengths and weaknesses, and tailor educational content accordingly. This adaptive approach ensures that each learner receives instruction at their optimal pace and difficulty level.

Furthermore, AI-powered tutoring systems have emerged as valuable supplements to traditional instruction. These virtual tutors can provide immediate feedback, answer questions at any time, and offer explanations in multiple formats until the student demonstrates understanding. Unlike human tutors, AI systems are available 24/7 and can simultaneously assist unlimited numbers of students.

However, the integration of AI in education is not without challenges. Critics argue that over-reliance on technology may diminish the crucial human elements of teaching—empathy, emotional support, and mentorship. There are also concerns about data privacy, as AI systems require extensive student data to function effectively. Additionally, the digital divide means that students from disadvantaged backgrounds may have limited access to AI-enhanced educational tools, potentially widening existing inequalities.

Despite these concerns, proponents maintain that AI should be viewed as a tool that augments rather than replaces human educators. When implemented thoughtfully, AI can free teachers from routine tasks such as grading and administrative work, allowing them to focus on higher-order activities like facilitating discussions, nurturing creativity, and providing emotional guidance.`,
  questions: [
    {
      id: 1,
      type: 'multiple_choice',
      question: 'What is the main purpose of AI in personalized learning?',
      options: [
        'A. To replace teachers entirely',
        'B. To tailor content to individual student needs',
        'C. To reduce educational costs',
        'D. To eliminate the need for textbooks',
      ],
      correctAnswer: 'B',
      explanation: 'The passage states that AI can "tailor educational content accordingly" based on individual performance.',
      explanationUz: "Passageda AI individual talabaning natijalariga qarab 'ta'lim kontentini moslashtirishi' mumkinligi aytilgan.",
    },
    {
      id: 2,
      type: 'true_false_not_given',
      question: 'AI tutoring systems can only help one student at a time.',
      options: ['TRUE', 'FALSE', 'NOT GIVEN'],
      correctAnswer: 'FALSE',
      explanation: 'The passage states AI systems "can simultaneously assist unlimited numbers of students".',
      explanationUz: "Passageda AI tizimlari 'bir vaqtda cheksiz miqdordagi talabalarga yordam berishi mumkin' deyilgan.",
    },
    {
      id: 3,
      type: 'multiple_choice',
      question: 'What concern do critics raise about AI in education?',
      options: [
        'A. AI is too expensive for schools',
        'B. AI may reduce human elements of teaching',
        'C. AI teaches incorrect information',
        'D. AI makes students lazy',
      ],
      correctAnswer: 'B',
      explanation: 'Critics argue that "over-reliance on technology may diminish the crucial human elements of teaching—empathy, emotional support, and mentorship."',
      explanationUz: "Tanqidchilar texnologiyaga haddan tashqari ishonish o'qitishning muhim insoniy elementlarini — hamdardlik, hissiy qo'llab-quvvatlash va murabbiylikni kamaytirishi mumkinligini ta'kidlaydi.",
    },
    {
      id: 4,
      type: 'true_false_not_given',
      question: 'All schools currently use AI-powered educational tools.',
      options: ['TRUE', 'FALSE', 'NOT GIVEN'],
      correctAnswer: 'NOT GIVEN',
      explanation: 'The passage does not provide information about how many schools currently use AI tools.',
      explanationUz: "Passageda hozirda qancha maktab AI vositalarini ishlatishi haqida ma'lumot berilmagan.",
    },
    {
      id: 5,
      type: 'multiple_choice',
      question: 'According to the passage, what can AI free teachers from?',
      options: [
        'A. Teaching entirely',
        'B. Routine tasks like grading',
        'C. Student interactions',
        'D. Curriculum design',
      ],
      correctAnswer: 'B',
      explanation: 'The passage states AI can "free teachers from routine tasks such as grading and administrative work."',
      explanationUz: "Passageda AI o'qituvchilarni 'baholash va ma'muriy ishlar kabi kundalik vazifalardan ozod qilishi' mumkinligi aytilgan.",
    },
  ],
}

export default function ReadingPage() {
  const [step, setStep] = useState<'start' | 'reading' | 'results'>('start')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutes
  const [timerActive, setTimerActive] = useState(false)
  const [showExplanation, setShowExplanation] = useState<number | null>(null)

  const mockUser = { name: 'Asilbek', image: null, xp: 2450, streak: 12, level: 3 }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateScore = () => {
    let correct = 0
    mockPassage.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++
    })
    return correct
  }

  const handleSubmit = () => {
    setTimerActive(false)
    setStep('results')
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <span className="text-3xl">📖</span>
              Reading Practice
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Passage o&apos;qing va savollarga javob bering
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Start Screen */}
          {step === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <GlassCard hover={false} className="max-w-lg mx-auto py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{mockPassage.title}</h2>
                <p className="text-slate-500 mb-6">
                  {mockPassage.questions.length} ta savol • 20 daqiqa
                </p>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">20:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{mockPassage.passage.split(' ').length} so&apos;z</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  leftIcon={<Play className="w-5 h-5" />}
                  onClick={() => { setStep('reading'); setTimerActive(true) }}
                >
                  Boshlash
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {/* Reading Mode */}
          {step === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Timer */}
              <div className="sticky top-20 z-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-lg">
                  <Timer className={cn('w-4 h-4', timeLeft < 300 ? 'text-red-500' : 'text-green-500')} />
                  <span className={cn('font-mono font-bold', timeLeft < 300 && 'text-red-500')}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Passage */}
              <GlassCard hover={false}>
                <h2 className="text-xl font-bold mb-4">{mockPassage.title}</h2>
                <div className="prose dark:prose-invert max-w-none">
                  {mockPassage.passage.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </GlassCard>

              {/* Questions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Savollar:</h3>
                {mockPassage.questions.map((q, i) => (
                  <GlassCard key={q.id} hover={false} delay={i * 0.05}>
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600 flex-shrink-0">
                        {q.id}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium mb-3">{q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((option) => (
                            <label
                              key={option}
                              className={cn(
                                'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
                                answers[q.id] === option.charAt(0)
                                  ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-transparent'
                              )}
                            >
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={option.charAt(0)}
                                checked={answers[q.id] === option.charAt(0)}
                                onChange={(e) =>
                                  setAnswers({ ...answers, [q.id]: e.target.value })
                                }
                                className="accent-primary-500"
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button onClick={handleSubmit} size="lg">
                  Tugatish
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Score */}
              <GlassCard hover={false} className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {calculateScore()}/{mockPassage.questions.length}
                    </span>
                  </div>
                </motion.div>
                <h2 className="text-xl font-bold">Natija</h2>
                <p className="text-slate-500 mt-1">
                  Vaqt: {formatTime(20 * 60 - timeLeft)}
                </p>
              </GlassCard>

              {/* Answers Review */}
              <div className="space-y-4">
                {mockPassage.questions.map((q, i) => {
                  const isCorrect = answers[q.id] === q.correctAnswer
                  return (
                    <GlassCard key={q.id} hover={false}>
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                        )}>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{q.question}</p>
                          {!isCorrect && (
                            <p className="text-sm text-red-500 mb-1">
                              Sizning javob: {answers[q.id] || 'Javob berilmagan'}
                            </p>
                          )}
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            To&apos;g&apos;ri javob: {q.correctAnswer}
                          </p>

                          <button
                            onClick={() => setShowExplanation(showExplanation === q.id ? null : q.id)}
                            className="text-sm text-primary-600 dark:text-primary-400 mt-2 hover:underline"
                          >
                            {showExplanation === q.id ? 'Yopish' : 'Tushuntirish'}
                          </button>

                          {showExplanation === q.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10"
                            >
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                🇬🇧 {q.explanation}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                🇺🇿 {q.explanationUz}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  leftIcon={<RotateCcw className="w-5 h-5" />}
                  onClick={() => { setStep('start'); setAnswers({}); setTimeLeft(20 * 60) }}
                >
                  Qayta urinish
                </Button>
                <Button onClick={() => { setStep('start'); setAnswers({}); setTimeLeft(20 * 60) }}>
                  Yangi passage
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
