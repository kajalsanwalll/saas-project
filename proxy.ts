import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/signup",
  "/signin",
  "/",
  "/home"
])

const isPublicApiRoute = createRouteMatcher([
  "/api/videos"
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url)

  const isAccessingDashboard = currentUrl.pathname === "/home"
  const isApiRequest = currentUrl.pathname.startsWith("/api")

  if(userId && isPublicRoute(req) && !isAccessingDashboard){

    return NextResponse.redirect(new URL("/home", req.url))
  }

  // if not logged in
  if(!userId){

    //user not logged in and trying to access a protected route
    if(!isPublicRoute(req) && !isPublicApiRoute(req)){
      return NextResponse.redirect(new URL("/signin", req.url))
    }
    
    //if request is for a protected api and user is not logged in 
    if(isApiRequest && !isPublicApiRoute(req)){
      return NextResponse.redirect(new URL("/signin", req.url))
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