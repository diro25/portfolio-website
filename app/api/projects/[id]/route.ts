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

async function getId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const projectId = Number(id);
  return Number.isInteger(projectId) && projectId > 0 ? projectId : null;
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const id = await getId(context);
  const parsed = projectSchema.safeParse(await request.json());
  if (!id || !parsed.success) return NextResponse.json({ message: "Invalid project data." }, { status: 400 });
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { ...parsed.data, technologies: JSON.stringify(parsed.data.technologies), githubUrl: parsed.data.githubUrl || null, demoUrl: parsed.data.demoUrl || null }
    });
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ message: "Could not update this project. Check that the slug is unique." }, { status: 409 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const id = await getId(context);
  if (!id) return NextResponse.json({ message: "Invalid project id." }, { status: 400 });
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
