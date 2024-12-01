import { NextResponse } from "next/server";
import authMiddleware from "@/middleware/authMiddleware";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    // Only protect specific backend routes
    if (pathname.startsWith("/api/Platform_service/auth/service")) {
      return await authMiddleware(request);
    }
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/Platform_service/auth/service/:path*"], // Match API routes
};
