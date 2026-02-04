import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/sign-up",
  "/sign-in",
  "/",
  "/home"
])

const isPublicApiRoute = createRouteMatcher([
  "/api/videos"
])

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url)

  // ✅ Do NOT redirect API routes — let them handle auth themselves
   if (currentUrl.pathname.startsWith("/api")) {
     return NextResponse.next();
    }

  const isAccessingDashboard = currentUrl.pathname === "/home"
  

  if(userId && isPublicRoute(req) && !isAccessingDashboard){

    return NextResponse.redirect(new URL("/home", req.url))
  }

  // if not logged in
  if(!userId){

    //user not logged in and trying to access a protected route
    if(!isPublicRoute(req) && !isPublicApiRoute(req)){
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
    
    
  }
  return NextResponse.next(); 

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};