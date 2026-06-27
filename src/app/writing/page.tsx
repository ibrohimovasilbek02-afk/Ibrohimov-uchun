'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PenTool,
  Send,
  RotateCcw,
  CheckCircle,
  Target,
  BookOpen,
  FileText,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { cn, getBandColor } from '@/lib/utils'

const writingTopics = {
  task1: [
    { id: 1, title: 'Bar Chart: Internet Usage', desc: 'The chart shows internet usage in different age groups' },
    { id: 2, title: 'Line Graph: Population Growth', desc: 'The graph shows population growth in three countries' },
    { id: 3, title: 'Pie Chart: Energy Sources', desc: 'The chart shows energy sources in 2020 and 2025' },
  ],
  task2: [
    { id: 4, title: 'Education: Online vs Traditional', desc: 'Some people believe online education is better than traditional classroom learning. Discuss both views.' },
    { id: 5, title: 'Environment: Individual vs Government', desc: 'Some think individuals can do nothing to protect the environment. Only governments can make a difference. To what extent do you agree?' },
    { id: 6, title: 'Technology: Social Media Impact', desc: 'Social media has more negative effects than positive. To what extent do you agree or disagree?' },
  ],
}

export default function WritingPage() {
  const [taskType, setTaskType] = useState<'task1' | 'task2'>('task2')
  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [essay, setEssay] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<'select' | 'write' | 'feedback'>('select')
  const [wordCount, setWordCount] = useState(0)

  const mockUser = { name: 'Asilbek', image: null, xp: 2450, streak: 12, level: 3 }

  const mockFeedback = {
    bandScore: 6.5,
    taskResponse: 7.0,
    coherence: 6.0,
    vocabulary: 7.0,
    grammar: 6.5,
    sukutComment: "Essay yomon emas! 👏 Lekin coherence'da muammo bor — paragraphlar bir-biriga 'qo'shni uylar' kabi yaqin, lekin 'ko'cha' (linking words) yo'q! 😄 'Furthermore', 'Moreover', 'In contrast' ishlatib bog'la!",
    feedback: {
      taskResponseFeedback: "Savolga to'liq javob berilgan, lekin ikkinchi argumentni kuchliroq support qilish kerak.",
      coherenceFeedback: "Paragraphlar orasida transition so'zlar kam. Topic sentences yaxshi, lekin linking words kerak.",
      vocabularyFeedback: "IELTS academic vocabulary ishlatilgan, lekin ba'zi joyda repetition bor.",
      grammarFeedback: "Complex sentences yaxshi, lekin article ('a', 'the') xatolar bor.",
    },
    grammarErrors: [
      { error: "The education is important", correction: "Education is important", explanationUz: "Umumiy tushunchalar oldida 'the' ishlatilmaydi" },
      { error: "peoples think", correction: "people think", explanationUz: "'People' so'zi allaqachon ko'plik" },
    ],
    improvedEssay: "In the contemporary era, the debate surrounding online versus traditional education has intensified considerably. While some advocate for digital learning platforms, others maintain that conventional classroom settings remain superior. This essay will examine both perspectives before presenting a reasoned conclusion...",
  }

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setEssay(text)
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep('feedback')
    }, 3000)
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
              <span className="text-3xl">✍️</span>
              Writing Practice
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Essay yozing, AI tekshiradi va band score beradi
            </p>
          </div>
        </motion.div>

        {/* Task Type Selection */}
        <div className="flex gap-3">
          {(['task1', 'task2'] as const).map((task) => (
            <motion.button
              key={task}
              onClick={() => { setTaskType(task); setStep('select'); setSelectedTopic(null) }}
              className={cn(
                'px-6 py-3 rounded-xl font-semibold transition-all',
                taskType === task
                  ? 'gradient-bg text-white shadow-lg'
                  : 'glass-card hover:scale-105'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Task {task.slice(-1)}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Topic Selection */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-4"
            >
              <h2 className="text-lg font-semibold">Mavzu tanlang:</h2>
              {writingTopics[taskType].map((topic, i) => (
                <GlassCard
                  key={topic.id}
                  delay={i * 0.1}
                  onClick={() => { setSelectedTopic(topic); setStep('write') }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-bold">{topic.title}</h3>
                        <p className="text-sm text-slate-500 max-w-md">{topic.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {/* Writing Area */}
          {step === 'write' && (
            <motion.div
              key="write"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Topic */}
              <GlassCard hover={false} className="border-l-4 border-l-purple-500">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h3 className="font-bold">{selectedTopic?.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      {selectedTopic?.desc}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Essay Input */}
              <GlassCard hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Essayingizni yozing:
                  </span>
                  <Badge
                    variant={wordCount >= 250 ? 'success' : wordCount >= 150 ? 'warning' : 'danger'}
                    size="sm"
                  >
                    {wordCount} so&apos;z {taskType === 'task2' ? '(min 250)' : '(min 150)'}
                  </Badge>
                </div>
                <textarea
                  value={essay}
                  onChange={handleEssayChange}
                  placeholder="Essayingizni shu yerga yozing..."
                  className="w-full h-96 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none transition-all text-base leading-relaxed"
                />
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="ghost"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => { setEssay(''); setWordCount(0) }}
                    size="sm"
                  >
                    Tozalash
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    disabled={wordCount < 50}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Tekshirish
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Feedback */}
          {step === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Band Score */}
              <GlassCard hover={false} className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {mockFeedback.bandScore}
                    </span>
                  </div>
                </motion.div>
                <h2 className="text-xl font-bold">Overall Band Score</h2>
              </GlassCard>

              {/* Criteria Scores */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Task Response', score: mockFeedback.taskResponse },
                  { label: 'Coherence', score: mockFeedback.coherence },
                  { label: 'Vocabulary', score: mockFeedback.vocabulary },
                  { label: 'Grammar', score: mockFeedback.grammar },
                ].map((item, i) => (
                  <GlassCard key={i} hover={false} delay={i * 0.1}>
                    <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                    <p className={cn('text-2xl font-bold', getBandColor(item.score))}>
                      {item.score}
                    </p>
                  </GlassCard>
                ))}
              </div>

              {/* Sukut Comment */}
              <GlassCard hover={false} className="border-2 border-primary-500/20">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">😎</span>
                  </div>
                  <div>
                    <p className="font-bold text-primary-600 dark:text-primary-400 mb-1">Sukut AI</p>
                    <p className="text-slate-700 dark:text-slate-300">
                      {mockFeedback.sukutComment}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Grammar Errors */}
              <GlassCard hover={false}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-red-500" />
                  Grammar Xatolar
                </h3>
                <div className="space-y-3">
                  {mockFeedback.grammarErrors.map((error, i) => (
                    <div key={i} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="line-through text-red-500 text-sm">{error.error}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-green-600 dark:text-green-400 font-medium text-sm">{error.correction}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        💡 {error.explanationUz}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Improved Essay */}
              <GlassCard hover={false}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  Band 8+ Essay namunasi
                </h3>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {mockFeedback.improvedEssay}
                  </p>
                </div>
              </GlassCard>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  leftIcon={<RotateCcw className="w-5 h-5" />}
                  onClick={() => { setStep('write'); setEssay('') }}
                >
                  Qayta yozish
                </Button>
                <Button
                  onClick={() => { setStep('select'); setSelectedTopic(null); setEssay('') }}
                >
                  Yangi mavzu
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
