"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const form = event.currentTarget;
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });

    const result = await response.json();
    setSubmitting(false);
    setStatus(result.message);
    if (response.ok) form.reset();
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>Name<input name="name" required maxLength={80} /></label>
      <label>Email<input name="email" type="email" required maxLength={120} /></label>
      <label>Message<textarea name="message" required minLength={10} maxLength={2000} rows={5} /></label>
      <button className="button primary" disabled={submitting} type="submit">
        {submitting ? "Sending..." : "Send message"}
      </button>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
  );
}
