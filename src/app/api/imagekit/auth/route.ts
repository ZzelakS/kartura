import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { adminMe } from "@/lib/convex-functions";

export const runtime = "nodejs";

/**
 * Signs an ImageKit client-side upload.
 *
 * This runs on the same origin as the dashboard, so there is no CORS header to
 * configure and no SITE_URL to keep in sync. The private key never leaves the
 * server, and only an address on ADMIN_EMAILS can get a signature.
 */
export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json({ error: "IMAGEKIT_PRIVATE_KEY is not set." }, { status: 500 });
  }

  let me: { isAdmin: boolean } | null = null;
  try {
    const token = await convexAuthNextjsToken();
    me = await fetchQuery(adminMe, {}, { token });
  } catch {
    me = null;
  }

  if (!me?.isAdmin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const token = randomUUID();
  // ImageKit rejects anything more than an hour out. Thirty minutes is plenty
  // for a slow upload on studio wifi.
  const expire = Math.floor(Date.now() / 1000) + 1800;
  const signature = createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return NextResponse.json(
    { token, expire, signature },
    { headers: { "Cache-Control": "no-store" } },
  );
}
