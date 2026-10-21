# Karturah — Noir & Or edition

A new black-and-gold atelier direction, replacing the animated homepage with an editorial bottle hero, a Ms. Ceemee spotlight, and a fragrance library. Font sizes have been increased for readability on desktop and mobile.

## Collection

All 22 supplied scents are in `src/data/scent-preview.ts`: 13 body perfumes, two single perfumes and seven room fresheners. The library supports category filters, search by name/code/notes/feeling, expandable notes and email enquiries. These entries are explicitly coming soon, with no invented prices or product photographs. The existing brand bottle image is used only for the house hero. Existing database-managed product listings remain beneath the preview when published products exist. Preview copy can be edited in the data file independently of the live inventory.

## Admin

`convex/admin.ts` authorizes `simisolashitta@yahoo.com`. The same address is configured as the contact email. The owner must sign in or create an account with that exact address through the existing password authentication flow. This archive does not create an account, set a password or deploy backend changes. Deploy the Convex functions using your existing deployment process for the new authorization to take effect. The old ADMIN_EMAILS environment variable no longer controls access.

## Run and deploy

1. Install dependencies with `npm ci`.
2. Preserve your existing environment configuration; the supplied `.env.local` is retained in this private handoff archive.
3. Run locally with `npm run dev`.
4. Deploy backend and frontend through your existing Convex/Vercel process.

All application source, assets, lockfile and configuration are included. Generated dependencies, build caches, Git history, nested backup ZIPs and macOS metadata are excluded; recreate dependencies with `npm ci`.

## Validation

TypeScript check and Next.js production build passed. All 22 unique KF codes verified. Browser layout and interaction testing was unavailable because the environment blocked the local preview server. Production sign-in and database operations require your configured services and have not been tested against the live deployment.

## Refinement update

Removed decorative arrows from all link labels. The scent library now has an accessible show/hide control and individual expandable fragrance rows. Five entries appear initially; Load more reveals five additional matching scents at a time. Changing category or search resets the count to five. Enlarged fonts are retained. Refined spacing, subtle gold gradients, entrance motion, progressive scroll reveals where supported, hover effects and fragrance expansion animations respect reduced-motion preferences.

## Gold wave update

Removed the entire combined payment/made-to-order footer paragraph. Added real Three.js gold line ribbons along the viewport edges on the homepage and story page. Waves drift with time and scroll, use one lazy-loaded transparent canvas, ignore pointer events, cap pixel density and frame rate, pause in hidden tabs, and release GPU resources on unmount. Reduced-motion visitors and devices without WebGL retain a static gold glow. Browser appearance remains unverified in this environment.
