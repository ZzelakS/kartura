/**
 * One place that knows whether Convex has been provisioned.
 *
 * next.config.mjs supplies the placeholder when the real URL is absent, so this
 * value is always a string and the app never throws on a missing variable.
 */
export const PLACEHOLDER_CONVEX_URL = "https://unset.convex.cloud";

export const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? PLACEHOLDER_CONVEX_URL;

export const isConvexConfigured = CONVEX_URL !== PLACEHOLDER_CONVEX_URL;
