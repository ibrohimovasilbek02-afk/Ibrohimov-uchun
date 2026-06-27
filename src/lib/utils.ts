import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBand(score: number): string {
  return score.toFixed(1)
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1
}

export function xpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  return currentLevel * 1000
}

export function xpProgress(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  const xpInCurrentLevel = currentXp - (currentLevel - 1) * 1000
  return (xpInCurrentLevel / 1000) * 100
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Xayrli tong'
  if (hour < 18) return 'Xayrli kun'
  return 'Xayrli kech'
}

export function getMotivationalQuote(): string {
  const quotes = [
    "Bugun ham IELTS'ni yengamiz! 💪",
    "Har bir so'z - yangi imkoniyat! 🌟",
    "Band 9 yo'lida davom etamiz! 🚀",
    "Kecha'dan yaxshiroq bo'lamiz! 📈",
    "English is your superpower! ⚡",
    "Practice makes perfect, lekin Sukut bilan tezroq! 😎",
    "Speaking practice qilsak, examiner hayron qoladi! 🎤",
    "Writing'da grammar king bo'lamiz! 👑",
  ]
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function getBandColor(band: number): string {
  if (band >= 8) return 'text-green-500'
  if (band >= 7) return 'text-blue-500'
  if (band >= 6) return 'text-yellow-500'
  if (band >= 5) return 'text-orange-500'
  return 'text-red-500'
}

export function getBandLabel(band: number): string {
  if (band >= 8.5) return 'Expert'
  if (band >= 7.5) return 'Very Good'
  if (band >= 6.5) return 'Competent'
  if (band >= 5.5) return 'Modest'
  if (band >= 4.5) return 'Limited'
  return 'Extremely Limited'
}
