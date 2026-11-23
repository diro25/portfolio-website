import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { clearRateLimits } from "@/lib/rateLimit";
import { proxy as middleware, timingSafePasswordMatch } from "@/proxy";

describe("admin middleware", () => {
  beforeEach(() => {
    clearRateLimits();
    process.env.ADMIN_PASSWORD = "correct horse battery staple";
  });

  it("allows requests with the matching Basic password", () => {
    const credentials = Buffer.from("admin:correct horse battery staple").toString("base64");
    const request = new NextRequest("http://localhost/admin", {
      headers: {
        authorization: `Basic ${credentials}`,
        "x-forwarded-for": "203.0.113.30",
      },
    });

    expect(middleware(request).status).toBe(200);
  });

  it("rejects missing or incorrect credentials", () => {
    const missing = new NextRequest("http://localhost/admin", {
      headers: { "x-forwarded-for": "203.0.113.31" },
    });
    expect(middleware(missing).status).toBe(401);

    const wrongCredentials = Buffer.from("admin:not-the-password").toString("base64");
    const wrong = new NextRequest("http://localhost/admin", {
      headers: {
        authorization: `Basic ${wrongCredentials}`,
        "x-forwarded-for": "203.0.113.32",
      },
    });
    expect(middleware(wrong).status).toBe(401);
  });

  it("allows public comment POSTs and protects another blog API route", () => {
    const publicComment = new NextRequest("http://localhost/api/blog/1/comments", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.33" },
    });
    expect(middleware(publicComment).status).toBe(200);

    const protectedBlog = new NextRequest("http://localhost/api/blog/1", {
      method: "PATCH",
      headers: { "x-forwarded-for": "203.0.113.34" },
    });
    expect(middleware(protectedBlog).status).toBe(401);
  });

  it("rate limits repeated admin login attempts", () => {
    const credentials = Buffer.from("admin:wrong").toString("base64");
    let response = new Response();
    for (let attempt = 0; attempt < 6; attempt += 1) {
      response = middleware(new NextRequest("http://localhost/admin", {
        headers: {
          authorization: `Basic ${credentials}`,
          "x-forwarded-for": "203.0.113.35",
        },
      }));
    }
    expect(response.status).toBe(429);
  });

  it("compares passwords without JavaScript string equality", () => {
    expect(timingSafePasswordMatch("expected", "expected")).toBe(true);
    expect(timingSafePasswordMatch("expected", "not-exact")).toBe(false);
  });
});
