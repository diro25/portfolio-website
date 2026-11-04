import { prisma } from "@/lib/prisma";
import ProjectManager from "./project-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="admin-page">
      <div className="container">
        <p className="eyebrow">ADMIN INBOX</p>
        <h1>Contact messages</h1>
        <p className="section-intro">Messages submitted through your portfolio.</p>
        <div className="message-list">
          {messages.length === 0 ? <p>No messages yet.</p> : messages.map((message) => (
            <article className="message-card" key={message.id}>
              <div className="message-meta">
                <strong>{message.name}</strong>
                <a href={`mailto:${message.email}`}>{message.email}</a>
                <time dateTime={message.createdAt.toISOString()}>{message.createdAt.toLocaleString()}</time>
              </div>
              <p>{message.message}</p>
            </article>
          ))}
        </div>
        <ProjectManager />
      </div>
    </main>
  );
}
