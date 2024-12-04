import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/login(.*)", "/"]);

const VALID_MONSTER_IDS = [0, 1, 2, 3, 4, 5, 6]; // Keep it simple for middleware

function isValidMonsterId(id: string) {
  const numId = parseInt(id);
  return !isNaN(numId) && VALID_MONSTER_IDS.includes(numId);
}

export default clerkMiddleware(async (auth, request) => {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/fight/")) {
    const monsterId = path.split("/").pop();
    if (!monsterId || !isValidMonsterId(monsterId)) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }
  if (!isPublicRoute(request)) {
    try {
      await auth.protect();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Add fight routes to matcher
    "/fight/:path*",
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
