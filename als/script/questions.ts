const questions = require("../data/communicationSkillsQuestions.js")

let questionsPrisma: any;

async function seedQuestions() {
    const { PrismaClient } = require("@prisma/client");

    questionsPrisma = new PrismaClient();

    console.log("Seeding questions...");

    for (const question of questions) {
        const createdQuestion = await questionsPrisma.question.create({
            data: {
                text: question.text,
                quizId: "67e612ef9a8b1f5a294e3e16",
                options: {
                    create: question.options,
                },
                difficulty: question.difficulty,
            },
        });

        console.log(`Created question: ${createdQuestion.text}`);
    }

    console.log("Questions seeded successfully!");
}

seedQuestions().catch((e) => {
    console.log("Error seeding questions: ", e);
    })
    .finally(async () => {
        await questionsPrisma.$disconnect();
    });