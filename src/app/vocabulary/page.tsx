'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookA,
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  Brain,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils'

const dailyWords = [
  {
    id: '1',
    word: 'Ubiquitous',
    meaning: 'Present, appearing, or found everywhere',
    meaningUz: 'Hamma joyda mavjud bo\'lgan',
    pronunciation: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adjective',
    examples: ['Smartphones have become ubiquitous in modern life.', 'The ubiquitous influence of social media affects everyone.'],
    synonyms: ['omnipresent', 'pervasive', 'universal'],
    antonyms: ['rare', 'scarce'],
    level: 'ACADEMIC',
  },
  {
    id: '2',
    word: 'Exacerbate',
    meaning: 'To make a problem or situation worse',
    meaningUz: 'Muammoni yomonlashtirmoq',
    pronunciation: '/ɪɡˈzæs.ər.beɪt/',
    partOfSpeech: 'verb',
    examples: ['Climate change could exacerbate food shortages.', 'His comments only exacerbated the conflict.'],
    synonyms: ['worsen', 'aggravate', 'intensify'],
    antonyms: ['alleviate', 'improve'],
    level: 'ACADEMIC',
  },
  {
    id: '3',
    word: 'Pragmatic',
    meaning: 'Dealing with things in a practical way',
    meaningUz: 'Amaliy, hayotiy yondashuv',
    pronunciation: '/præɡˈmæt.ɪk/',
    partOfSpeech: 'adjective',
    examples: ['We need a pragmatic approach to solving this issue.', 'She is known for her pragmatic leadership style.'],
    synonyms: ['practical', 'realistic', 'sensible'],
    antonyms: ['idealistic', 'impractical'],
    level: 'ADVANCED',
  },
  {
    id: '4',
    word: 'Mitigate',
    meaning: 'To make something less severe or serious',
    meaningUz: 'Yengillashtirmoq, kamaytirmoq',
    pronunciation: '/ˈmɪt.ɪ.ɡeɪt/',
    partOfSpeech: 'verb',
    examples: ['Trees help mitigate the effects of pollution.', 'The government took steps to mitigate the economic impact.'],
    synonyms: ['alleviate', 'reduce', 'lessen'],
    antonyms: ['aggravate', 'worsen'],
    level: 'ACADEMIC',
  },
  {
    id: '5',
    word: 'Paradigm',
    meaning: 'A typical example or pattern of something',
    meaningUz: 'Namuna, model, paradigma',
    pronunciation: '/ˈpær.ə.daɪm/',
    partOfSpeech: 'noun',
    examples: ['The internet created a new paradigm for communication.', 'This represents a paradigm shift in education.'],
    synonyms: ['model', 'pattern', 'framework'],
    antonyms: [],
    level: 'ACADEMIC',
  },
]

type Mode = 'flashcard' | 'quiz' | 'sentence'

