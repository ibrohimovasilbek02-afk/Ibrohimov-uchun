'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Volume2,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const mockListening = {
  title: "University Library Tour",
  duration: "4:30",
  questions: [
    {
      id: 1,
      question: "What time does the library open on weekdays?",
      options: ['A. 7:00 AM', 'B. 8:00 AM', 'C. 8:30 AM', 'D. 9:00 AM'],
      correctAnswer: 'C',
      explanation: "The speaker mentions the library opens at 8:30 AM on weekdays.",
    },
    {
      id: 2,
      question: "How many floors does the library have?",
      options: ['A. 3', 'B. 4', 'C. 5', 'D. 6'],
      correctAnswer: 'B',
      explanation: "The tour guide states there are 4 floors in the main library building.",
    },
    {
      id: 3,
      question: "Where is the computer lab located?",
      options: ['A. Ground floor', 'B. First floor', 'C. Second floor', 'D. Third floor'],
      correctAnswer: 'C',
      explanation: "The computer lab is mentioned to be on the second floor.",
    },
    {
      id: 4,
      question: "What is required to borrow books?",
      options: ['A. ID card only', 'B. Student card only', 'C. Library card', 'D. Student card and photo'],
      correctAnswer: 'C',
      explanation: "Students need a library card which can be obtained at the reception.",
    },
    {
      id: 5,
      question: "How many books can students borrow at once?",
      options: ['A. 3', 'B. 5', 'C. 7', 'D. 10'],
      correctAnswer: 'B',
      explanation: "The maximum number of books that can be borrowed is 5.",
    },
  ],
}

export default function ListeningPage() {
  const [step, setStep] = useState<'start' | 'listen' | 'results'>('start')
  const [isPlaying, setIsPlaying] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [progress, setProgress] = useState(0)
  const [showExplanation, setShowExplanation] = useState<number | null>(null)

  const mockUser = { name: 'Asilbek', image: null, xp: 2450, streak: 12, level: 3 }

  const calculateScore = () => {
    let correct = 0
    mockListening.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++
    })
    return correct
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
              <span className="text-3xl">🎧</span>
              Listening Practice
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Audio eshiting va savollarga javob bering
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Start */}
          {step === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <GlassCard hover={false} className="max-w-lg mx-auto py-12">
                <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{mockListening.title}</h2>
                <p className="text-slate-500 mb-6">
                  {mockListening.questions.length} ta savol • {mockListening.duration}
                </p>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-left mb-6 max-w-sm mx-auto">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    ⚠️ Audio faqat 2 marta qo&apos;yiladi. Diqqat bilan eshiting!
                  </p>
                </div>
                <Button
                  size="lg"
                  leftIcon={<Play className="w-5 h-5" />}
                  onClick={() => setStep('listen')}
                >
                  Boshlash
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {/* Listening */}
          {step === 'listen' && (
            <motion.div
              key="listen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Audio Player */}
              <GlassCard hover={false}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg',
                      isPlaying ? 'bg-red-500' : 'gradient-bg'
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{mockListening.title}</span>
                      <span className="text-sm text-slate-500">{mockListening.duration}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        className="h-full rounded-full gradient-bg"
                        animate={{ width: isPlaying ? '100%' : `${progress}%` }}
                        transition={{ duration: isPlaying ? 270 : 0 }}
                      />
                    </div>
                  </div>
                  <Volume2 className="w-5 h-5 text-slate-400" />
                </div>

                {/* Wave visualization */}
                {isPlaying && (
                  <div className="flex items-center justify-center gap-1 mt-4 h-12">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full bg-primary-500"
                        animate={{
                          height: [8, Math.random() * 40 + 8, 8],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Questions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Savollar:</h3>
                {mockListening.questions.map((q, i) => (
                  <GlassCard key={q.id} hover={false} delay={i * 0.05}>
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600 flex-shrink-0">
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
                                  ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-transparent'
                              )}
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={option.charAt(0)}
                                checked={answers[q.id] === option.charAt(0)}
                                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                className="accent-orange-500"
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

              <div className="flex justify-end">
                <Button onClick={() => setStep('results')} size="lg">
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
              <GlassCard hover={false} className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {calculateScore()}/{mockListening.questions.length}
                    </span>
                  </div>
                </motion.div>
                <h2 className="text-xl font-bold">Listening Natija</h2>
              </GlassCard>

              {/* Answers */}
              <div className="space-y-4">
                {mockListening.questions.map((q) => {
                  const isCorrect = answers[q.id] === q.correctAnswer
                  return (
                    <GlassCard key={q.id} hover={false}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{q.question}</p>
                          <p className={cn('text-sm mt-1', isCorrect ? 'text-green-600' : 'text-red-500')}>
                            {isCorrect ? `To'g'ri: ${q.correctAnswer}` : `Xato (${answers[q.id] || '-'}) → To'g'ri: ${q.correctAnswer}`}
                          </p>
                          <button
                            onClick={() => setShowExplanation(showExplanation === q.id ? null : q.id)}
                            className="text-sm text-primary-500 mt-1 hover:underline"
                          >
                            Tushuntirish
                          </button>
                          {showExplanation === q.id && (
                            <p className="text-sm text-slate-500 mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  )
                })}
              </div>

              <div className="flex gap-4">
                <Button variant="secondary" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={() => { setStep('start'); setAnswers({}) }}>
                  Qayta eshitish
                </Button>
                <Button onClick={() => { setStep('start'); setAnswers({}) }}>
                  Yangi audio
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
