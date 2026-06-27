'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Languages,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Lightbulb,
  PenTool,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils'

const grammarLessons = [
  {
    id: '1',
    title: 'Conditional Sentences',
    titleUz: 'Shartli gaplar',
    level: 'INTERMEDIATE',
    lesson: `Conditional sentences express hypothetical situations and their results.

**Type 0 (General truth):** If + present simple, present simple
- If water reaches 100°C, it boils.

**Type 1 (Real/possible):** If + present simple, will + base form
- If it rains tomorrow, I will stay home.

**Type 2 (Unreal present):** If + past simple, would + base form  
- If I had more time, I would study harder.

**Type 3 (Unreal past):** If + past perfect, would have + past participle
- If I had studied more, I would have passed the exam.`,
    quiz: [
      {
        question: 'If I ___ (have) more money, I would travel the world.',
        options: ['have', 'had', 'will have', 'having'],
        correct: 'had',
        explanation: "Type 2 conditional uses 'if + past simple'.",
        explanationUz: "2-tur shart gaplarda 'if + past simple' ishlatiladi.",
      },
      {
        question: 'If she studies hard, she ___ (pass) the exam.',
        options: ['will pass', 'would pass', 'passes', 'passed'],
        correct: 'will pass',
        explanation: "Type 1 conditional uses 'will + base form' in the result clause.",
        explanationUz: "1-tur shart gaplarda natija qismida 'will + base form' ishlatiladi.",
      },
      {
        question: 'If I had known about the meeting, I ___ (attend) it.',
        options: ['would attend', 'would have attended', 'will attend', 'attended'],
        correct: 'would have attended',
        explanation: "Type 3 conditional uses 'would have + past participle'.",
        explanationUz: "3-tur shart gaplarda 'would have + past participle' ishlatiladi.",
      },
    ],
  },
  {
    id: '2',
    title: 'Passive Voice',
    titleUz: 'Passiv daraja',
    level: 'INTERMEDIATE',
    lesson: `Passive voice emphasizes the action rather than the doer.

**Structure:** Subject + be + past participle (+ by agent)

**Examples:**
- Active: Scientists discovered a new planet.
- Passive: A new planet was discovered (by scientists).

**Tenses in passive:**
- Present Simple: is/are + PP (The report is written daily)
- Past Simple: was/were + PP (The building was constructed in 2020)
- Present Perfect: has/have been + PP (The project has been completed)
- Future: will be + PP (The results will be announced tomorrow)`,
    quiz: [
      {
        question: 'The report ___ (write) by the manager yesterday.',
        options: ['was written', 'is written', 'wrote', 'has written'],
        correct: 'was written',
        explanation: "Past simple passive: was/were + past participle.",
        explanationUz: "Past simple passiv: was/were + past participle.",
      },
      {
        question: 'Many houses ___ (build) in this area next year.',
        options: ['will be built', 'are built', 'were built', 'have been built'],
        correct: 'will be built',
        explanation: "Future passive: will be + past participle.",
        explanationUz: "Kelajak zamon passiv: will be + past participle.",
      },
    ],
  },
]

