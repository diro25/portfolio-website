import { prisma } from "@/lib/prisma";
import ProjectManager from "./project-manager";
import BlogManager from "./blog-manager";
import AnalyticsPanel from "./analytics-panel";
import MessageManager from "./message-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="admin-page">
      <div className="container">
        <p className="eyebrow">ADMIN INBOX</p>
        <h1>Contact messages</h1>
        <p className="section-intro">Messages submitted through your portfolio.</p>
        <MessageManager initialMessages={messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString() }))} />
        <ProjectManager />
        <BlogManager />
        <AnalyticsPanel />
      </div>
    </main>
  );
}
