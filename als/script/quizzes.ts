const { PrismaClient } = require('@prisma/client');

let quizzesPrisma: any;

const quizzes = [
    {
        title: "Communication Skills",
        description: "Module 1",
        categoryId: "67e578fb3ab3ec59e294296c",
    },
    {
        title: "Communication Skills (English)",
        description: "Module 1",
        categoryId: "67e578fb3ab3ec59e294296d",
    },
    {
        title: "Mathematical and Problem-Solving Skills",
        description: "Module 1",
        categoryId: "67e578fb3ab3ec59e294296e",
    },
    {
        title: "Life and Career Skills",
        description: "Module 1",
        categoryId: "67e578fb3ab3ec59e294296f",
    },
    {
        title: "Understanding the Self and Society",
        description: "Module 1",
        categoryId: "67e578fc3ab3ec59e2942970",
    },
    {
        title: "Digital Citizenship",
        description: "Module 1",
        categoryId: "67e578fc3ab3ec59e2942971",
    },
    {
        title: "Scientific and Critical Thinking Skills",
        description: "Module 1",
        categoryId: "67e578fc3ab3ec59e2942972",
    },
    {
        title: "Programming",
        description: "Extra~",
        categoryId: "67e578fc3ab3ec59e2942973",
    },
];

async function seedQuizzes() {
    quizzesPrisma = new PrismaClient();

    console.log("Seeding quizzes...");

    for(const quiz of quizzes) {
        const createdQuiz = await quizzesPrisma.quiz.create({
            data: quiz,
        });   
        
        console.log("Created quiz: ", `${createdQuiz.title}`);
    }

    console.log("Seeding quizzes completed!");
}

seedQuizzes().catch((e) => {
    console.log("Error seeding quizzes: ", e);
}).finally(async () => {
    await quizzesPrisma.$disconnect();
});
