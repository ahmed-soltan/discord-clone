import { authMiddleware, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/(.*)"]);
const isPublicRoute = createRouteMatcher(['/api/uploadthing']); 

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)){
    if (isProtectedRoute(req)) auth().protect();
    
  }
});




export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
