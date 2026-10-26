# Kartura

A fragrance and leather house in Baltimore, Maryland. Next.js App Router, TypeScript, Tailwind,
Three.js, Convex.

## Running it

```bash
npm install
npx convex dev             # creates convex/_generated and fills .env.local
npx @convex-dev/auth       # writes JWT_PRIVATE_KEY and JWKS to the deployment
npx convex run seed:run    # loads the three fragrances and three bags
npm run dev
```

Then open the Convex dashboard, Settings, Environment Variables, and add:

| Variable | Value |
| --- | --- |
| `ADMIN_EMAILS` | your email, comma separated for more people |

`IMAGEKIT_PRIVATE_KEY` does **not** go on Convex. It is read by the Next route handler that signs
uploads, so it belongs in `.env.local` locally and in the host's environment variables in
production.

Copy `.env.example` to `.env.local` and fill in the ImageKit keys and the WhatsApp number.

The app boots before any of that is done. `next.config.mjs` defaults `NEXT_PUBLIC_CONVEX_URL` to a
placeholder host, because Convex Auth's server provider throws on a missing variable while rendering
the root layout. With the placeholder in place the shop renders its seed catalogue and `/admin` says
what still needs running. The real value from `.env.local` overrides it.

The app builds and runs before Convex is provisioned. Nothing imports `convex/_generated`, which
only appears after `npx convex dev` has run once. Instead `src/lib/convex-functions.ts` resolves
functions by name with `makeFunctionReference`, so a fresh clone compiles. If you rename a Convex
export, rename the string in that file to match.

Until a deployment exists, the newsletter shows an error and checkout falls back to sending the
basket over WhatsApp.

## The hero

`src/components/hero/` holds the one moment of motion on the page. A 30,000 point cloud morphs
between three silhouettes as you scroll: a flacon, a purse, then a rising plume of sillage that
dissolves into the fragrance section.

- `shapes.ts` builds the lathe and extrude geometry for the bottle and the purse, and generates the
  plume directly since dispersal has no surface to sample.
- `sampling.ts` scatters points across those surfaces weighted by triangle area, then normalises each
  shape so all three read at the same visual weight.
- `shaders.ts` does the morph in the vertex shader. Each particle starts its transition slightly late
  based on a per-particle random, so the shape flows rather than snapping, and turbulence peaks
  mid-transition then settles.
- `useMorphScene.ts` maps scroll position onto the two mix uniforms with a damped follow, so a jumpy
  trackpad still reads as smooth. It also cross-fades the three text panels and disposes everything
  on unmount.

Point count drops to 13,000 under 720px wide. `prefers-reduced-motion` turns off idle drift, the
camera parallax, and the pointer tracking; the scroll morph stays, since that one answers a user
action.

## Catalog

One `products` table with a `category` discriminator: `perfumes`, `bags`, `purses`. The picker sits
at the top of the product form in the dashboard, the same way Calary picks between wigs and beauty.

Three categories, two field sets. Each category declares a `kind` in `src/data/catalog.ts`:

| Category | Kind | Fields |
| --- | --- | --- |
| Perfumes | `fragrance` | volume variants, note pyramid |
| Bags | `leather` | base price, dimensions, lead time, option groups, monogram |
| Purses | `leather` | same as bags |

The editor and the storefront branch on `kind`, not on the category name, so adding a fourth
leather category (belts, card cases) needs a line in `categories` and nothing else.

Switching category mid-edit drops the fields belonging to the other shape rather than carrying them
along, so a perfume can never ship with a stale base price hiding in the row. Which fields are
required is checked server-side in `admin.saveProduct`, per category, so the error names what is
actually missing.

**Perfumes** are sold in 15 ml, 50 ml and 100 ml. The 15 ml is positioned as a refillable trial,
which is why it carries a note and the others do not. Per-ml pricing renders from `priceCents / ml`.

**Bags and purses** are configured rather than picked off a shelf. Option groups are editable per
product, so the coin purse ships with two groups where the tote has four. Price recomputes on every
change through `configPrice()` in `src/lib/pricing.ts`, and the same function runs server-side, so a
client cannot post its own total. Each configuration produces its own cart key, so two builds of one
bag stay separate lines.

The storefront shows perfumes in their own section, then bags and purses together with an
Everything / Bags / Purses filter. The filter only appears when both categories have something
published in them.

`src/data/catalog.ts` is the seed catalogue and the source of truth for types during development.
`convex/seed.ts` pushes the same rows into the database.

## Payments

`orders.create` writes a pending order and the cart hands the reference to WhatsApp. Wire Stripe in
`CartDrawer.checkout()` when keys are ready: create the session server-side from the order id, store
`stripeSessionId` on the row, and flip `status` to `paid` from the webhook. Paystack drops into the
same seam if the store ever sells in naira.

## Product photography

ImageKit, same as Calary. `imageKitPath` is already on both product tables; point
`NEXT_PUBLIC_IMAGEKIT_URL` at the account and render from there.

## Contact and credit

Address, hours, WhatsApp number, email, Instagram and the build credit all live in
`src/lib/site.config.ts`. Change them there and every surface follows.


## The dashboard

`/admin`, same shape as Calary.

**Authentication and authorization are separate checks.** Convex Auth with a password provider
decides who is signed in. `ADMIN_EMAILS` on the Convex deployment decides who may see the
dashboard. Anyone can reach the sign-in screen; an address that is not on that list gets a polite
dead end and nothing else.

This is what lets you hand access to the owner without sharing a password. Add her address to
`ADMIN_EMAILS`, she signs up with that exact address and picks her own password, and you never see
it.

