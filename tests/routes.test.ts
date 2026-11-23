import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearRateLimits } from "@/lib/rateLimit";

const prisma = vi.hoisted(() => ({
  contactMessage: {
    create: vi.fn(),
  },
  blogPost: {
    findFirst: vi.fn(),
  },
  comment: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma }));

import { POST as submitContact } from "@/app/api/contact/route";
import { POST as submitComment } from "@/app/api/blog/[id]/comments/route";

function request(path: string, body: unknown, ip = "203.0.113.10") {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("public form routes", () => {
  beforeEach(() => {
    clearRateLimits();
    vi.clearAllMocks();
  });

  it("submits a valid contact message through Prisma", async () => {
    prisma.contactMessage.create.mockResolvedValue({ id: 1 });

    const response = await submitContact(request("/api/contact", {
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would like to discuss an engineering role.",
    }));

    expect(response.status).toBe(201);
    expect(prisma.contactMessage.create).toHaveBeenCalledWith({
      data: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "I would like to discuss an engineering role.",
      },
    });
  });

  it("rejects invalid contact submissions before querying Prisma", async () => {
    const response = await submitContact(request("/api/contact", {
      name: "A",
      email: "not-email",
      message: "short",
    }));

    expect(response.status).toBe(400);
    expect(prisma.contactMessage.create).not.toHaveBeenCalled();
  });

  it("creates a comment only for a published blog post", async () => {
    prisma.blogPost.findFirst.mockResolvedValue({ id: 7, published: true });
    prisma.comment.create.mockResolvedValue({ id: 12 });

    const response = await submitComment(
      request("/api/blog/7/comments", {
        name: "Grace Hopper",
        email: "grace@example.com",
        content: "A useful and practical article.",
      }),
      { params: Promise.resolve({ id: "7" }) }
    );

    expect(response.status).toBe(201);
    expect(prisma.blogPost.findFirst).toHaveBeenCalledWith({
      where: { id: 7, published: true },
    });
    expect(prisma.comment.create).toHaveBeenCalledWith({
      data: {
        name: "Grace Hopper",
        email: "grace@example.com",
        content: "A useful and practical article.",
        postId: 7,
      },
    });
  });

  it("returns not found when a comment targets an unpublished post", async () => {
    prisma.blogPost.findFirst.mockResolvedValue(null);

    const response = await submitComment(
      request("/api/blog/99/comments", {
        name: "Grace Hopper",
        email: "grace@example.com",
        content: "This comment should not be stored.",
      }, "203.0.113.11"),
      { params: Promise.resolve({ id: "99" }) }
    );

    expect(response.status).toBe(404);
    expect(prisma.comment.create).not.toHaveBeenCalled();
  });

  it("rate limits repeated contact submissions", async () => {
    prisma.contactMessage.create.mockResolvedValue({ id: 1 });
    const body = {
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would like to discuss an engineering role.",
    };

    let response: Response = new Response();
    for (let attempt = 0; attempt < 6; attempt += 1) {
      response = await submitContact(request("/api/contact", body, "203.0.113.20"));
    }

    expect(response.status).toBe(429);
  });
});
