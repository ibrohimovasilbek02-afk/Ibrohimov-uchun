import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { evaluateSpeaking } from '@/lib/openai'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transcript, topic, part } = await request.json()

    if (!transcript || !topic || !part) {
      return NextResponse.json(
        { error: 'Transcript, topic, and part are required' },
        { status: 400 }
      )
    }

    // Evaluate with AI
    const evaluation = await evaluateSpeaking(transcript, topic, part)

    // Save to database
    const speakingSession = await prisma.speakingSession.create({
      data: {
        userId: (session.user as any).id,
        part,
        topic,
        questions: [],
        answers: [transcript],
        feedback: evaluation.feedback || {},
        grammarScore: evaluation.grammarScore,
        pronunciationScore: evaluation.pronunciationScore,
        fluencyScore: evaluation.fluencyScore,
        vocabularyScore: evaluation.vocabularyScore,
        bandScore: evaluation.bandScore,
      },
    })

    // Update user XP
    const xpEarned = Math.round(evaluation.bandScore * 10)
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        xp: { increment: xpEarned },
        lastBand: evaluation.bandScore,
      },
    })

    return NextResponse.json({
      ...evaluation,
      sessionId: speakingSession.id,
      xpEarned,
    })
  } catch (error) {
    console.error('Speaking evaluation error:', error)
    return NextResponse.json(
      { error: 'AI evaluation failed' },
      { status: 500 }
    )
  }
}
