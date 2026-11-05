import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true } } }
  });
  return NextResponse.json({ comments });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const id = Number(body.id);
  if (!Number.isInteger(id) || typeof body.approved !== "boolean") {
    return NextResponse.json({ message: "Invalid comment update." }, { status: 400 });
  }
  const comment = await prisma.comment.update({ where: { id }, data: { approved: body.approved } });
  return NextResponse.json({ comment });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ message: "Invalid comment id." }, { status: 400 });
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
