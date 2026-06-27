'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Ism kiritilishi kerak'
    if (!formData.email) newErrors.email = 'Email kiritilishi kerak'
    if (formData.password.length < 8) newErrors.password = 'Parol kamida 8 ta belgi bo\'lishi kerak'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parollar mos kelmaydi'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    // TODO: Implement registration
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Sukut AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            IELTS sayohatini boshlaylik! 🚀
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Bepul ro&apos;yxatdan o&apos;ting va tayyorgarlikni boshlang
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium">Google bilan ro&apos;yxatdan o&apos;tish</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm text-slate-500">yoki</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Ism"
              type="text"
              placeholder="Ismingiz"
              icon={<User className="w-5 h-5" />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            <div className="relative">
              <Input
                label="Parol"
                type={showPassword ? 'text' : 'password'}
                placeholder="Kamida 8 ta belgi"
                icon={<Lock className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Input
              label="Parolni tasdiqlash"
              type="password"
              placeholder="Parolni qaytadan kiriting"
              icon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Ro&apos;yxatdan o&apos;tish
            </Button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
          Akkountingiz bormi?{' '}
          <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            Kirish
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
