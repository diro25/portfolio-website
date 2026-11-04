import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const eventSchema = z.object({
  path: z.string().regex(/^\/[a-zA-Z0-9/_?=&.-]*$/).max(300)
});

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: "Invalid analytics event." }, { status: 400 });
  await prisma.analyticsEvent.create({ data: { path: parsed.data.path } });
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function GET() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [totalViews, viewsToday, viewsThisMonth, groupedPages, recentViews] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.analyticsEvent.groupBy({ by: ["path"], _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 10 }),
    prisma.analyticsEvent.findMany({ orderBy: { createdAt: "desc" }, take: 15, select: { path: true, createdAt: true } })
  ]);
  return NextResponse.json({
    totalViews,
    viewsToday,
    viewsThisMonth,
    topPages: groupedPages.map((page) => ({ path: page.path, views: page._count.path })),
    recentViews
  });
}
