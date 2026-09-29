import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

/**
 * Email and password only. Anyone can create an account here; that grants
 * nothing on its own. Dashboard access is a separate check against the
 * ADMIN_EMAILS environment variable, in admin.ts.
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
