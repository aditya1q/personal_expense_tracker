import { NextResponse } from "next/server";

const publicPaths = ["/login", "/register"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // Allow public paths without authentication
  if (publicPaths.includes(pathname)) {
    if (accessToken) {
      // If already authenticated, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // For protected paths, check authentication
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};