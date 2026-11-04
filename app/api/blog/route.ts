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

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const parsed = postSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: "Please complete all post fields correctly." }, { status: 400 });
  try {
    const post = await prisma.blogPost.create({ data: parsed.data });
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "A post with that slug already exists." }, { status: 409 });
  }
}
