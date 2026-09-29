# Karturah domain and footer update

## Completed
- Canonical website configuration updated to https://karturah.co.
- Convex production deployment combative-ibis-603: SITE_URL changed from https://kartura.vercel.app to https://karturah.co using the authenticated Convex CLI. A subsequent read confirmed the new value.
- Backend .convex.cloud/.convex.site endpoints, development deployment, authentication keys and commerce logic remain unchanged.
- Footer logo now uses a genuinely transparent PNG; the white CSS background was removed as well.
- Removed the visible “Tap to resonate” button and its styles. Clicking/tapping the hero still produces the requested particle pulse; links and controls are excluded.
- README and environment example updated with the new production origin.

## Validation
Production build and type checks passed. Browser inspection confirmed the transparent footer logo and absence of the pulse button. PNG alpha was verified. The earlier About wording remains unchanged.

## Deployment
The Convex setting is already updated remotely. This ZIP contains the revised frontend source; these visual and metadata changes have not been deployed to Vercel by this task. Keep existing Vercel environment variables when deploying. If karturah.co is not yet attached, add it under the existing Vercel project's Settings → Domains and apply the DNS records Vercel provides. Do not use the website domain as NEXT_PUBLIC_CONVEX_URL or CONVEX_SITE_URL.

Use npm ci, npm run build, and npm start. Credentials, installed dependencies, build output and deployment metadata are excluded from the ZIP.

References:
- https://labs.convex.dev/auth/setup/manual
- https://docs.convex.dev/production/environment-variables
- https://vercel.com/docs/domains/working-with-domains/add-a-domain

## Logo edit
Built-in ImageGen was used. Asset: public/images/karturah-logo-transparent.png. A standalone copy is also included with the deliverables.

Prompt: “Use case: background-extraction. Remove ONLY the white background from this supplied logo, producing a PNG with genuine transparent alpha. Preserve the original gold monogram K, exact KARTURAH lettering, exact MADE TO RESONATE tagline, shapes, spacing, composition and original gold colors. Do not redesign or add any elements. No solid background, no checkerboard baked in, no shadow. This is the website footer brand asset.”
