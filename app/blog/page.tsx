import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="detail-page">
      <div className="container">
        <Link className="back-link" href="/">← Back home</Link>
        <p className="eyebrow">THE BLOG</p>
        <h1>Notes on building software.</h1>
        <p className="detail-lead">Lessons from full-stack development, problem solving, and continuous learning.</p>
        <div className="blog-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.id}>
              <span className="blog-category">{post.category}</span>
              <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
              <Link className="project-actions" href={`/blog/${post.slug}`}>Read article →</Link>
            </article>
          ))}
          {posts.length === 0 && <p className="empty-state">No published posts yet.</p>}
        </div>
      </div>
    </main>
  );
}
