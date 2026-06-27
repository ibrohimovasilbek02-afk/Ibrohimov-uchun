'use client'

import { motion } from 'framer-motion'
import {
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  BookA,
  Languages,
  Flame,
  Star,
  Trophy,
  TrendingUp,
  Target,
  Calendar,
  Zap,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GlassCard from '@/components/ui/GlassCard'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { getGreeting, getMotivationalQuote, formatBand } from '@/lib/utils'

// Mock user data (will be replaced with real data from API)
const mockUser = {
  name: 'Asilbek',
  image: null,
  xp: 2450,
  coins: 180,
  streak: 12,
  level: 3,
  bandPrediction: 6.5,
  isPremium: false,
}

const mockWeeklyProgress = [
  { day: 'Du', xp: 120 },
  { day: 'Se', xp: 85 },
  { day: 'Ch', xp: 200 },
  { day: 'Pa', xp: 150 },
  { day: 'Ju', xp: 90 },
  { day: 'Sh', xp: 175 },
  { day: 'Ya', xp: 60 },
]

const practiceCards = [
  { href: '/speaking', icon: Mic, title: 'Speaking', desc: 'AI bilan gaplashing', color: 'from-blue-500 to-cyan-500', emoji: '🎤', lastBand: 6.5 },
  { href: '/writing', icon: PenTool, title: 'Writing', desc: 'Essay yozib tekshir', color: 'from-purple-500 to-pink-500', emoji: '✍️', lastBand: 7.0 },
  { href: '/reading', icon: BookOpen, title: 'Reading', desc: 'Passage o\'qi va javob ber', color: 'from-green-500 to-emerald-500', emoji: '📖', lastBand: 6.0 },
  { href: '/listening', icon: Headphones, title: 'Listening', desc: 'Audio eshit va javob ber', color: 'from-orange-500 to-red-500', emoji: '🎧', lastBand: 6.5 },
  { href: '/vocabulary', icon: BookA, title: 'Vocabulary', desc: '10 ta yangi so\'z', color: 'from-indigo-500 to-purple-500', emoji: '📚', progress: 7 },
  { href: '/grammar', icon: Languages, title: 'Grammar', desc: 'Bugungi mavzu', color: 'from-teal-500 to-green-500', emoji: '📝', progress: 3 },
]

export default function DashboardPage() {
  const maxWeeklyXp = Math.max(...mockWeeklyProgress.map((d) => d.xp))

  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              <span className="animate-wave inline-block mr-2">👋</span>
              {getGreeting()}, <span className="gradient-text">{mockUser.name}</span>!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {getMotivationalQuote()}
            </p>
          </div>
          <Badge variant="premium" size="lg">
            <Target className="w-4 h-4 mr-1" />
            Band Prediction: {formatBand(mockUser.bandPrediction!)}
          </Badge>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard delay={0.1}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUser.streak}</p>
                <p className="text-xs text-slate-500">Kun streak</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={0.2}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUser.xp.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Jami XP</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={0.3}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Lv. {mockUser.level}</p>
                <p className="text-xs text-slate-500">Daraja</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={0.4}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUser.coins}</p>
                <p className="text-xs text-slate-500">Coins</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Level Progress */}
        <GlassCard delay={0.5} hover={false}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-500" />
              <span className="font-semibold">Level {mockUser.level} Progress</span>
            </div>
            <span className="text-sm text-slate-500">
              {mockUser.xp % 1000} / 1000 XP
            </span>
          </div>
          <ProgressBar
            value={mockUser.xp % 1000}
            max={1000}
            showValue={false}
            color="primary"
            size="md"
          />
        </GlassCard>

        {/* Practice Cards */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Bugungi mashg&apos;ulotlar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {practiceCards.map((card, i) => (
              <Link key={card.href} href={card.href}>
                <GlassCard delay={0.1 * (i + 1)} className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl">{card.emoji}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {card.desc}
                  </p>
                  {card.lastBand && (
                    <div className="flex items-center justify-between">
                      <Badge variant="info" size="sm">
                        Band: {card.lastBand}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  {card.progress !== undefined && (
                    <ProgressBar
                      value={card.progress}
                      max={10}
                      label="Bugun"
                      size="sm"
                      color="success"
                    />
                  )}
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <GlassCard delay={0.8} hover={false}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Haftalik Progress
            </h3>
            <Badge variant="success">+{mockWeeklyProgress.reduce((a, b) => a + b.xp, 0)} XP</Badge>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {mockWeeklyProgress.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  className="w-full rounded-xl bg-gradient-to-t from-primary-500 to-primary-400 min-h-[8px]"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.xp / maxWeeklyXp) * 100}%` }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                />
                <span className="text-xs text-slate-500 font-medium">{day.day}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Today's Challenge */}
        <GlassCard delay={1.0} hover={false} className="border-2 border-primary-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-2xl shadow-lg">
                🎯
              </div>
              <div>
                <h3 className="font-bold text-lg">Bugungi Challenge</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Speaking Part 2 tugating va 50 XP oling!
                </p>
              </div>
            </div>
            <Link href="/speaking">
              <button className="btn-primary text-sm">
                Boshlash
              </button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  )
}
