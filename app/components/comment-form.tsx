"use client";

import { FormEvent, useState } from "react";

export default function CommentForm({ postId }: { postId: number }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = event.currentTarget;
    const response = await fetch(`/api/blog/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const result = await response.json();
    setStatus(result.message);
    setBusy(false);
    if (response.ok) form.reset();
  }

  return (
    <form className="comment-form" onSubmit={submit}>
      <h3>Leave a comment</h3>
      <input name="name" placeholder="Your name" required maxLength={80} />
      <input name="email" type="email" placeholder="Your email" required maxLength={120} />
      <textarea name="content" placeholder="Your comment" required minLength={3} maxLength={1000} rows={4} />
      <button className="button primary" disabled={busy}>{busy ? "Sending..." : "Submit for review"}</button>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}
