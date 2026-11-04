import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  content: z.string().trim().min(3).max(1000)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const postId = Number(id);
  const parsed = commentSchema.safeParse(await request.json());
  if (!Number.isInteger(postId) || !parsed.success) {
    return NextResponse.json({ message: "Please provide valid comment details." }, { status: 400 });
  }
  const post = await prisma.blogPost.findFirst({ where: { id: postId, published: true } });
  if (!post) return NextResponse.json({ message: "Article not found." }, { status: 404 });
  await prisma.comment.create({ data: { ...parsed.data, postId } });
  return NextResponse.json({ message: "Thanks! Your comment is awaiting approval." }, { status: 201 });
}
