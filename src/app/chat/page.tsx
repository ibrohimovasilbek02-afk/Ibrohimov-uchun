'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, RotateCcw, Zap, Volume2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Yo bro! 😎 Men Sukut AI — sening eng yaxshi IELTS do'sting! Tugmani bos va gapirishni boshlash! Yoki yozib ham yuborishingiz mumkin.\n\n🎤 Tell me about yourself. What do you do in your free time?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Speech-to-Text (brauzer bepul API)
  const startRecording = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Brauzeringiz ovozli gaplashishni qo\'llab-quvvatlamaydi. Chrome ishlating!')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsRecording(false)
      // Avtomatik yuborish
      sendMessageWithText(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  // Text-to-Speech (brauzer bepul API)
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return

    // Emoji va maxsus belgilarni olib tashlash
    const cleanText = text.replace(/[😎😂🎤💪👀🔥❌✅🍅📶💸😅😭🤔👋👏]/g, '')
      .replace(/\*\*/g, '')
      .replace(/🎤.*$/m, '') // oxirgi savolni o'qimaydi

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
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
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      }

      setMessages((prev) => [...prev, aiMessage])

      // AI javobini ovozda aytadi
      speakText(data.message)
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Internet bilan muammo bor 😅 Qaytadan urinib ko'r!",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = () => {
    sendMessageWithText(input)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    window.speechSynthesis.cancel()
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Qaytadan boshlaymizmi? 😄 Keling!\n\n🎤 What is your favorite hobby and why do you enjoy it?",
      },
    ])
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-700/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm flex items-center gap-2">
                Sukut AI
                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">online</span>
              </h1>
              <p className="text-[11px] text-slate-400">Your funniest IELTS friend 😎</p>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            title="Qaytadan boshlash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-sm shadow-md">
                  😎
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div
                  className={`p-3.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700/50'
                  }`}
                >
                  {msg.content}
                </div>
                {/* Ovozda eshitish tugmasi */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="self-start flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-400 transition-colors px-2 py-1 rounded"
                  >
                    <Volume2 className="w-3 h-3" />
                    Eshitish
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-sm">
                  🧑
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-sm">
                😎
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700/50">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.3s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-slate-700/50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Mikrofon tugmasi - katta */}
          <div className="flex items-center gap-3">
            {/* Mikrofon */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isRecording
                  ? 'bg-red-500 animate-pulse shadow-red-500/50'
                  : 'bg-slate-700 hover:bg-slate-600'
              } disabled:opacity-40`}
              title={isRecording ? "To'xtatish" : "Gapirishni boshlash"}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Yozma input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isRecording ? "Gapirayapsiz..." : "Yozing yoki mikrofon bosing..."}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors text-sm"
              disabled={isLoading || isRecording}
            />

            {/* Yuborish */}
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center disabled:opacity-40"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Status */}
          <p className="text-center text-[11px] text-slate-600 mt-2">
            {isRecording ? (
              <span className="text-red-400">🔴 Gapirayapsiz... tugasa to'xtaydi</span>
            ) : isSpeaking ? (
              <span className="text-indigo-400">🔊 Sukut gapiratyapti...</span>
            ) : (
              "🎤 Mikrofon bosing — gapirishni boshlang | Yoki yozib yuboring"
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
