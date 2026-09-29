import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { isConvexConfigured } from "@/lib/convex-url";

const isLoginPage = createRouteMatcher(["/admin/login"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // With no deployment there is nothing to authenticate against. Let /admin
  // render its own setup notice rather than bouncing to a login that cannot
  // work, and keep the storefront untouched.
  if (!isConvexConfigured) return;

  const signedIn = await convexAuth.isAuthenticated();

  if (!isLoginPage(request) && !signedIn) {
    return nextjsMiddlewareRedirect(request, "/admin/login");
  }
  if (isLoginPage(request) && signedIn) {
    return nextjsMiddlewareRedirect(request, "/admin");
  }
});

// Only the dashboard needs this. The previous catch-all matcher ran the auth
// check on every storefront request for no reason.
// The dashboard, plus /api/auth: sign in and sign out are proxied to Convex by
// this middleware, so excluding that path makes the route 404. The storefront is
// deliberately left out, since running the auth check there is pointless work.
export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/auth"],
};
