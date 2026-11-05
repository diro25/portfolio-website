"use client";

import { useState } from "react";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessageManager({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);

  async function markRead(id: number, read: boolean) {
    const response = await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read })
    });
    if (response.ok) {
      setMessages((current) => current.map((message) => message.id === id ? { ...message, read } : message));
    }
  }

  async function deleteMessage(id: number) {
    if (!window.confirm("Delete this message permanently?")) return;
    const response = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (response.ok) setMessages((current) => current.filter((message) => message.id !== id));
  }

  return (
    <div className="message-list">
      {messages.length === 0 ? <p>No messages yet.</p> : messages.map((message) => (
        <article className={`message-card ${message.read ? "message-read" : "message-unread"}`} key={message.id}>
          <div className="message-meta">
            <strong>{message.name}</strong>
            <a href={`mailto:${message.email}`}>{message.email}</a>
            <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time>
          </div>
          <p>{message.message}</p>
          <div className="row-actions">
            <a className="text-button" href={`mailto:${message.email}?subject=Re: Portfolio message`}>Reply</a>
            <button className="text-button" onClick={() => void markRead(message.id, !message.read)}>
              {message.read ? "Mark unread" : "Mark read"}
            </button>
            <button className="text-button danger" onClick={() => void deleteMessage(message.id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
