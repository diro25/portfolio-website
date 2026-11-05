import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({ read: z.boolean() });

async function getId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const id = await getId(context);
  const parsed = updateSchema.safeParse(await request.json());
  if (!id || !parsed.success) return NextResponse.json({ message: "Invalid message update." }, { status: 400 });
  const message = await prisma.contactMessage.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ message });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const id = await getId(context);
  if (!id) return NextResponse.json({ message: "Invalid message id." }, { status: 400 });
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
