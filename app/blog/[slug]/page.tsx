import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CommentForm from "@/app/components/comment-form";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { comments: { where: { approved: true }, orderBy: { createdAt: "desc" } } }
  });
  if (!post) notFound();

  return (
    <main className="detail-page">
      <article className="container article">
        <Link className="back-link" href="/blog">← All articles</Link>
        <span className="blog-category">{post.category}</span>
        <h1>{post.title}</h1>
        <p className="article-date">{post.createdAt.toLocaleDateString()}</p>
        <div className="article-content">{post.content}</div>
        <section className="comments">
          <h2>Comments ({post.comments.length})</h2>
          {post.comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <strong>{comment.name}</strong>
              <time>{comment.createdAt.toLocaleDateString()}</time>
              <p>{comment.content}</p>
            </div>
          ))}
          <CommentForm postId={post.id} />
        </section>
      </article>
    </main>
  );
}