`src/middleware.ts` bounces anonymous visitors from `/admin/*` to `/admin/login` before a page
renders. `requireAdmin()` in `convex/admin.ts` re-checks on every query and mutation, so the gate
does not depend on the client behaving.

### SITE_URL

`npx @convex-dev/auth` will set `SITE_URL`, defaulting to `http://localhost:3000` on a dev
deployment and asking for the real origin on prod. Nothing in this build reads it. Convex Auth only
resolves it for OAuth callbacks and for email or phone providers, and this project runs a bare
password provider with no OAuth, no email verification and no reset flow.

For production, set `SITE_URL=https://karturah.co` on the Convex production deployment. Keep local development at `http://localhost:3000`. Do not change `NEXT_PUBLIC_CONVEX_URL` or `CONVEX_SITE_URL` to the website domain. Adding a password reset flow routes through an email provider and makes
it load-bearing immediately. On Calary the value had to match the serving origin exactly, and the
apex-versus-www mismatch is what broke uploads there; that specific failure cannot happen here,
because ImageKit signing no longer goes through Convex.

There is no self-service password reset. If someone loses theirs, delete their rows from the
`users` and `authAccounts` tables in the Convex data browser and let them sign up again. Say the
word and I will add a proper reset flow.

Pages: overview, fragrances, bags, orders. A "Studio login" link sits in the site footer.

## ImageKit

Uploads go straight from the browser to ImageKit, signed by `/api/imagekit/auth`. That route runs on
the same origin as the dashboard, so unlike the Calary setup there is no CORS header and no
`SITE_URL` to keep in sync. That was the variable that broke uploads on Calary when the site served
from `www` and `SITE_URL` pointed at the apex. Here the failure mode does not exist.

The route checks `ADMIN_EMAILS` before issuing a signature, so a signed-out visitor cannot use your
ImageKit quota. The private key never reaches the browser.

Products store the ImageKit `filePath`, not a full URL. `imagekitUrl()` in `src/lib/imagekit.ts`
adds sizing and format transformations at render time, so the same stored path serves a 120px
dashboard thumbnail, a 140px cart thumbnail and a 720px shop image without three uploads.

`ProductGallery` renders the cover photo on each product row, with a thumbnail strip when a product
has more than one. A product with no photos renders no image element at all, so the layout stays as
designed until the studio has uploaded something. Images use a plain `<img>` rather than
`next/image`, since ImageKit already handles format negotiation and resizing at the CDN.

## Storefront data

Sections read from Convex through `useQuery` and fall back to `src/data/catalog.ts` while the query
is in flight. If the deployment is unreachable the seed catalogue simply stays on screen, which is
quiet rather than broken. If the live site is showing the wrong products, check
`NEXT_PUBLIC_CONVEX_URL` in the host's environment variables first.


## Themes

Dark is the default; `.light` on `<html>` flips it. Colours are role names resolved through CSS
variables in `globals.css`, written as RGB channel triplets so Tailwind's opacity modifiers still
work (`border-linen/10` is correct in both themes).

The roles are worth knowing, because the names stop describing literal shades once light mode
exists. `ink` is the page surface, `bark` the alternate section surface, `linen` the primary text,
`muted` secondary text. In dark mode ink is near-black and linen near-white; in light mode they
swap. No component has to know which is active.

An inline script in the layout sets the class before first paint, so there is no flash. A stored
choice wins, otherwise it follows the operating system.

The hero needed real work rather than a recolour. Additive blending is what makes the point cloud
glow, and it only works over a dark background: added onto paper it washes out to white. Light mode
switches to normal blending with dark ink-coloured particles, so the shape reads as pigment instead
of light. Toggling repaints the existing material rather than resampling thirty thousand points.

## Mobile

The cloud used to run past the edges of a phone screen. A portrait viewport has a narrow horizontal
field of view, and the camera was placed for height only. `fit()` in `useMorphScene.ts` now solves
for both axes and takes whichever distance is greater, so the widest silhouette always lands inside
the frame. Point size scales back up with the extra distance so the cloud does not thin out.

Three further changes apply on portrait only, none of which touch desktop: the plume is generated
narrower, transition turbulence drops from 0.5 to 0.3, and the idle rotation swings less far, since
the purse is at its widest side-on. Pointer parallax is off on touch, where it only fought the
scroll.

`overflow-x: hidden` on the body backs all of that up, and the section padding steps down from 24px
to 20px below the `sm` breakpoint.

## Deploying to Vercel

Vercel picks up `vercel-build` automatically, which runs:

```
convex deploy --cmd 'npm run build'
```

That pushes the Convex functions to the production deployment, generates
`convex/_generated`, sets `NEXT_PUBLIC_CONVEX_URL` for the Next build, and only then builds the
site. Running a plain `next build` instead would succeed but ship a site pointed at the placeholder
Convex URL, so it would silently serve the seed catalogue.

`convex/_generated` is gitignored on purpose. It is regenerated on every build, and the Next
tsconfig excludes the `convex` folder so a missing generated folder cannot fail the type check.

Environment variables on Vercel:

| Variable | Notes |
| --- | --- |
| `CONVEX_DEPLOY_KEY` | from the Convex dashboard, Settings, Deploy Keys. Production key. |
| `NEXT_PUBLIC_IMAGEKIT_URL` | |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | |
| `IMAGEKIT_PRIVATE_KEY` | server only, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | |

Do not set `NEXT_PUBLIC_CONVEX_URL` yourself. `convex deploy` supplies it, and a stale hand-set
value would point production at the wrong deployment.

On the Convex production deployment, set `ADMIN_EMAILS` and `SITE_URL` again. Environment variables
do not carry over from dev, and the accounts do not either, so you will sign up once more against
production.
