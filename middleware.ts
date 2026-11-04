import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  if (authorization?.startsWith("Basic ")) {
    const encodedCredentials = authorization.slice("Basic ".length);
    const credentials = atob(encodedCredentials);
    const password = credentials.slice(credentials.indexOf(":") + 1);

    if (password === expectedPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Portfolio Admin"' }
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*", "/api/blog"]
};
