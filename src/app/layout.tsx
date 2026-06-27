import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import ThemeProvider from '@/components/layout/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sukut AI - Your Funniest IELTS Coach',
  description: 'AI-powered IELTS preparation platform with humor and personality. Speaking, Writing, Reading, Listening - all in one place!',
  keywords: ['IELTS', 'AI', 'English', 'Speaking', 'Writing', 'IELTS preparation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
