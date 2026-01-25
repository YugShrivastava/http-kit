import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/api-dashboard(.*)",
  "/request-bin(.*)",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, userId } = await auth();

  if (isAuthenticated) {
    const exists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!exists) {
      await prisma.user.create({
        data: {
          id: userId,
        },
      });
    }
  }

  if (isProtectedRoute(req)) await auth.protect();
  
  if (!isApiRoute(req)) {
    console.log("here")
    return NextResponse.next()
  };

  const headers = req.headers;
  const authHeader = headers.get("Authorization");

  if (!authHeader)
    return new NextResponse(JSON.stringify({ error: "token not found" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });

  const token = authHeader.split("Bearer ")[1]?.trim();

  if (!token)
    return new NextResponse(JSON.stringify({ error: "token not found" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });

  const user = await prisma.user.findUnique({
    where: { token },
  });

  if (!user)
    return new NextResponse(JSON.stringify({ error: "invalid token" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });

  NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
