import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(300),
  details: z.string().trim().min(10).max(5000),
  technologies: z.array(z.string().trim().min(1)).min(1).max(12),
  githubUrl: z.string().url().or(z.literal("")),
  demoUrl: z.string().url().or(z.literal("")),
  featured: z.boolean(),
  published: z.boolean()
});

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json({
    projects: projects.map((project) => ({
      ...project,
      technologies: JSON.parse(project.technologies)
    }))
  });
}

export async function POST(request: Request) {
  const parsed = projectSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: "Please complete all project fields correctly." }, { status: 400 });
  try {
    const project = await prisma.project.create({
      data: { ...parsed.data, technologies: JSON.stringify(parsed.data.technologies), githubUrl: parsed.data.githubUrl || null, demoUrl: parsed.data.demoUrl || null }
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "A project with that slug may already exist." }, { status: 409 });
  }
}
