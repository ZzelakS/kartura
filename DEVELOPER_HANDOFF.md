# For the developer — please push this Karturah update

Hi, please can you review and push this update for karturah.co?
It is from Cmee, for the ZzelakS/kartura repo, main branch, base commit 987d272 ("replaced bar image").

## Files attached
- `karturah-arrangement.patch` — the full change, tested to apply cleanly to a fresh clone of main
- `REVIEW.md` — full review notes

## How to apply
```bash
git checkout main
git pull
git apply karturah-arrangement.patch
# review, then commit and push as usual — Vercel will deploy from main
```

## What it changes
1. Homepage order: Hero, Fragrance intro, Fragrances, Fragrance Bar, Custom Favors, Bags/Purses, Story snippet, FAQ, Contact/Book, Footer
2. Navigation: Fragrance, Fragrance Bar, Favors, Bags, Our story, Contact
3. New sections: FragranceBarSection, CustomFavorsSection, FaqSection, ContactSection — all Enquire via WhatsApp, no prices
4. Prices removed from the public site: no price, per-ml price, option add-on price, monogram price, Add to cart, or Cart button/drawer. Prices remain only in /admin and convex/seed.ts, not visible publicly.
5. Site settings: Instagram fixed to @karturahofficial, WhatsApp greeting fixed to "Hi Karturah", footer no longer claims Stripe payments or free shipping (Stripe is not wired yet, checkout falls back to WhatsApp).
6. Victorian revamp (era style, not the Victoria client look): deep oxblood-black background, cream text, muted gold, wider-spaced eyebrows, gold diamond ornaments under new section headings, double-framed buttons. Dark stays the default.

## Please check before pushing to main / live
- Email in `src/lib/site.config.ts` is still `contact@kartura.com` — please confirm the correct email, or leave it and Cmee will confirm.
- WhatsApp number in `src/lib/site.config.ts` is still the placeholder `14105550142` — please confirm the real number, or leave it and Cmee will confirm.
- Seed prices in `convex/seed.ts` ($58–$290 perfumes, $180–$780 bags) are NOT shown publicly after this patch, but please do not restore price display until Cmee confirms those prices are locked.
- If you would rather push to a branch first for review instead of main, please do that and let Cmee know the branch name.

Thank you — please confirm once it is pushed and live.
— Cmee, via Muse
