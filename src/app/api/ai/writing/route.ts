import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { evaluateWriting } from '@/lib/openai'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { essay, taskType, topic } = await request.json()

    if (!essay || !taskType || !topic) {
      return NextResponse.json(
        { error: 'Essay, taskType, and topic are required' },
        { status: 400 }
      )
    }

    // Validate word count
    const wordCount = essay.trim().split(/\s+/).length
    if (taskType === 'TASK2' && wordCount < 200) {
      return NextResponse.json(
        { error: 'Task 2 essay kamida 250 so\'z bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Evaluate with AI
    const evaluation = await evaluateWriting(essay, taskType, topic)

    // Save to database
    const writingSession = await prisma.writingSession.create({
      data: {
        userId: (session.user as any).id,
        taskType,
        topic,
        essay,
        feedback: evaluation.feedback || {},
        taskResponse: evaluation.taskResponse,
        coherence: evaluation.coherence,
        vocabulary: evaluation.vocabulary,
        grammar: evaluation.grammar,
        bandScore: evaluation.bandScore,
        improvedEssay: evaluation.improvedEssay,
      },
    })

    // Update user XP
    const xpEarned = Math.round(evaluation.bandScore * 12)
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        xp: { increment: xpEarned },
      },
    })

    return NextResponse.json({
      ...evaluation,
      sessionId: writingSession.id,
      xpEarned,
    })
  } catch (error) {
    console.error('Writing evaluation error:', error)
    return NextResponse.json(
      { error: 'AI evaluation failed' },
      { status: 500 }
    )
  }
}
