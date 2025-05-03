let categsPrisma: any;

async function addCategories() {
    
    const { PrismaClient } = require('@prisma/client');

    categsPrisma = new PrismaClient();

    const categories = [
        {
            name: "Communication Skills",
            description: "Learn to communicate effectively in various situations.",
        },
        {
            name: "Communication Skills (English)",
            description: "Improve your English speaking and writing skills.",
        },
        {
            name: "Mathematical and Problem Solving Skills",
            description: "Develop logical thinking and math skills.",
        },
        {
            name: "Life and Career Skills",
            description: "Gain skills for personal and professional growth.",
        },
        {
            name: "Understanding the Self and Society",
            description: "Explore identity, behavior, and social roles.",
        },
        {
            name: "Digital Citizenship",
            description: "Learn safe and responsible online behavior.",
        },
        {
            name: "Scientific and Critical Thinking Skills",
            description: "Enhance problem-solving and analytical thinking.",
        },
        {
            name: "Programming",
            description: "Dive into the latest technological advancements.",
        },
    ];

    console.log("Adding Categories...");

    for(const category of categories) {
        await categsPrisma.category.create({
            data: category,
        });
    }

    console.log("Categories Added Successfully!");
}

addCategories().catch((e) => {
    console.log("Error Adding Categories: ", e);
    })
    .finally(async () => {
        await categsPrisma.$disconnect();
    });