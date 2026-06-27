'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Mic, MicOff, RotateCcw, Phone, PhoneOff, Volume2 } from 'lucide-react'

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
      content: "Man Shrek man! 😎 Kel gaplashamiz bro! Yashil tugmani bos — men senga savol beraman, sen javob ber!",
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
  const callModeRef = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // callMode ref ni sync qilish
  useEffect(() => {
    callModeRef.current = callMode
  }, [callMode])

  // ===== TEXT TO SPEECH =====
  const speakText = useCallback((text: string, onDone?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onDone) onDone()
      return
    }

    window.speechSynthesis.cancel()

    // Tozalash
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]/gu, '')
      .replace(/\*\*/g, '')
      .replace(/🎤[^]*/g, '') // savolni o'qimaydi
      .trim()

    if (!cleanText) {
      if (onDone) onDone()
      return
    }

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.pitch = 0.9
    utterance.volume = 1.0

    // Ovoz tanlash
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Male')) 
      || voices.find(v => v.lang.startsWith('en'))
    if (englishVoice) utterance.voice = englishVoice

    utterance.onstart = () => {
      setIsSpeaking(true)
      setCallStatus('speaking')
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      if (onDone) onDone()
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      if (onDone) onDone()
    }

    // Kichik delay — brauzer tayyor bo'lishi uchun
    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 100)
  }, [])

  // ===== SPEECH RECOGNITION =====
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return

    // Agar oldingi recognition bor bo'lsa to'xtat
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch(e) {}
    }

    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsRecording(true)
      setCallStatus('listening')
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      if (transcript.trim()) {
        setIsRecording(false)
        setCallStatus('thinking')
        handleSend(transcript)
      }
    }

    recognition.onerror = (e: any) => {
      setIsRecording(false)
      // Call rejimida — xato bo'lsa qayta boshlash
      if (callModeRef.current && e.error !== 'aborted') {
        setTimeout(() => {
          if (callModeRef.current) startListening()
        }, 1000)
      } else {
        setCallStatus('idle')
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
      // Call rejimida — tugatilganda qayta boshlash (agar gapirmayotgan bo'lsa)
      if (callModeRef.current && !isSpeaking) {
        setTimeout(() => {
          if (callModeRef.current) startListening()
        }, 500)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isSpeaking])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch(e) {}
      recognitionRef.current = null
    }
    setIsRecording(false)
  }, [])

  // ===== SEND MESSAGE =====
  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setCallStatus('thinking')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message }
      setMessages((prev) => [...prev, aiMessage])

      // OVOZDA GAPIRISH
      speakText(data.message, () => {
        // Gapirish tugagandan keyin — call rejimda yana eshitish boshlash
        if (callModeRef.current) {
          setCallStatus('listening')
          setTimeout(() => {
            if (callModeRef.current) startListening()
          }, 800)
        } else {
          setCallStatus('idle')
        }
      })
    } catch (error) {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "Hmm, qaytadan urinib ko'r bro!" }])
      if (callModeRef.current) {
        setTimeout(() => startListening(), 1000)
      }
      setCallStatus('idle')
    } finally {
      setIsLoading(false)
    }
  }

  // ===== CALL START/END =====
  const startCall = () => {
    setCallMode(true)
    callModeRef.current = true
    
    // Birinchi Shrek gapiradi, keyin eshitadi
    const greeting = "Yo bro! Man Shrek man! Gapirishni boshla — men eshitaman!"
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: greeting }])
    
    speakText(greeting, () => {
      if (callModeRef.current) {
        setCallStatus('listening')
        startListening()
      }
    })
  }

  const endCall = () => {
    setCallMode(false)
    callModeRef.current = false
    setCallStatus('idle')
    window.speechSynthesis.cancel()
    stopListening()
  }

  // ============ CALL MODE ============
  if (callMode) {
    return (
      <div className="h-screen flex flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-green-950 py-12 px-6">
        {/* Top */}
        <div className="text-center">
          <h2 className="text-white text-xl font-bold">Shrek AI</h2>
          <p className={`text-sm mt-2 font-medium ${
            callStatus === 'listening' ? 'text-green-400' :
            callStatus === 'speaking' ? 'text-blue-400' :
            callStatus === 'thinking' ? 'text-yellow-400' :
            'text-slate-400'
          }`}>
            {callStatus === 'listening' && '🟢 Gapiringgg... eshitayapman'}
            {callStatus === 'speaking' && '🔊 Shrek gapiratyapti...'}
            {callStatus === 'thinking' && "⏳ O'ylayapman..."}
            {callStatus === 'idle' && '⏸ Kutayapman...'}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Animated rings */}
            {callStatus === 'speaking' && (
              <>
                <div className="absolute -inset-6 rounded-full border-2 border-blue-500/30 animate-ping"></div>
                <div className="absolute -inset-4 rounded-full border-2 border-blue-400/20 animate-pulse"></div>
              </>
            )}
            {callStatus === 'listening' && (
              <>
                <div className="absolute -inset-6 rounded-full border-2 border-green-500/30 animate-pulse"></div>
                <div className="absolute -inset-4 rounded-full border-2 border-green-400/20 animate-pulse"></div>
              </>
            )}

            <div className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 transition-all duration-300 ${
              callStatus === 'speaking' ? 'border-blue-500 scale-110' :
              callStatus === 'listening' ? 'border-green-500 scale-100' :
              callStatus === 'thinking' ? 'border-yellow-500 scale-95' :
              'border-slate-600'
            }`}>
              <img src="/shrek.svg" alt="Shrek" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Last message */}
          {messages.length > 1 && (
            <div className="mt-8 max-w-xs text-center px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-slate-300 text-xs leading-relaxed">
                {messages[messages.length - 1].content.substring(0, 120)}
                {messages[messages.length - 1].content.length > 120 && '...'}
              </p>
            </div>
          )}
        </div>

        {/* End Call */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/30 hover:bg-red-400 active:scale-90 transition-all"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
          <p className="text-slate-500 text-xs">Tugatish</p>
        </div>
      </div>
    )
  }

  // ============ CHAT MODE ============
  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <header className="flex-shrink-0 border-b border-slate-700/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-green-500/50">
              <img src="/shrek.svg" alt="Shrek" className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Shrek AI</h1>
              <p className="text-[11px] text-green-400">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startCall}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-green-500 hover:bg-green-400 text-white text-xs font-bold shadow-lg shadow-green-500/30 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
              Gaplashish
            </button>
            <button onClick={() => setMessages([{ id: '1', role: 'assistant', content: "Man Shrek man! 😎 Qaytadan!\n\n🎤 What is your favorite food?" }])} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-green-500/50">
                  <img src="/shrek.svg" alt="S" className="w-full h-full" />
                </div>
              )}
              <div className="flex flex-col gap-0.5 max-w-[80%]">
                <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/50'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <button onClick={() => speakText(msg.content)} className="self-start flex items-center gap-1 text-[10px] text-slate-500 hover:text-green-400 px-1">
                    <Volume2 className="w-2.5 h-2.5" /> Eshitish
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-xs">🧑</div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-green-500/50">
                <img src="/shrek.svg" alt="S" className="w-full h-full" />
              </div>
              <div className="px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700/50">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce [animation-delay:0.1s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce [animation-delay:0.2s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-slate-700/50 p-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <button
            onClick={isRecording ? stopListening : startListening}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            {isRecording ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(input) } }}
            placeholder={isRecording ? "Eshitayapman..." : "Yozing..."}
            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-green-500 text-sm"
            disabled={isLoading || isRecording}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
