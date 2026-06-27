'use client'

import { useStore } from '@/store/useStore'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name: string | null
    image: string | null
    xp: number
    streak: number
    level: number
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const { sidebarOpen } = useStore()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <div
        className={cn(
          'transition-all duration-300',
          'lg:ml-72'
        )}
      >
        <Navbar user={user} />
        <main className="p-4 lg:p-6 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
