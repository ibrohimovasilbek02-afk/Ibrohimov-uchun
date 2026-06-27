'use client'

import { useState, useRef, useEffect } from 'react'
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
      content: "Man Shrek man! 😎 Kel gaplashamiz bro! Inglizcha, o'zbekcha — qanday xohlasang! Xato qilsang kulamiz, keyin o'rganamiz! 🔥\n\n🎤 Tell me — what did you do today?",
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

  // Speech Recognition — o'zbekcha va inglizchani tushunadi
  const startListening = () => {
    if (typeof window === 'undefined') return

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert("Chrome brauzer ishlating!")
      return
    }

    const recognition = new SR()
    recognition.lang = 'en-US' // Inglizcha + o'zbekchani ham eshitadi
    recognition.interimResults = false
    recognition.continuous = true // HAR SAFAR RUXSAT SO'RAMAYDI

    recognition.onstart = () => {
      setIsRecording(true)
      setCallStatus('listening')
    }

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1
      const transcript = event.results[last][0].transcript
      if (transcript.trim()) {
        setCallStatus('thinking')
        sendMessageWithText(transcript)
        // Stop after getting result in call mode
        if (callMode) {
          recognition.stop()
        }
      }
    }

    recognition.onerror = (e: any) => {
      if (e.error !== 'no-speech') {
        setIsRecording(false)
        setCallStatus('idle')
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
      // Call rejimida emas va speaking emas bo'lsa restart
      if (!callMode) {
        setCallStatus('idle')
      }
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

  // Text to Speech - ISHLAYDI
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const cleanText = text
      .replace(/[😎😂🎤💪👀🔥❌✅🍅📶💸😅😭🤔👋👏🟢⚡🎬]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n/g, '. ')

    // Qisqa qismga bo'lib gapirish (brauzer uzun textda to'xtaydi)
    const chunks = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText]
    
    let i = 0
    const speakNext = () => {
      if (i < chunks.length) {
        const utterance = new SpeechSynthesisUtterance(chunks[i])
        utterance.lang = 'en-US'
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.volume = 1.0
        
        utterance.onstart = () => {
          setIsSpeaking(true)
          setCallStatus('speaking')
        }
        utterance.onend = () => {
          i++
          if (i < chunks.length) {
            speakNext()
          } else {
            setIsSpeaking(false)
            if (callMode) {
              setCallStatus('listening')
              setTimeout(() => startListening(), 800)
            } else {
              setCallStatus('idle')
            }
          }
        }
        utterance.onerror = () => {
          setIsSpeaking(false)
          setCallStatus('idle')
        }
        
        window.speechSynthesis.speak(utterance)
      }
    }
    
    speakNext()
  }

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setCallStatus('thinking')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message }
      setMessages((prev) => [...prev, aiMessage])
      speakText(data.message)
    } catch (error) {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "Internet yo'q shekilli bro 😅" }])
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

  // ============ CALL MODE ============
  if (callMode) {
    return (
      <div className="h-screen flex flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 py-12 px-6">
        {/* Top */}
        <div className="text-center">
          <h2 className="text-white text-lg font-bold">Shrek AI</h2>
          <p className={`text-sm mt-1 ${
            callStatus === 'listening' ? 'text-green-400' :
            callStatus === 'speaking' ? 'text-indigo-400' :
            callStatus === 'thinking' ? 'text-yellow-400' :
            'text-slate-400'
          }`}>
            {callStatus === 'listening' && 'Eshitayapman...'}
            {callStatus === 'speaking' && 'Gapiratyapman...'}
            {callStatus === 'thinking' && "O'ylayapman..."}
            {callStatus === 'idle' && 'Tayyor'}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          {/* Animated rings */}
          <div className="relative">
            {callStatus === 'speaking' && (
              <>
                <div className="absolute inset-0 w-44 h-44 -m-4 rounded-full border-2 border-indigo-500/40 animate-ping"></div>
                <div className="absolute inset-0 w-40 h-40 -m-2 rounded-full border-2 border-purple-500/30 animate-pulse"></div>
              </>
            )}
            {callStatus === 'listening' && (
              <>
                <div className="absolute inset-0 w-44 h-44 -m-4 rounded-full border-2 border-green-500/40 animate-pulse"></div>
                <div className="absolute inset-0 w-40 h-40 -m-2 rounded-full border-2 border-green-400/30 animate-pulse"></div>
              </>
            )}

            {/* Shrek face with doppi */}
            <div className="relative w-36 h-36">
              {/* Doppi */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-10 z-10">
                <div className="w-full h-full bg-gradient-to-b from-green-700 to-green-900 rounded-t-full border-b-[3px] border-yellow-400">
                  <div className="absolute inset-x-2 top-1.5 bottom-1 border border-yellow-300/40 rounded-t-full"></div>
                </div>
              </div>
              {/* Face */}
              <div className={`w-36 h-36 rounded-full flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-300 ${
                callStatus === 'speaking' ? 'ring-4 ring-indigo-500 scale-105' :
                callStatus === 'listening' ? 'ring-4 ring-green-500 scale-100' :
                callStatus === 'thinking' ? 'ring-4 ring-yellow-500 scale-95' :
                'ring-2 ring-slate-600'
              }`}>
                <img src="/shrek.svg" alt="Shrek" className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display='none'; e.target.parentElement.innerText='😎' }} />
              </div>
            </div>
          </div>

          {/* Last message preview */}
          {messages.length > 1 && (
            <div className="mt-8 max-w-xs text-center px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-slate-300 text-xs leading-relaxed">
                {messages[messages.length - 1].content.substring(0, 100)}
                {messages[messages.length - 1].content.length > 100 && '...'}
              </p>
            </div>
          )}
        </div>

        {/* End Call */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/30 hover:bg-red-400 transition-all active:scale-95"
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
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-700/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
              <img src="/shrek.svg" alt="Shrek" className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display='none'; e.target.parentElement.innerText='😎' }} />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Shrek AI</h1>
              <p className="text-[11px] text-slate-400">Your funniest IELTS friend</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startCall}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-green-500 hover:bg-green-400 transition-all text-white text-xs font-bold shadow-lg shadow-green-500/30 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              Gaplashish
            </button>
            <button onClick={() => setMessages([{ id: '1', role: 'assistant', content: "Man Shrek man! 😎 Qaytadan!\n\n🎤 What is your favorite food?" }])} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"><img src="https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png" alt="S" className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display='none'; e.target.parentElement.innerText='😎' }} /></div>
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
              <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs"><img src="https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png" alt="S" className="w-full h-full object-cover" /></div>
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

      {/* Input */}
      <div className="flex-shrink-0 border-t border-slate-700/50 p-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <button
            onClick={isRecording ? stopListening : startListening}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-700 hover:bg-slate-600'} disabled:opacity-40`}
          >
            {isRecording ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessageWithText(input) } }}
            placeholder={isRecording ? "Eshitayapman..." : "Yozing..."}
            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-green-500 text-sm"
            disabled={isLoading || isRecording}
          />
          <button
            onClick={() => sendMessageWithText(input)}
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
