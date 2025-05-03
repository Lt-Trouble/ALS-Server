import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, categoryId, score, responses, difficulty } = body;

    // Find or create the user in our database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      create: {
        clerkId: user.id,
        role: 'user'
      },
      update: {}
    });

    // Update category stats
    await prisma.categoryStat.upsert({
      where: {
        userId_categoryId: {
          userId: dbUser.id,
          categoryId: categoryId
        }
      },
      create: {
        userId: dbUser.id,
        categoryId: categoryId,
        attempts: 1,
        completed: 1,
        averageScore: score,
        lastAttempt: new Date()
      },
      update: {
        attempts: { increment: 1 },
        completed: { increment: 1 },
        averageScore: {
          // Calculate new average score
          increment: (score - (await prisma.categoryStat.findUnique({
            where: {
              userId_categoryId: {
                userId: dbUser.id,
                categoryId: categoryId
              }
            }
          }))?.averageScore || 0) / 2
        },
        lastAttempt: new Date()
      }
    });

    // Save the quiz attempt (you might want to create a separate model for this)
    // This is a simplified version - you might want to store more details

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}