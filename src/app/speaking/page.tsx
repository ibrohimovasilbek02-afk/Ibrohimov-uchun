'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  Clock,
  Target,
  MessageCircle,
  ChevronRight,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { cn, formatDuration, getBandColor } from '@/lib/utils'

const speakingTopics = {
  part1: [
    { id: 1, topic: 'Work & Studies', questions: ['Do you work or study?', 'What do you like about your job/studies?', 'Would you like to change your job/field of study?'] },
    { id: 2, topic: 'Hometown', questions: ['Where is your hometown?', 'What do you like about it?', 'Has it changed much over the years?'] },
    { id: 3, topic: 'Free Time', questions: ['What do you do in your free time?', 'Do you prefer indoor or outdoor activities?', 'Has your free time changed recently?'] },
  ],
  part2: [
    { id: 4, topic: 'Describe a memorable journey', cueCard: 'You should say:\n- where you went\n- who you went with\n- what you did\nand explain why it was memorable.' },
    { id: 5, topic: 'Describe a person who inspires you', cueCard: 'You should say:\n- who this person is\n- how you know them\n- what they do\nand explain why they inspire you.' },
  ],
  part3: [
    { id: 6, topic: 'Travel & Tourism', questions: ['How has tourism changed in recent years?', 'What are the advantages of international travel?', 'Do you think virtual tourism will replace physical travel?'] },
    { id: 7, topic: 'Education & Learning', questions: ['How has education changed with technology?', 'What skills are important for the future?', 'Should education be free for everyone?'] },
  ],
}

type Part = 'part1' | 'part2' | 'part3'

export default function SpeakingPage() {
  const [selectedPart, setSelectedPart] = useState<Part>('part1')
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [step, setStep] = useState<'select' | 'practice' | 'feedback'>('select')

  const mockUser = { name: 'Asilbek', image: null, xp: 2450, streak: 12, level: 3 }

  const mockFeedback = {
    bandScore: 6.5,
    grammarScore: 7.0,
    pronunciationScore: 6.0,
    fluencyScore: 6.5,
    vocabularyScore: 7.0,
    sukutComment: "Yaxshi gapirding! 👏 Lekin 'uh', 'um' degan pausalarni kamaytir — examiner senga 'free music' uchun ball bermaydi! 😄 Pronunciation'da 'th' sound'ni practice qil — 'the' ni 'ze' deyish IELTS'da band tushiradi!",
    strengths: ['Good vocabulary range', 'Clear topic development', 'Natural examples'],
    weaknesses: ['Too many filler words', 'Some pronunciation issues with "th"', 'Occasional grammar mistakes with articles'],
    tips: ['Practice speaking without fillers', 'Record yourself and listen back', 'Use the "2-second pause" technique instead of "um"'],
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    // TODO: Implement actual recording
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setStep('feedback')
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
              <span className="text-3xl">🎤</span>
              Speaking Practice
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              AI bilan real-time speaking practice
            </p>
          </div>
          <Badge variant="info" size="lg">
            <Target className="w-4 h-4 mr-1" />
            Oxirgi Band: 6.5
          </Badge>
        </motion.div>

        {/* Part Selection */}
        <div className="flex gap-3 flex-wrap">
          {(['part1', 'part2', 'part3'] as Part[]).map((part) => (
            <motion.button
              key={part}
              onClick={() => { setSelectedPart(part); setStep('select'); setSelectedTopic(null) }}
              className={cn(
                'px-6 py-3 rounded-xl font-semibold transition-all duration-300',
                selectedPart === part
                  ? 'gradient-bg text-white shadow-lg'
                  : 'glass-card hover:scale-105'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Part {part.slice(-1)}
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
              {(speakingTopics[selectedPart] as any[]).map((topic, i) => (
                <GlassCard
                  key={topic.id}
                  delay={i * 0.1}
                  onClick={() => { setSelectedTopic(topic.id); setStep('practice') }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="font-bold">{topic.topic}</h3>
                        <p className="text-sm text-slate-500">
                          {topic.questions ? `${topic.questions.length} savollar` : 'Cue Card'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {/* Practice Mode */}
          {step === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Question Card */}
              <GlassCard hover={false} className="text-center py-10">
                <div className="mb-6">
                  <Badge variant="info" size="md">Part {selectedPart.slice(-1)} - Savol {currentQuestion + 1}</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedPart === 'part2'
                    ? (speakingTopics[selectedPart] as any[])[0]?.topic
                    : (speakingTopics[selectedPart] as any[])[0]?.questions?.[currentQuestion]
                  }
                </h2>
                {selectedPart === 'part2' && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-left max-w-md mx-auto">
                    <pre className="text-sm whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                      {(speakingTopics[selectedPart] as any[])[0]?.cueCard}
                    </pre>
                  </div>
                )}
              </GlassCard>

              {/* Recording Area */}
              <GlassCard hover={false} className="text-center py-8">
                {/* Timer */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="font-mono text-lg font-bold">
                      {formatDuration(recordingTime)}
                    </span>
                  </div>
                </div>

                {/* Recording Button */}
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={cn(
                      'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
                      isRecording
                        ? 'bg-red-500 shadow-red-500/50 animate-pulse'
                        : 'gradient-bg shadow-primary-500/50 hover:shadow-xl'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isRecording ? (
                      <Square className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Wave animation when recording */}
                {isRecording && (
                  <motion.div
                    className="flex items-center justify-center gap-1 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="wave-animation text-primary-500">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </motion.div>
                )}

                <p className="mt-4 text-sm text-slate-500">
                  {isRecording ? 'Gapirayotgan bo\'lsangiz, to\'xtating...' : 'Bosib gapiring'}
                </p>
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
                <h2 className="text-xl font-bold mb-2">Band Score</h2>
                <p className="text-slate-500">Yaxshi natija! 🎉</p>
              </GlassCard>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Grammar', score: mockFeedback.grammarScore, color: 'primary' as const },
                  { label: 'Pronunciation', score: mockFeedback.pronunciationScore, color: 'warning' as const },
                  { label: 'Fluency', score: mockFeedback.fluencyScore, color: 'success' as const },
                  { label: 'Vocabulary', score: mockFeedback.vocabularyScore, color: 'accent' as const },
                ].map((item, i) => (
                  <GlassCard key={i} hover={false} delay={i * 0.1}>
                    <p className="text-sm text-slate-500 mb-2">{item.label}</p>
                    <p className={cn('text-2xl font-bold', getBandColor(item.score))}>
                      {item.score}
                    </p>
                    <ProgressBar value={item.score} max={9} showValue={false} color={item.color} size="sm" className="mt-2" />
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

              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-4">
                <GlassCard hover={false}>
                  <h3 className="font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Kuchli tomonlar
                  </h3>
                  <ul className="space-y-2">
                    {mockFeedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard hover={false}>
                  <h3 className="font-bold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" /> Yaxshilash kerak
                  </h3>
                  <ul className="space-y-2">
                    {mockFeedback.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500 mt-0.5">!</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  leftIcon={<RotateCcw className="w-5 h-5" />}
                  onClick={() => setStep('select')}
                >
                  Qayta urinish
                </Button>
                <Button
                  leftIcon={<Play className="w-5 h-5" />}
                  onClick={() => setStep('select')}
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
