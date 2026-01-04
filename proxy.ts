import { neonAuthMiddleware } from "@neondatabase/auth/next/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Create the Neon Auth middleware
const authMiddleware = neonAuthMiddleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: "/auth/sign-in",
});

// Wrap it with custom logic to allow public routes
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/auth/sign-in", "/auth/sign-up", "/auth/sign-out"];
  const isPublicRoute = pathname === "/" || pathname.startsWith("/auth/");
  
  // Allow public routes to pass through without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // For all other routes, apply Neon Auth middleware
  return authMiddleware(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Neon Auth API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

