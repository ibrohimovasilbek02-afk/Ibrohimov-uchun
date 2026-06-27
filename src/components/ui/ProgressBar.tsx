'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'primary',
  size = 'md',
  className,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const colors = {
    primary: 'from-primary-400 to-primary-600',
    success: 'from-green-400 to-green-600',
    warning: 'from-yellow-400 to-yellow-600',
    danger: 'from-red-400 to-red-600',
    accent: 'from-accent-400 to-accent-600',
  }

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden',
          sizes[size]
        )}
      >
        <motion.div
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            colors[color]
          )}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
