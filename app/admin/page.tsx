import { prisma } from "@/lib/prisma";
import ProjectManager from "./project-manager";
import BlogManager from "./blog-manager";
import AnalyticsPanel from "./analytics-panel";
import MessageManager from "./message-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [messages, unreadMessages, projectCount, publishedPosts, pendingComments, totalViews] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.project.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.comment.count({ where: { approved: false } }),
    prisma.analyticsEvent.count()
  ]);

  return (
    <main className="admin-page">
      <div className="container">
        <p className="eyebrow">ADMIN INBOX</p>
        <h1>Dashboard</h1>
        <p className="section-intro">Manage your portfolio content and keep track of visitors.</p>
        <section className="dashboard-stats" aria-label="Portfolio summary">
          <div className="dashboard-stat"><strong>{unreadMessages}</strong><span>Unread messages</span></div>
          <div className="dashboard-stat"><strong>{projectCount}</strong><span>Projects</span></div>
          <div className="dashboard-stat"><strong>{publishedPosts}</strong><span>Published posts</span></div>
          <div className="dashboard-stat"><strong>{pendingComments}</strong><span>Pending comments</span></div>
          <div className="dashboard-stat"><strong>{totalViews}</strong><span>Total views</span></div>
        </section>
        <h2 className="admin-subheading">Contact messages</h2>
        <p className="section-intro">Messages submitted through your portfolio.</p>
        <MessageManager initialMessages={messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString() }))} />
        <ProjectManager />
        <BlogManager />
        <AnalyticsPanel />
      </div>
    </main>
  );
}
