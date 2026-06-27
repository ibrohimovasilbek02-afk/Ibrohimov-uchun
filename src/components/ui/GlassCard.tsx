'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  animate?: boolean
  delay?: number
  onClick?: () => void
}

export default function GlassCard({
  children,
  className,
  hover = true,
  animate = true,
  delay = 0,
  onClick,
}: GlassCardProps) {
  const Component = animate ? motion.div : 'div'

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay },
      }
    : {}

  return (
    <Component
      className={cn(
        'glass-card p-6',
        hover && 'card-3d cursor-pointer',
        className
      )}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </Component>
  )
}
