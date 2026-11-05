import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const postSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(140),
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().trim().min(20).max(20000),
  category: z.string().trim().min(2).max(50),
  published: z.boolean()
});

async function getId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const id = await getId(context);
  const parsed = postSchema.safeParse(await request.json());
  if (!id || !parsed.success) return NextResponse.json({ message: "Invalid post data." }, { status: 400 });
  try {
    const post = await prisma.blogPost.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ message: "Could not update this post. Check that the slug is unique." }, { status: 409 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const id = await getId(context);
  if (!id) return NextResponse.json({ message: "Invalid post id." }, { status: 400 });
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
