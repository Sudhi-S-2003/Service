import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    // Backend routes
    if (pathname.startsWith("/api/service")) {
      return serviceMiddlewareFunction(request);
    } else if (pathname.includes("provider")) {
      return providerMiddlewareFunction(request);
    } else {
      return otherMiddlewareFunction(request);
    }
  } else {
    // Frontend routes
    if (pathname === "/auth/register" || pathname === "/auth/login") {
      // No middleware for these routes
      return NextResponse.next();
    }

    if (pathname.includes("provider")) {
      return serviceMiddlewareFunction(request);
    } else {
      return otherMiddlewareFunction(request);
    }
  }

  // Common middleware logic (if needed)
  return commonMiddleware(request);
}

// Middleware function implementations
function serviceMiddlewareFunction(request) {
  console.log("Service-specific middleware triggered");
  // Example logic
  return NextResponse.next();
}

function providerMiddlewareFunction(request) {
  console.log("Provider-specific middleware triggered");
  // Example logic
  return NextResponse.next();
}

function otherMiddlewareFunction(request) {
  console.log("Other middleware triggered");
  // Example logic
  return NextResponse.next();
}

function commonMiddleware(request) {
  console.log("Common middleware triggered");
  // Example logic
  return NextResponse.next();
}
export const config = {
  matcher: ['/api/:path*', '/auth/:path*', '/:path*'], // Match specific patterns
};
