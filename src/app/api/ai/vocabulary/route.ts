import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateDailyWords } from '@/lib/openai'
import prisma from '@/lib/prisma'

// Get daily words
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to get existing words for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get user's vocabulary progress
    const progress = await prisma.vocabularyProgress.findMany({
      where: {
        userId: (session.user as any).id,
      },
      include: {
        word: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    if (progress.length > 0) {
      return NextResponse.json({
        words: progress.map((p) => ({
          ...p.word,
          status: p.status,
          correctCount: p.correctCount,
          incorrectCount: p.incorrectCount,
        })),
      })
    }

    // Generate new words
    const newWords = await generateDailyWords()

    // Save words to database
    const savedWords = await Promise.all(
      newWords.words.map(async (w: any) => {
        const word = await prisma.word.upsert({
          where: { word: w.word },
          update: {},
          create: {
            word: w.word,
            meaning: w.meaning,
            meaningUz: w.meaningUz,
            pronunciation: w.pronunciation,
            partOfSpeech: w.partOfSpeech,
            examples: w.examples,
            synonyms: w.synonyms,
            antonyms: w.antonyms,
            level: w.level,
            topic: w.topic,
          },
        })

        // Create progress entry
        await prisma.vocabularyProgress.upsert({
          where: {
            userId_wordId: {
              userId: (session.user as any).id,
              wordId: word.id,
            },
          },
          update: {},
          create: {
            userId: (session.user as any).id,
            wordId: word.id,
            status: 'NEW',
          },
        })

        return word
      })
    )

    return NextResponse.json({ words: savedWords })
  } catch (error) {
    console.error('Vocabulary error:', error)
    return NextResponse.json(
      { error: 'Failed to get vocabulary' },
      { status: 500 }
    )
  }
}

// Update word progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { wordId, correct } = await request.json()

    const progress = await prisma.vocabularyProgress.update({
      where: {
        userId_wordId: {
          userId: (session.user as any).id,
          wordId,
        },
      },
      data: {
        correctCount: correct ? { increment: 1 } : undefined,
        incorrectCount: !correct ? { increment: 1 } : undefined,
        lastReviewed: new Date(),
        status: correct ? 'LEARNING' : 'NEW',
      },
    })

    // Award XP for correct answers
    if (correct) {
      await prisma.user.update({
        where: { id: (session.user as any).id },
        data: { xp: { increment: 5 } },
      })
    }

    return NextResponse.json({ progress, xpEarned: correct ? 5 : 0 })
  } catch (error) {
    console.error('Vocabulary progress error:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
