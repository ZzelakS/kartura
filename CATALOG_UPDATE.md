# Karturah catalogue update

- Admin products have three mutually exclusive availability settings: Coming Soon (default), Out of Stock, and Live.
- Published products always show their uploaded images and names. Coming Soon and Out of Stock hide all prices, product descriptions, and enquiry actions. Live reveals prices, description, and enquiry links.
- Bags/purses have a single price, dimensions, and description; made-to-order, customisation, and monogram UI are removed.
- Perfumes retain size prices and fragrance notes for Live listings.
- Removed the seed command and seed script. An empty Convex catalogue now stays empty; no sample product fallback.
- Historical orders, admin access, and ImageKit integration are preserved.

## Existing Convex products (manual, destructive reset)

Back up your production deployment first:

    npx convex export --prod --path karturah-backup.zip

Deploy functions to the **correct** production deployment:

    npx convex deploy

Then, only if you intend to permanently clear every existing product:

    npx convex run cleanup:deleteProductBatch --prod

Repeat the last command until `deleted` is 0. This does not delete orders or externally hosted ImageKit assets. Do not run the cleanup function after adding new products.

## Validation

Install dependencies (`npm install`) then run `npx convex dev --once` against your development deployment and `npx tsc --noEmit`, followed by `npm run build`. The ZIP does not include node_modules or secrets. Production data was not modified by this ZIP creation.
