'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Trophy,
  Star,
  Flame,
  TrendingUp,
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  Crown,
  Medal,
  Target,
  Calendar,
  Award,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { cn, formatBand } from '@/lib/utils'

const tabs = ['Overview', 'History', 'Achievements', 'Statistics']

const mockAchievements = [
  { id: '1', name: 'First Steps', icon: '🎯', desc: 'Birinchi speaking session', unlocked: true },
  { id: '2', name: 'Week Warrior', icon: '🔥', desc: '7 kun streak', unlocked: true },
  { id: '3', name: 'Essay Master', icon: '✍️', desc: '10 ta essay yozish', unlocked: true },
  { id: '4', name: 'Vocab King', icon: '📚', desc: '100 ta so\'z o\'rganish', unlocked: false },
  { id: '5', name: 'Band 7+', icon: '🏆', desc: 'Band 7+ olish', unlocked: false },
  { id: '6', name: 'Monthly Legend', icon: '👑', desc: '30 kun streak', unlocked: false },
]

const mockHistory = [
  { type: 'speaking', date: '2024-12-20', band: 6.5, topic: 'Hometown', xp: 50 },
  { type: 'writing', date: '2024-12-19', band: 7.0, topic: 'Education vs Experience', xp: 75 },
  { type: 'reading', date: '2024-12-19', band: 6.0, topic: 'AI in Healthcare', xp: 40 },
  { type: 'listening', date: '2024-12-18', band: 6.5, topic: 'Campus Tour', xp: 45 },
  { type: 'speaking', date: '2024-12-17', band: 7.0, topic: 'Technology', xp: 60 },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const mockUser = { name: 'Asilbek', image: null, xp: 2450, streak: 12, level: 3 }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speaking': return <Mic className="w-4 h-4 text-blue-500" />
      case 'writing': return <PenTool className="w-4 h-4 text-purple-500" />
      case 'reading': return <BookOpen className="w-4 h-4 text-green-500" />
      case 'listening': return <Headphones className="w-4 h-4 text-orange-500" />
      default: return null
    }
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <GlassCard hover={false} className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6 py-4">
            <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-4xl shadow-lg">
              😎
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{mockUser.name}</h1>
              <p className="text-slate-500">IELTS Warrior • Level {mockUser.level}</p>
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold">{mockUser.streak} streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold">{mockUser.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-bold">Band 6.5</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
                activeTab === tab
                  ? 'gradient-bg text-white shadow-lg'
                  : 'glass-card hover:scale-105'
              )}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'Overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Band Scores */}
            <GlassCard hover={false}>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Band Scores
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Speaking', band: 6.5, color: 'primary' as const },
                  { label: 'Writing', band: 7.0, color: 'success' as const },
                  { label: 'Reading', band: 6.0, color: 'warning' as const },
                  { label: 'Listening', band: 6.5, color: 'accent' as const },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <p className="text-sm text-slate-500 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold">{formatBand(item.band)}</p>
                    <ProgressBar value={item.band} max={9} showValue={false} color={item.color} size="sm" className="mt-2" />
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <p className="text-sm text-slate-500">Overall Band Prediction</p>
                <p className="text-3xl font-bold gradient-text">6.5</p>
              </div>
            </GlassCard>

            {/* Level Progress */}
            <GlassCard hover={false}>
              <h3 className="font-bold mb-3">Level Progress</h3>
              <ProgressBar value={450} max={1000} label="Level 3 → Level 4" color="primary" />
              <p className="text-sm text-slate-500 mt-2">550 XP kerak keyingi levelga</p>
            </GlassCard>
          </motion.div>
        )}

        {/* History */}
        {activeTab === 'History' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {mockHistory.map((item, i) => (
              <GlassCard key={i} delay={i * 0.05}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{item.type}: {item.topic}</p>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="info" size="sm">Band {item.band}</Badge>
                    <Badge variant="success" size="sm">+{item.xp} XP</Badge>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Achievements */}
        {activeTab === 'Achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {mockAchievements.map((achievement, i) => (
              <GlassCard
                key={achievement.id}
                delay={i * 0.05}
                hover={false}
                className={cn(!achievement.unlocked && 'opacity-50 grayscale')}
              >
                <div className="text-center">
                  <span className="text-4xl">{achievement.icon}</span>
                  <h4 className="font-bold mt-2">{achievement.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{achievement.desc}</p>
                  {achievement.unlocked ? (
                    <Badge variant="success" size="sm" className="mt-2">Ochildi ✓</Badge>
                  ) : (
                    <Badge variant="default" size="sm" className="mt-2">Qulflangan 🔒</Badge>
                  )}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Statistics */}
        {activeTab === 'Statistics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Jami sessiyalar', value: '47', icon: Calendar },
                { label: 'Jami XP', value: '2,450', icon: Star },
                { label: 'Eng uzun streak', value: '12 kun', icon: Flame },
                { label: 'Achievements', value: '3/6', icon: Trophy },
              ].map((stat, i) => (
                <GlassCard key={i} delay={i * 0.1} hover={false}>
                  <div className="text-center">
                    <stat.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </GlassCard>
              ))}
            </div>

            <GlassCard hover={false}>
              <h3 className="font-bold mb-4">Bo&apos;limlar bo&apos;yicha</h3>
              <div className="space-y-3">
                {[
                  { label: 'Speaking', sessions: 15, avgBand: 6.5 },
                  { label: 'Writing', sessions: 12, avgBand: 7.0 },
                  { label: 'Reading', sessions: 10, avgBand: 6.0 },
                  { label: 'Listening', sessions: 10, avgBand: 6.5 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="font-medium">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">{item.sessions} sessions</span>
                      <Badge variant="info" size="sm">Avg: {item.avgBand}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
