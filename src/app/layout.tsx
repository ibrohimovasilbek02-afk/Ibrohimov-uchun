import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sukut AI - Your Funniest IELTS Friend 😎',
  description: 'IELTS Speaking practice with AI. Sukut AI asks questions in English, jokes with you in Uzbek, and teaches you like a best friend!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
