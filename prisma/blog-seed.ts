import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.blogPost.upsert({
    where: { slug: "building-this-portfolio" },
    update: {},
    create: {
      slug: "building-this-portfolio",
      title: "Building a portfolio that does more than look good",
      excerpt: "Why a portfolio should demonstrate real engineering, not just list technologies.",
      category: "Engineering",
      content: "A strong portfolio is a small product. It should show how you think, how you design interfaces, how you handle data, and how you create a useful experience for visitors. That is why this portfolio is growing from a static page into a full-stack application.",
      published: true
    }
  });
}

main().finally(() => prisma.$disconnect());
