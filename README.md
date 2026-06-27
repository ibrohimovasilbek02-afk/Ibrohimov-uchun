# Sukut AI - Your Funniest IELTS Coach 😎

> AI-powered IELTS preparation platform with humor and personality

## 🚀 Features

- **Speaking** - AI real-time speaking practice (Parts 1, 2, 3)
- **Writing** - Essay checker with band score
- **Reading** - AI-generated passages with timer
- **Listening** - Audio comprehension practice
- **Vocabulary** - 10 new words daily (flashcards, quiz, sentences)
- **Grammar** - Interactive lessons with quizzes
- **AI Memory** - Remembers your progress, weaknesses, and preferences
- **Gamification** - XP, Levels, Streak, Achievements, Leaderboard
- **Dark/Light Mode** - Glassmorphism design
- **Premium** - Unlimited access to all features

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js (Google + Email)
- **AI**: OpenAI GPT-4, Whisper API
- **State**: Zustand
- **Styling**: Glassmorphism, Dark Mode, Responsive

## 📦 Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in your credentials

# 3. Set up database
npx prisma generate
npx prisma db push

# 4. Run development server
npm run dev
```

## 🔐 Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Auth secret
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `OPENAI_API_KEY` - AI features

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   ├── auth/            # Login, Register
│   ├── dashboard/       # Main dashboard
│   ├── speaking/        # Speaking practice
│   ├── writing/         # Writing practice
│   ├── reading/         # Reading practice
│   ├── listening/       # Listening practice
│   ├── vocabulary/      # Vocabulary learning
│   ├── grammar/         # Grammar lessons
│   ├── profile/         # User profile
│   └── admin/           # Admin panel
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── lib/                 # Utilities (prisma, auth, openai)
├── hooks/               # Custom React hooks
├── store/               # Zustand state
├── types/               # TypeScript types
└── styles/              # Global CSS
```

## 🎨 Design System

- Glassmorphism cards with backdrop blur
- Gradient text and backgrounds
- Smooth animations (Framer Motion)
- Responsive & Mobile First
- Dark/Light mode toggle

## 🤖 AI Personality (Sukut)

- 😂 Funny - Always tells jokes
- 🧠 Smart - Knows everything about IELTS
- 🎯 Precise - Catches every mistake
- 🔥 Motivator - Encourages students
- 📚 Professional - Band 9.0 knowledge
- Explains in Uzbek and English mix

## 📱 Future Plans

- [ ] Mobile App (React Native)
- [ ] Desktop App (Electron)
- [ ] Telegram Bot
- [ ] Discord Bot
- [ ] AI Voice Coach
- [ ] AI Avatar
- [ ] Community Features

---

Built with ❤️ by Sukut AI Team