export default function GrammarPage() {
  const [selectedLesson, setSelectedLesson] = useState<typeof grammarLessons[0] | null>(null)
  const [step, setStep] = useState<'list' | 'lesson' | 'quiz' | 'results'>('list')
  const [quizIndex, setQuizIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showAnswer, setShowAnswer] = useState(false)

  const mockUser = { name: 'Asilbek', image: null, xp: 2450, streak: 12, level: 3 }

  const calculateScore = () => {
    if (!selectedLesson) return 0
    let correct = 0
    selectedLesson.quiz.forEach((q, i) => {
      if (answers[i] === q.correct) correct++
    })
    return correct
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">📝</span>
            Grammar
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Interactive grammar lessons va quizlar
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Lesson List */}
          {step === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {grammarLessons.map((lesson, i) => (
                <GlassCard
                  key={lesson.id}
                  delay={i * 0.1}
                  onClick={() => { setSelectedLesson(lesson); setStep('lesson') }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                        <Languages className="w-6 h-6 text-teal-500" />
                      </div>
                      <div>
                        <h3 className="font-bold">{lesson.title}</h3>
                        <p className="text-sm text-slate-500">{lesson.titleUz}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={lesson.level === 'BEGINNER' ? 'success' : lesson.level === 'INTERMEDIATE' ? 'warning' : 'danger'} size="sm">
                        {lesson.level}
                      </Badge>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {/* Lesson Content */}
          {step === 'lesson' && selectedLesson && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GlassCard hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-primary-500" />
                  <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {selectedLesson.lesson.split('\n\n').map((paragraph, i) => (
                    <div key={i} className="mb-4">
                      {paragraph.split('\n').map((line, j) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <h4 key={j} className="font-bold text-primary-600 dark:text-primary-400 mt-4">{line.replace(/\*\*/g, '')}</h4>
                        }
                        if (line.startsWith('- ')) {
                          return <p key={j} className="ml-4 text-sm text-slate-600 dark:text-slate-400 italic">{line.slice(2)}</p>
                        }
                        return <p key={j} className="text-slate-700 dark:text-slate-300">{line.replace(/\*\*/g, '')}</p>
                      })}
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => setStep('list')}>
                  Orqaga
                </Button>
                <Button
                  leftIcon={<PenTool className="w-4 h-4" />}
                  onClick={() => { setStep('quiz'); setQuizIndex(0); setAnswers({}); setShowAnswer(false) }}
                >
                  Quiz boshlash
                </Button>
              </div>
            </motion.div>
          )}

          {/* Quiz */}
          {step === 'quiz' && selectedLesson && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <ProgressBar
                value={quizIndex + 1}
                max={selectedLesson.quiz.length}
                label="Quiz progress"
                color="primary"
              />

              <GlassCard hover={false} className="py-8">
                <div className="text-center mb-6">
                  <Badge variant="info" size="md">Savol {quizIndex + 1}/{selectedLesson.quiz.length}</Badge>
                </div>
                <h3 className="text-xl font-bold text-center mb-6">
                  {selectedLesson.quiz[quizIndex].question}
                </h3>

                <div className="space-y-3 max-w-md mx-auto">
                  {selectedLesson.quiz[quizIndex].options.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => {
                        if (!showAnswer) {
                          setAnswers({ ...answers, [quizIndex]: option })
                          setShowAnswer(true)
                        }
                      }}
                      className={cn(
                        'w-full p-4 rounded-xl text-left transition-all border-2',
                        !showAnswer && 'glass-card border-transparent hover:border-primary-500',
                        showAnswer && option === selectedLesson.quiz[quizIndex].correct && 'bg-green-50 dark:bg-green-900/20 border-green-500',
                        showAnswer && answers[quizIndex] === option && option !== selectedLesson.quiz[quizIndex].correct && 'bg-red-50 dark:bg-red-900/20 border-red-500',
                      )}
                      whileHover={!showAnswer ? { scale: 1.02 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showAnswer && option === selectedLesson.quiz[quizIndex].correct && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {showAnswer && answers[quizIndex] === option && option !== selectedLesson.quiz[quizIndex].correct && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 max-w-md mx-auto"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{selectedLesson.quiz[quizIndex].explanation}</p>
                        <p className="text-sm text-slate-500 mt-1">🇺🇿 {selectedLesson.quiz[quizIndex].explanationUz}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </GlassCard>

              {showAnswer && (
                <div className="flex justify-end">
                  <Button
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => {
                      if (quizIndex < selectedLesson.quiz.length - 1) {
                        setQuizIndex(quizIndex + 1)
                        setShowAnswer(false)
                      } else {
                        setStep('results')
                      }
                    }}
                  >
                    {quizIndex < selectedLesson.quiz.length - 1 ? 'Keyingi' : 'Natija'}
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Results */}
          {step === 'results' && selectedLesson && (
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
                      {calculateScore()}/{selectedLesson.quiz.length}
                    </span>
                  </div>
                </motion.div>
                <h2 className="text-xl font-bold">
                  {calculateScore() === selectedLesson.quiz.length ? '🎉 Mukammal!' : '👏 Yaxshi!'}
                </h2>
                <p className="text-slate-500 mt-1">
                  {selectedLesson.title} - Quiz natijasi
                </p>
              </GlassCard>

              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => { setStep('lesson') }}>
                  Darsni qayta o&apos;qish
                </Button>
                <Button onClick={() => setStep('list')}>
                  Boshqa mavzu
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
