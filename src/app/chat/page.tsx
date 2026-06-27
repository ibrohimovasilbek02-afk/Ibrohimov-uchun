'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Zap, RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Yo bro! 😎 Men Sukut AI — sening eng yaxshi IELTS do'sting! Kel gaplashamiz ingliz tilida. Men savol beraman, sen javob ber. Xato qilsang — ustingdan kulib, to'g'risini o'rgataman! 😂\n\nReady? Let's start!\n\n🎤 **Tell me about yourself. What do you do in your free time?**",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: 'friend',
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Voy internet uzildi shekilli 😅 Qaytadan yozib ko'r!",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Qaytadan boshlaymizmi? 😄 OK!\n\n🎤 **What is your favorite hobby and why do you enjoy it?**",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white flex items-center gap-2">
                Sukut AI <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">online</span>
              </h1>
              <p className="text-xs text-slate-400">Your funniest IELTS friend 😎</p>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-lg shadow-lg">
                  😎
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700/50'
                )}
              >
                {msg.content.split('**').map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="text-primary-400">{part}</strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-lg">
                  🧑
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              className="flex gap-3 justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-lg">
                😎
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700/50">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 backdrop-blur-xl bg-slate-900/80 border-t border-slate-700/50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Javob yozing..."
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                disabled={isLoading}
              />
            </div>
            <motion.button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">
            Sukut AI — do'sting kabi gaplashadi, hazil qiladi, IELTS o'rgatadi 🚀
          </p>
        </div>
      </div>
    </div>
  )
}
