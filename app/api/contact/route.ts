import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(2000)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide a valid name, email, and message." }, { status: 400 });
  }

  await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ message: "Thanks! Your message has been sent." }, { status: 201 });
}
