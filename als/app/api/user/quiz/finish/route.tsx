import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import type { IResponse } from '@/types/types';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();

        // Authentication check
        if (!clerkId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { categoryId, quizId, score, responses } = await req.json();

        // Validate request matches your frontend types
        if (
            !categoryId || 
            !quizId || 
            typeof score !== 'number' ||
            score < 0 || score > 100 ||
            !Array.isArray(responses)
        ) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            );
        }

        // Validate each response matches IResponse
        for (const response of responses) {
            if (!response.optionId || typeof response.isCorrect !== 'boolean') {
                return NextResponse.json(
                    { error: "Invalid response format" },
                    { status: 400 }
                );
            }
        }

        // Find or create user
        const user = await prisma.user.upsert({
            where: { clerkId },
            create: { clerkId },
            update: {},
        });

        // Update category stats only (no quizAttempt)
        const existingStat = await prisma.categoryStat.findUnique({
            where: {
                userId_categoryId: {
                    userId: user.id,
                    categoryId
                }
            }
        });

        const updatedStats = existingStat
            ? await prisma.categoryStat.update({
                where: {
                    userId_categoryId: {
                        userId: user.id,
                        categoryId
                    }
                },
                data: {
                    attempts: { increment: 1 },
                    completed: { increment: 1 },
                    averageScore: {
                        set: existingStat.averageScore
                            ? (existingStat.averageScore * existingStat.completed + score) / 
                              (existingStat.completed + 1)
                            : score
                    },
                    lastAttempt: new Date()
                }
            })
            : await prisma.categoryStat.create({
                data: {
                    userId: user.id,
                    categoryId,
                    attempts: 1,
                    completed: 1,
                    averageScore: score,
                    lastAttempt: new Date()
                }
            });

        return NextResponse.json({
            success: true,
            stats: updatedStats,
            quizId,
            categoryId
        });

    } catch (error) {
        console.error("[QUIZ_FINISH_ERROR]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}