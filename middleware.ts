import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserSession } from "@/lib/auth/session";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Define protected routes
  const privateRoutes = ["/admin"];

  // Extract request information
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // Get user session
  const { user } = await getUserSession();

  // Redirect unauthenticated users attempting to access private pages to the sign-in page
  if (!user && privateRoutes.includes(path)) {
    const signInUrl = new URL("/signin", nextUrl);
    signInUrl.searchParams.set("next", path);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users attempting to access the sign-in page to the home page
  if (user && path === "/signin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
