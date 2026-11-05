"use client";

import { FormEvent, useEffect, useState } from "react";

type Post = { id: number; slug: string; title: string; excerpt: string; content: string; category: string; published: boolean };
type Comment = { id: number; name: string; email: string; content: string; approved: boolean; post: { title: string } };
const emptyPost = { slug: "", title: "", excerpt: "", content: "", category: "Engineering", published: false };

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(emptyPost);
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    const [postsResponse, commentsResponse] = await Promise.all([
      fetch("/api/blog"),
      fetch("/api/blog/comments")
    ]);
    setPosts((await postsResponse.json()).posts);
    setComments((await commentsResponse.json()).comments);
  }
  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(editingId ? `/api/blog/${editingId}` : "/api/blog", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const result = await response.json();
    setStatus(result.message ?? (editingId ? "Post updated." : "Post created."));
    if (response.ok) {
      setForm(emptyPost);
      setEditingId(null);
      await load();
    }
  }

  function editPost(post: Post) {
    setEditingId(post.id);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      published: post.published
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deletePost(id: number) {
    if (!window.confirm("Delete this post permanently?")) return;
    const response = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (response.ok) {
      setStatus("Post deleted.");
      await load();
    }
  }

  async function setCommentApproval(id: number, approved: boolean) {
    await fetch("/api/blog/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved })
    });
    await load();
  }

  async function deleteComment(id: number) {
    if (!window.confirm("Delete this comment?")) return;
    await fetch(`/api/blog/comments?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <section className="admin-projects">
      <p className="eyebrow">BLOG MANAGEMENT</p>
      <div className="admin-section-heading">
        <h2>{editingId ? "Edit post" : "Create a post"}</h2>
        {editingId && <button className="text-button" type="button" onClick={() => { setEditingId(null); setForm(emptyPost); }}>Cancel editing</button>}
      </div>
      <form className="project-form" onSubmit={submit}>
        <div className="form-two-column">
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></label>
        </div>
        <label>Category<input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
        <label>Excerpt<input required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></label>
        <label>Content<textarea required rows={7} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></label>
        <label className="checkbox-row"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish now</label>
        <button className="button primary">{editingId ? "Update post" : "Create post"}</button>
        {status && <p className="form-status">{status}</p>}
      </form>
      <div className="admin-list">
        <h2>Posts</h2>
        {posts.map((post) => <article className="admin-project-row" key={post.id}>
          <div><strong>{post.title}</strong><p>{post.category}</p></div>
          <span className={post.published ? "status-published" : "status-draft"}>{post.published ? "Published" : "Draft"}</span>
          <div className="row-actions">
            <button className="text-button" onClick={() => editPost(post)}>Edit</button>
            <button className="text-button danger" onClick={() => void deletePost(post.id)}>Delete</button>
          </div>
        </article>)}
      </div>
      <div className="admin-list">
        <h2>Comment moderation</h2>
        {comments.length === 0 ? <p>No comments yet.</p> : comments.map((comment) => (
          <article className="admin-project-row" key={comment.id}>
            <div><strong>{comment.name}</strong><p>{comment.content}</p><small>{comment.post.title}</small></div>
            <span className={comment.approved ? "status-published" : "status-draft"}>{comment.approved ? "Approved" : "Pending"}</span>
            <div className="row-actions">
              <button className="text-button" onClick={() => void setCommentApproval(comment.id, !comment.approved)}>{comment.approved ? "Hide" : "Approve"}</button>
              <button className="text-button danger" onClick={() => void deleteComment(comment.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
