import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";

export function timingSafePasswordMatch(password: string, expectedPassword: string): boolean {
  const supplied = Buffer.from(password);
  const expected = Buffer.from(expectedPassword);
  if (supplied.length !== expected.length) return false;
  return timingSafeEqual(supplied, expected);
}

function parseBasicPassword(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return null;
  try {
    const credentials = atob(authorization.slice("Basic ".length).trim());
    const separator = credentials.indexOf(":");
    return separator >= 0 ? credentials.slice(separator + 1) : null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const isPublicEvent =
    (request.nextUrl.pathname === "/api/analytics" && request.method === "POST") ||
    (request.nextUrl.pathname.endsWith("/comments") && request.method === "POST");

  if (isPublicEvent) {
    return NextResponse.next();
  }
  const authorization = request.headers.get("authorization");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  if (isRateLimited("admin-login", request, 5, 15 * 60 * 1000)) {
    return new NextResponse("Too many login attempts. Try again later.", {
      status: 429,
      headers: {
        "Retry-After": "900",
        "WWW-Authenticate": 'Basic realm="Portfolio Admin"',
      },
    });
  }

  const password = parseBasicPassword(request);
  if (password !== null && timingSafePasswordMatch(password, expectedPassword)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Portfolio Admin"' }
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*", "/api/blog/:path*", "/api/analytics"]
};