export default function VocabularyPage() {
  const [mode, setMode] = useState<Mode>('flashcard')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null)
  const [learnedCount, setLearnedCount] = useState(0)

  const mockUser = { name: 'Asilbek', image: null, xp: 2450, streak: 12, level: 3 }
  const currentWord = dailyWords[currentIndex]

  const goNext = () => {
    if (currentIndex < dailyWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      setQuizAnswer(null)
      setQuizCorrect(null)
      setLearnedCount(learnedCount + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
      setQuizAnswer(null)
      setQuizCorrect(null)
    }
  }

  const checkQuizAnswer = (answer: string) => {
    setQuizAnswer(answer)
    setQuizCorrect(answer === currentWord.meaning)
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <span className="text-3xl">📚</span>
              Vocabulary
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Har kuni 10 ta yangi so&apos;z o&apos;rganing
            </p>
          </div>
          <Badge variant="success" size="lg">
            {learnedCount}/{dailyWords.length} o&apos;rganildi
          </Badge>
        </motion.div>

        {/* Progress */}
        <ProgressBar
          value={currentIndex + 1}
          max={dailyWords.length}
          label="Bugungi progress"
          color="primary"
        />

        {/* Mode Selector */}
        <div className="flex gap-3">
          {([
            { key: 'flashcard', label: 'Flashcard', emoji: '🃏' },
            { key: 'quiz', label: 'Quiz', emoji: '❓' },
            { key: 'sentence', label: 'Sentence', emoji: '✏️' },
          ] as const).map((m) => (
            <motion.button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={cn(
                'px-4 py-2 rounded-xl font-medium transition-all text-sm',
                mode === m.key
                  ? 'gradient-bg text-white shadow-lg'
                  : 'glass-card hover:scale-105'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {m.emoji} {m.label}
            </motion.button>
          ))}
        </div>

        {/* Flashcard Mode */}
        {mode === 'flashcard' && (
          <motion.div
            key={`flashcard-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div
              className="relative h-80 cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div className={cn(
                  'absolute inset-0 glass-card p-8 flex flex-col items-center justify-center text-center backface-hidden',
                  isFlipped && 'invisible'
                )}>
                  <Badge variant="info" size="sm" className="mb-4">
                    {currentWord.partOfSpeech}
                  </Badge>
                  <h2 className="text-4xl font-bold gradient-text mb-4">
                    {currentWord.word}
                  </h2>
                  <p className="text-slate-500 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    {currentWord.pronunciation}
                  </p>
                  <p className="text-sm text-slate-400 mt-6">
                    Bosib ma&apos;nosini ko&apos;ring 👆
                  </p>
                </div>

                {/* Back */}
                <div className={cn(
                  'absolute inset-0 glass-card p-8 flex flex-col items-center justify-center text-center backface-hidden',
                  !isFlipped && 'invisible'
                )} style={{ transform: 'rotateY(180deg)' }}>
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {currentWord.meaning}
                  </p>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                    🇺🇿 {currentWord.meaningUz}
                  </p>
                  <div className="text-sm text-slate-500 space-y-1">
                    <p className="italic">&ldquo;{currentWord.examples[0]}&rdquo;</p>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap justify-center">
                    {currentWord.synonyms.map((s) => (
                      <Badge key={s} variant="default" size="sm">{s}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                Oldingi
              </Button>
              <span className="text-sm text-slate-500">
                {currentIndex + 1} / {dailyWords.length}
              </span>
              <Button
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={goNext}
                disabled={currentIndex === dailyWords.length - 1}
              >
                Keyingi
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quiz Mode */}
        {mode === 'quiz' && (
          <motion.div
            key={`quiz-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard hover={false} className="text-center py-8">
              <Brain className="w-10 h-10 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{currentWord.word}</h2>
              <p className="text-slate-500">{currentWord.pronunciation}</p>
              <p className="text-sm text-slate-400 mt-4">Bu so&apos;zning ma&apos;nosini toping:</p>
            </GlassCard>

            <div className="space-y-3">
              {[
                currentWord.meaning,
                'To increase rapidly in number',
                'Something that is easily broken',
                'A strong feeling of excitement',
              ].sort(() => Math.random() - 0.5).map((option, i) => (
                <motion.button
                  key={i}
                  onClick={() => checkQuizAnswer(option)}
                  disabled={quizAnswer !== null}
                  className={cn(
                    'w-full p-4 rounded-xl text-left transition-all border-2',
                    quizAnswer === null && 'glass-card border-transparent hover:border-primary-500',
                    quizAnswer === option && quizCorrect && 'bg-green-50 dark:bg-green-900/20 border-green-500',
                    quizAnswer === option && !quizCorrect && 'bg-red-50 dark:bg-red-900/20 border-red-500',
                    quizAnswer !== null && option === currentWord.meaning && quizAnswer !== option && 'bg-green-50 dark:bg-green-900/20 border-green-500',
                  )}
                  whileHover={quizAnswer === null ? { scale: 1.02 } : {}}
                  whileTap={quizAnswer === null ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {quizAnswer === option && quizCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {quizAnswer === option && !quizCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </motion.button>
              ))}
            </div>

            {quizAnswer && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard hover={false} className={quizCorrect ? 'border-green-500/30' : 'border-red-500/30'}>
                  <p className={cn('font-medium', quizCorrect ? 'text-green-600' : 'text-red-500')}>
                    {quizCorrect ? '🎉 To\'g\'ri!' : '❌ Noto\'g\'ri!'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    🇺🇿 {currentWord.meaningUz}
                  </p>
                </GlassCard>
                <div className="flex justify-end mt-4">
                  <Button rightIcon={<ArrowRight className="w-4 h-4" />} onClick={goNext}>
                    Keyingi so&apos;z
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Sentence Mode */}
        {mode === 'sentence' && (
          <motion.div
            key={`sentence-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h3 className="font-bold">So&apos;z bilan gap tuzing:</h3>
              </div>
              <div className="text-center py-4">
                <h2 className="text-3xl font-bold gradient-text mb-2">{currentWord.word}</h2>
                <p className="text-slate-500">{currentWord.meaningUz}</p>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <textarea
                placeholder={`"${currentWord.word}" so'zini ishlatib gap yozing...`}
                className="w-full h-32 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 outline-none resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-slate-500">Misol: &ldquo;{currentWord.examples[0]}&rdquo;</p>
                <Button size="sm">Tekshirish</Button>
              </div>
            </GlassCard>

            <div className="flex items-center justify-between">
              <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={goPrev} disabled={currentIndex === 0}>
                Oldingi
              </Button>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />} onClick={goNext} disabled={currentIndex === dailyWords.length - 1}>
                Keyingi
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
