'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  BookA,
  Languages,
  Zap,
  Star,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react'
import Button from '@/components/ui/Button'

const features = [
  { icon: Mic, title: 'Speaking', desc: 'AI bilan real-time speaking practice', color: 'from-blue-500 to-cyan-500' },
  { icon: PenTool, title: 'Writing', desc: 'Essay tekshirish va band score', color: 'from-purple-500 to-pink-500' },
  { icon: BookOpen, title: 'Reading', desc: 'AI yaratgan passages va savollar', color: 'from-green-500 to-emerald-500' },
  { icon: Headphones, title: 'Listening', desc: 'Audio comprehension practice', color: 'from-orange-500 to-red-500' },
  { icon: BookA, title: 'Vocabulary', desc: 'Har kuni 10 ta yangi so\'z', color: 'from-indigo-500 to-purple-500' },
  { icon: Languages, title: 'Grammar', desc: 'Interactive grammar lessons', color: 'from-teal-500 to-green-500' },
]

const stats = [
  { value: '10K+', label: 'Foydalanuvchilar' },
  { value: '95%', label: 'Mamnunlik' },
  { value: '7.5+', label: 'O\'rtacha Band' },
  { value: '24/7', label: 'AI Coach' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 backdrop-blur-xl bg-white/50 dark:bg-slate-900/50 border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Sukut AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Kirish
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Boshlash
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                AI-powered IELTS preparation
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
              <span className="text-slate-900 dark:text-white">Your Funniest</span>
              <br />
              <span className="gradient-text">IELTS Coach</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Sukut AI bilan IELTS tayyorgarligini kulgu va qiziqarli mashg&apos;ulotlar bilan o&apos;tkazing.
              Speaking, Writing, Reading, Listening — hammasi bitta joyda! 🚀
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Bepul Boshlash
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="secondary" size="lg">
                  Ko&apos;proq bilish
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating elements */}
          <div className="relative mt-16 max-w-4xl mx-auto">
            <motion.div
              className="absolute -top-8 -left-8 p-4 glass-card rounded-2xl shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">Band 7.5!</p>
                  <p className="text-xs text-slate-500">Speaking natijasi</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-4 p-4 glass-card rounded-2xl shadow-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-bold">30 kun streak!</p>
                  <p className="text-xs text-slate-500">Davom eting</p>
                </div>
              </div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              className="glass-card p-8 rounded-3xl shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white text-xl">
                      😎
                    </div>
                    <div>
                      <p className="font-bold text-lg">Assalomu alaykum!</p>
                      <p className="text-sm text-slate-500">Bugun ham IELTS yengamiz!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold">2,450 XP</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {['7.0', '7.5', '6.5', '7.0'].map((band, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-700 text-center">
                      <p className="text-xs text-slate-500">
                        {['Speaking', 'Writing', 'Reading', 'Listening'][i]}
                      </p>
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{band}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 border-y border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{stat.value}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Barcha IELTS bo&apos;limlari <span className="gradient-text">bitta joyda</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Sukut AI sizning shaxsiy IELTS coach — 24/7 tayyor, har doim kulgili! 😄
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card p-6 rounded-2xl card-3d"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Personality Section */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Sukut AI — <span className="gradient-text">sizning do&apos;stingiz</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Oddiy AI emas — kulgili, aqlli va motivatsiya beruvchi do&apos;st!
              </p>
              <div className="space-y-4">
                {[
                  { emoji: '😂', text: 'Har safar yangi hazillar bilan o\'qitadi' },
                  { emoji: '🧠', text: 'Sizning xatolaringizni eslab qoladi' },
                  { emoji: '🎯', text: 'Shaxsiy band prediction beradi' },
                  { emoji: '🔥', text: 'Har kuni motivatsiya beradi' },
                  { emoji: '📚', text: 'O\'zbekchada tushuntiradi' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="glass-card p-6 rounded-3xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">😎</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 max-w-sm">
                    <p className="text-sm">
                      Salom! Men Sukut AI — eng kulgili IELTS coach! 😄 Essay&apos;ingni ko&apos;rsang, band score aytaman. 
                      Lekin ogohlantiraman — hazillarim bepul! 🎉
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 max-w-sm">
                    <p className="text-sm">
                      Writing Task 2 uchun essay yozdim, tekshirib bera olasizmi?
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👤</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">😎</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 max-w-sm">
                    <p className="text-sm">
                      Albatta! Ko&apos;raylik... 🔍 Oh, essay yaxshi yozilgan, lekin coherence ga e&apos;tibor ber — 
                      paragraphlar orasida &quot;plov ingredientlari&quot; kabi bog&apos;lanish kerak! 🍛 Band: 6.5 → 7.5 ga olib chiqamiz! 💪
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-card p-12 rounded-3xl relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 gradient-bg opacity-10" />
            <div className="relative">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                IELTS tayyorgarligini <span className="gradient-text">hozir boshlang!</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
                Minglab o&apos;quvchilar Sukut AI bilan Band 7+ ga erishdi. Navbat sizda! 🎯
              </p>
              <Link href="/auth/register">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Bepul Ro&apos;yxatdan O&apos;tish
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold gradient-text">Sukut AI</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; 2024 Sukut AI. Your funniest IELTS coach. 😎
          </p>
        </div>
      </footer>
    </div>
  )
}
