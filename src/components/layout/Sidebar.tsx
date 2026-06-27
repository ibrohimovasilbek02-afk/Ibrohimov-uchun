'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  BookA,
  Languages,
  User,
  Trophy,
  Settings,
  Crown,
  LogOut,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', emoji: '🏠' },
  { href: '/speaking', icon: Mic, label: 'Speaking', emoji: '🎤' },
  { href: '/writing', icon: PenTool, label: 'Writing', emoji: '✍️' },
  { href: '/reading', icon: BookOpen, label: 'Reading', emoji: '📖' },
  { href: '/listening', icon: Headphones, label: 'Listening', emoji: '🎧' },
  { href: '/vocabulary', icon: BookA, label: 'Vocabulary', emoji: '📚' },
  { href: '/grammar', icon: Languages, label: 'Grammar', emoji: '📝' },
]

const bottomItems = [
  { href: '/profile', icon: User, label: 'Profile', emoji: '👤' },
  { href: '/profile?tab=achievements', icon: Trophy, label: 'Achievements', emoji: '🏆' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useStore()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 w-72 glass-card rounded-none border-r border-white/10',
          'flex flex-col py-6 transition-transform duration-300 lg:translate-x-0',
          !sidebarOpen && '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Sukut AI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">IELTS Coach</p>
            </div>
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Practice
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-link group',
                  isActive && 'sidebar-link-active'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg">{item.emoji}</span>
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-500 group-hover:text-primary-500'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary-500"
                    layoutId="activeIndicator"
                  />
                )}
              </Link>
            )
          })}

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Account
            </p>
            {bottomItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'sidebar-link group',
                    isActive && 'sidebar-link-active'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <item.icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-slate-500 group-hover:text-primary-500'
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Premium CTA */}
        <div className="px-4 mt-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-amber-600 dark:text-amber-400">
                Premium
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Unlimited practice va AI chat
            </p>
            <button className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Upgrade
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
