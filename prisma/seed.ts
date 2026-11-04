import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const projects: [string, string, string, string, string[]][] = [
  ["hospital-management-system", "Hospital Management System", "A Java Swing application for patient records, staff, and scheduling.", "A complete desktop workflow that organizes hospital operations and replaces error-prone manual record keeping.", ["Java", "Java Swing", "SQL"]],
  ["ethiopian-coffee-project", "Ethiopian Coffee Project", "A web platform celebrating Ethiopian coffee varieties and culture.", "A content-focused project designed to make Ethiopian coffee knowledge easier to discover and share.", ["HTML", "CSS", "JavaScript"]],
  ["to-do-app", "To-Do App", "A focused task management app for organizing daily work.", "A clean task workflow for creating, tracking, and completing daily responsibilities.", ["HTML", "CSS", "JavaScript"]],
  ["tic-tac-toe-game", "Tic-Tac-Toe Game", "An interactive browser game built to practice state and game logic.", "A small but complete game project focused on predictable state management and clear user feedback.", ["JavaScript", "CSS"]]
];

async function main() {
  for (const [slug, title, description, details, technologies] of projects) {
    await prisma.project.upsert({
      where: { slug },
      update: { title, description, details, technologies: JSON.stringify(technologies) },
      create: { slug, title, description, details, technologies: JSON.stringify(technologies), featured: true }
    });
  }
}

main().finally(() => prisma.$disconnect());
