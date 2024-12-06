// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher(["/login(.*)", "/"]);

const VALID_MONSTER_IDS = [0, 1, 2, 3, 4, 5, 6]; // Keep it simple for middleware

// function isValidMonsterId(id: string) {
//   const numId = parseInt(id);
//   return !isNaN(numId) && VALID_MONSTER_IDS.includes(numId);
// }

// export default clerkMiddleware(async (auth, request) => {
//   const path = request.nextUrl.pathname;
//   if (path.startsWith("/fight/")) {
//     const monsterId = path.split("/").pop();
//     if (!monsterId || !isValidMonsterId(monsterId)) {
//       return NextResponse.redirect(new URL("/404", request.url));
//     }
//   }
//   if (!isPublicRoute(request)) {
//     try {
//       await auth.protect();
//     } catch (error) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Add fight routes to matcher
//     "/fight/:path*",
//     // Skip Next.js internals and all static files
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { api } from "../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function isPublicRoute(request: Request) {
  const path = request.url;
  return path === "/login";
}

function isValidMonsterId(id: string) {
  const numId = parseInt(id);
  return !isNaN(numId) && VALID_MONSTER_IDS.includes(numId);
}

export default clerkMiddleware(async (auth, request) => {
  const path = request.nextUrl.pathname;
  const user = await auth();
  const userID = user.userId;
  if (!userID) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check for valid monster ID in fight routes
  if (path.startsWith("/fight/")) {
    const monsterId = path.split("/").pop();
    if (!monsterId || !isValidMonsterId(monsterId)) {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    const player = await convex.query(api.players.getPlayer);

    if (player && player.currentMonster < parseInt(monsterId)) {
      return NextResponse.redirect(new URL("/fight", request.url));
    }
  }

  // Allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect non-public routes
  try {
    await auth.protect();

    // After authentication, check fight status
    const fightStatus = await convex.query(api.players.getPlayerFightStatus, {
      userId: userID,
    });

    // If player has active fight and isn't on fight page, redirect
    if (
      fightStatus &&
      typeof fightStatus === "object" &&
      !path.startsWith("/fight/")
    ) {
      return NextResponse.redirect(
        new URL(`/fight/${fightStatus.monsterId}`, request.url)
      );
    }

    if (fightStatus === "idle") {
      // If player is idle and isn't on login page, redirect
      if (path.startsWith("/fight/")) {
        return NextResponse.redirect(new URL("/fight", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
