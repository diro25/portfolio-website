"use client";

import { FormEvent, useEffect, useState } from "react";

type Post = { id: number; slug: string; title: string; excerpt: string; content: string; category: string; published: boolean };
const emptyPost = { slug: "", title: "", excerpt: "", content: "", category: "Engineering", published: false };

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(emptyPost);
  const [status, setStatus] = useState("");

  async function load() {
    const response = await fetch("/api/blog");
    setPosts((await response.json()).posts);
  }
  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const result = await response.json();
    setStatus(result.message ?? "Post created.");
    if (response.ok) {
      setForm(emptyPost);
      await load();
    }
  }

  return (
    <section className="admin-projects">
      <p className="eyebrow">BLOG MANAGEMENT</p>
      <h2>Create a post</h2>
      <form className="project-form" onSubmit={submit}>
        <div className="form-two-column">
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></label>
        </div>
        <label>Category<input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
        <label>Excerpt<input required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></label>
        <label>Content<textarea required rows={7} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></label>
        <label className="checkbox-row"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish now</label>
        <button className="button primary">Create post</button>
        {status && <p className="form-status">{status}</p>}
      </form>
      <div className="admin-list">
        <h2>Posts</h2>
        {posts.map((post) => <article className="admin-project-row" key={post.id}><strong>{post.title}</strong><span className={post.published ? "status-published" : "status-draft"}>{post.published ? "Published" : "Draft"}</span><span>{post.category}</span></article>)}
      </div>
    </section>
  );
}
