'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Menu,
  Bell,
  Sun,
  Moon,
  MessageCircle,
  Flame,
  Star,
  Zap,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user?: {
    name: string | null
    image: string | null
    xp: number
    streak: number
    level: number
  }
}

export default function Navbar({ user }: NavbarProps) {
  const { theme, toggleTheme, toggleSidebar, toggleChat } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Stats */}
            {user && (
              <div className="hidden sm:flex items-center gap-4">
                <motion.div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {user.streak}
                  </span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                    {user.xp} XP
                  </span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    Lv. {user.level}
                  </span>
                </motion.div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* AI Chat Toggle */}
            <motion.button
              onClick={toggleChat}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="w-5 h-5 text-primary-500" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </motion.button>

            {/* User Avatar */}
            {user && (
              <motion.div
                className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || ''}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
