import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const isPublicRoute = createRouteMatcher(["/", "/login"]);

export default clerkMiddleware(async (auth, request) => {
  // First, check if it's a public route
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // For non-public routes, get the user
  const user = await auth();
  const userId = user?.userId;
  // If no user, redirect to login
  if (!user || !userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const fightStatus = await convex.query(api.players.getPlayerFightStatus, {
      userId: userId ?? "",
    });

    if (request.nextUrl.pathname.startsWith("/brothel")) {
      const coolDownUntil = await convex.query(
        api.players.getPlayerBrothelCooldown,
        {
          userId: userId,
        }
      );

      if (Date.now() < coolDownUntil) {
        return NextResponse.redirect(new URL(`/main`, request.url));
      }
    }

    if (request.nextUrl.pathname.startsWith("/brothel")) {
      const brothelStatus = await convex.query(api.players.getBrothelStatus, {
        userId,
      });
      if (request.nextUrl.pathname === "/brothel/serve") {
        if (brothelStatus === "idle") {
          return NextResponse.redirect(new URL(`/brothel`, request.url));
        }
      } else {
        if (brothelStatus !== "idle") {
          return NextResponse.redirect(new URL(`/brothel/serve`, request.url));
        }
      }
    }

    if (fightStatus === "idle") {
      if (
        request.nextUrl.pathname !== "/" &&
        request.nextUrl.pathname.startsWith("/fight")
      ) {
        return NextResponse.redirect(new URL("/choose-monster", request.url));
      }
    }

    if (
      typeof fightStatus === "object" &&
      "monsterId" in fightStatus! &&
      fightStatus.monsterId !== null
    ) {
      if (
        request.nextUrl.pathname !== "/" &&
        !request.nextUrl.pathname.startsWith("/fight")
      ) {
        if (!request.nextUrl.pathname.startsWith("/fight")) {
          return NextResponse.redirect(new URL(`/fight`, request.url));
        }
      }
    }
  } catch (error) {
    console.error("Error querying fightStatus:", error); // Check for errors
  }

  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
