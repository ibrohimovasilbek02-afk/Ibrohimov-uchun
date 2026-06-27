import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateReadingPassage } from '@/lib/openai'
import prisma from '@/lib/prisma'

// Generate a new reading passage
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level') || 'intermediate'

    const passage = await generateReadingPassage(level)

    return NextResponse.json(passage)
  } catch (error) {
    console.error('Reading generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate reading passage' },
      { status: 500 }
    )
  }
}

// Submit answers and get results
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { passage, questions, userAnswers, correctAnswers, timeSpent } = await request.json()

    // Calculate score
    let score = 0
    const explanations: any[] = []

    questions.forEach((q: any, i: number) => {
      const isCorrect = userAnswers[i] === correctAnswers[i]
      if (isCorrect) score++
      explanations.push({
        questionId: q.id,
        correct: isCorrect,
        explanation: q.explanation,
        explanationUz: q.explanationUz,
      })
    })

    // Calculate band score
    const percentage = score / questions.length
    let bandScore = 4.0
    if (percentage >= 0.9) bandScore = 8.5
    else if (percentage >= 0.8) bandScore = 7.5
    else if (percentage >= 0.7) bandScore = 7.0
    else if (percentage >= 0.6) bandScore = 6.5
    else if (percentage >= 0.5) bandScore = 6.0
    else if (percentage >= 0.4) bandScore = 5.5
    else if (percentage >= 0.3) bandScore = 5.0

    // Save to database
    const readingSession = await prisma.readingSession.create({
      data: {
        userId: (session.user as any).id,
        passage,
        questions,
        userAnswers,
        correctAnswers,
        explanations,
        score,
        totalQuestions: questions.length,
        timeSpent,
        bandScore,
      },
    })

    // Update XP
    const xpEarned = score * 8
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { xp: { increment: xpEarned } },
    })

    return NextResponse.json({
      score,
      totalQuestions: questions.length,
      bandScore,
      explanations,
      sessionId: readingSession.id,
      xpEarned,
    })
  } catch (error) {
    console.error('Reading submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process reading results' },
      { status: 500 }
    )
  }
}
