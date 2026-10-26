/**
 * `NEXT_PUBLIC_CONVEX_URL` is written to .env.local by `npx convex dev`. Before
 * that has run the variable does not exist, and Convex Auth's server provider
 * throws while rendering the root layout rather than degrading.
 *
 * Defaulting it here means a fresh clone boots. Requests to the placeholder host
 * fail, the storefront falls back on its seed catalogue, and the dashboard says
 * plainly that Convex is not set up yet. Once `npx convex dev` writes the real
 * value, that wins.
 */
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://unset.convex.cloud";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CONVEX_URL: CONVEX_URL,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io" }],
  },
};

export default nextConfig;
