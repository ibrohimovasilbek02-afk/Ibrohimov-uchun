'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, RotateCcw, Zap, Volume2, Phone, PhoneOff } from 'lucide-react'

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
      content: "Yo bro! 😎 Men Sukut AI — sening IELTS do'sting! \n\n🎤 Mikrofon bosib gapir yoki yozib yubor.\n\n🟢 Pastdagi yashil tugmani bos — men bilan gaplash!",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [callMode, setCallMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Speech-to-Text
  const startListening = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Brauzeringiz ovozni qo'llab-quvvatlamaydi. Chrome ishlating!")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onstart = () => {
      setIsRecording(true)
      setCallStatus('listening')
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setIsRecording(false)
      setCallStatus('thinking')
      sendMessageWithText(transcript)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      setCallStatus('idle')
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
      setCallStatus('idle')
    }
  }

  // Text-to-Speech
  const speakText = (text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined') return

    const cleanText = text
      .replace(/[😎😂🎤💪👀🔥❌✅🍅📶💸😅😭🤔👋👏🟢⚡]/g, '')
      .replace(/\*\*/g, '')
      .replace(/🎤.*$/m, '')

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.pitch = 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
      setCallStatus('speaking')
    }
    utterance.onend = () => {
      setIsSpeaking(false)
      setCallStatus('idle')
      if (onEnd) onEnd()
      // Call rejimida — tugagandan keyin yana eshitishni boshlash
      if (callMode) {
        setTimeout(() => startListening(), 1000)
      }
    }

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
    setCallStatus('thinking')

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
      // Ovozda aytish
      speakText(data.message)
    } catch (error) {
      const errMsg = "Internet bilan muammo bor 😅"
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: errMsg }])
      setCallStatus('idle')
    } finally {
      setIsLoading(false)
    }
  }

  const startCall = () => {
    setCallMode(true)
    setCallStatus('listening')
    startListening()
  }

  const endCall = () => {
    setCallMode(false)
    setCallStatus('idle')
    window.speechSynthesis.cancel()
    stopListening()
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

  // CALL MODE - to'liq ekran gaplashish
  if (callMode) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
        {/* Background animated circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-64 h-64 rounded-full border-2 ${callStatus === 'speaking' ? 'border-indigo-500 animate-ping' : callStatus === 'listening' ? 'border-green-500 animate-pulse' : 'border-slate-700'} opacity-20`}></div>
          <div className={`absolute w-48 h-48 rounded-full border-2 ${callStatus === 'speaking' ? 'border-purple-500 animate-ping' : callStatus === 'listening' ? 'border-green-400 animate-pulse' : 'border-slate-700'} opacity-30`}></div>
          <div className={`absolute w-32 h-32 rounded-full border-2 ${callStatus === 'speaking' ? 'border-pink-500 animate-ping' : callStatus === 'listening' ? 'border-green-300 animate-pulse' : 'border-slate-700'} opacity-40`}></div>
        </div>

        {/* Sukut Avatar */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Doppi (to'ppi) */}
          <div className="relative">
            {/* Doppi */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-12 z-20">
              <div className="w-full h-full bg-gradient-to-b from-emerald-800 to-emerald-900 rounded-t-full border-b-4 border-yellow-500 relative">
                {/* Doppi naqsh */}
                <div className="absolute inset-x-2 top-2 bottom-1 border border-yellow-400/50 rounded-t-full"></div>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-yellow-500"></div>
              </div>
            </div>
            {/* Yuz */}
            <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl ${
              callStatus === 'speaking' 
                ? 'gradient-bg animate-pulse' 
                : callStatus === 'listening'
                ? 'bg-green-600'
                : 'bg-slate-700'
            }`}>
              {callStatus === 'speaking' ? '🗣️' : callStatus === 'listening' ? '👂' : '😎'}
            </div>
          </div>

          {/* Nom */}
          <h2 className="text-white text-xl font-bold mt-6">Sukut AI</h2>
          
          {/* Status */}
          <p className={`text-sm mt-2 ${
            callStatus === 'listening' ? 'text-green-400' :
            callStatus === 'speaking' ? 'text-indigo-400' :
            callStatus === 'thinking' ? 'text-yellow-400' :
            'text-slate-400'
          }`}>
            {callStatus === 'listening' && '🟢 Sizni eshitayapman...'}
            {callStatus === 'speaking' && '🔊 Gapiratyapman...'}
            {callStatus === 'thinking' && '🤔 O\'ylayapman...'}
            {callStatus === 'idle' && '⏸️ Kutayapman...'}
          </p>

          {/* Oxirgi xabar */}
          {messages.length > 0 && (
            <div className="mt-6 max-w-sm text-center px-6 py-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <p className="text-slate-300 text-sm leading-relaxed">
                {messages[messages.length - 1].content.substring(0, 150)}
                {messages[messages.length - 1].content.length > 150 && '...'}
              </p>
            </div>
          )}
        </div>

        {/* End Call button */}
        <div className="absolute bottom-16 flex flex-col items-center gap-4">
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
          <p className="text-slate-500 text-xs">Tugatish</p>
        </div>
      </div>
    )
  }

  // CHAT MODE - oddiy yozma chat + call tugmasi
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
          <div className="flex items-center gap-2">
            {/* CALL tugmasi */}
            <button
              onClick={startCall}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition-colors text-white text-xs font-medium shadow-lg shadow-green-600/30"
            >
              <Phone className="w-3.5 h-3.5" />
              Gaplashish
            </button>
            <button
              onClick={() => setMessages([{ id: '1', role: 'assistant', content: "Qaytadan! 😄\n\n🎤 What is your favorite hobby?" }])}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
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
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="self-start flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-400 transition-colors px-2 py-1"
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
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-sm">😎</div>
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

      {/* Input */}
      <div className="flex-shrink-0 border-t border-slate-700/50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={isRecording ? stopListening : startListening}
              disabled={isLoading}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-700 hover:bg-slate-600'
              } disabled:opacity-40`}
            >
              {isRecording ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isRecording ? "Eshitayapman..." : "Yozing..."}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-indigo-500 text-sm"
              disabled={isLoading || isRecording}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center disabled:opacity-40"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-600 mt-2">
            {isRecording ? '🔴 Gapirayapsiz...' : '🟢 "Gaplashish" bosing — ovozli suhbat boshlang!'}
          </p>
        </div>
      </div>
    </div>
  )
}
