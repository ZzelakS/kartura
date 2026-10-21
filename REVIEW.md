# Karturah website — arrangement review

Repo: https://github.com/ZzelakS/kartura (branch: main, commit 987d272)
Status: **For review only. Nothing has been pushed to GitHub and nothing has been deployed to karturah.co.**

**Victoria-style revamp — REVERTED (Oct 21, 2026):** Cmee asked for Victoria style, then said "Nope". The Victoria revamp was removed from the patch at that point.

**Victorian-style revamp (Oct 21, 2026):** Cmee then said "Victorian style" — understood as the Victorian era look, not the Victoria client look. This patch now includes that revamp, still **for review only — nothing pushed or deployed**.
- Victorian here means rich, ornate, classic: deep oxblood-black background, cream text, muted gold, classic Bodoni serif, wider-spaced gold eyebrows, gold diamond ornaments under the new section headings, and double-framed buttons.
- Dark stays the default (Victorian dark is rich, not white). The light theme is now cream paper with deep burgundy text and darker gold, for the same look in daylight.
- This is NOT the white Victoria look that was rejected — no white default, no gold-outlined buttons on white, no script-style headings.
- No content, prices, or page order changed in this revamp step — only the interface look. The arrangement + price removal below are still in the same patch.

## How to apply (for your developer, or in the repo)
```bash
git apply karturah-arrangement.patch
```
The patch was tested on a fresh clone of main and applies cleanly.

## What changed

### Homepage order — `src/app/page.tsx`
Before: Hero, Fragrance, Bags, Story, Footer
After: Hero, Fragrance, **Fragrance Bar, Custom Favors**, Bags, Story, Footer

### Navigation — `src/components/ui/SiteHeader.tsx`
Before: Fragrance, Bags, The house, Our story
After: Fragrance, Fragrance Bar, Favors, Bags, Our story, Contact
Contact goes to the footer, which already has `id="contact"`.

### New sections (no prices, enquire only)
- `src/components/sections/FragranceBarSection.tsx` — what a live bar includes: six scents, scent menu/signage, one personalised bottle per guest, setup/hosting/breakdown. Button: "Enquire about a date" (WhatsApp).
- `src/components/sections/CustomFavorsSection.tsx` — mini vials and monogrammed bottles for birthdays and celebrations, personalised with name and date. Button: "Enquire about favors" (WhatsApp).

### Site settings — `src/lib/site.config.ts`
- Instagram: `https://instagram.com/kartura` → `https://instagram.com/karturahofficial`
- WhatsApp greeting: "Hi Kartura" → "Hi Karturah"
- Footer line: "Card and Apple Pay through Stripe. Free US shipping over $200. Made to order ships in about three weeks." → "Enquiries and orders through WhatsApp for now. Made to order — lead time confirmed when you enquire."
  - Reason: Stripe is not wired in this code yet (checkout falls back to WhatsApp, per the repo README), so the old line would mislead visitors.

## Price removal — added Oct 21, 2026
At Cmee's "Remove price" instruction, all public price display was removed:
- `FragranceSection.tsx` — price, per-ml price, and "Add to cart" removed; size selector kept, with an "Enquire about this scent" WhatsApp button instead.
- `BagCustomizer.tsx` — total price, "+$…" option add-ons, and monogram price removed; configuration choices kept, with an "Enquire about this build" WhatsApp button instead. "Ask about this build on WhatsApp" is now that main button.
- `BagsSection.tsx` — copy changed from "the price updates as you go" to "then enquire about your build".
- `SiteHeader.tsx` + `src/app/page.tsx` — Cart button and CartDrawer removed from the public site, since there is no priced checkout to go to.
- Prices still exist only where visitors cannot see them: the admin dashboard (`/admin`) and the seed data file (`convex/seed.ts`). Those were left untouched on purpose, so prices can be restored later once they are locked — they do not show on the public site after this patch.

## Full arrangement — added Oct 21, 2026 ("Arrange what should be there")
Homepage, in order, with a reason for each:
1. **Hero** — Karturah, Made to Resonate (existing)
2. **Fragrance, with feeling** — intro feature (existing)
3. **Fragrances** — showcase, sizes 15/50/100 ml, notes, Enquire — no prices (existing section, price display removed)
4. **Fragrance Bar** — live bar, six scents, personalised bottle per guest, setup/hosting/breakdown, Enquire (new)
5. **Custom Favors** — mini vials and monogrammed bottles, name + date, Enquire (new)
6. **Bags and purses** — leather, built to order, configuration choices, Enquire (existing section, price display removed)
7. **Our Story snippet** — "A story still unfolding", links to the full /about story (existing)
8. **FAQ** — Made to Resonate, how the bar works, custom favors, sizes, made-to-order bags, how to book (new, `FaqSection.tsx`, no prices, no invented promises)
9. **Contact / Book** — WhatsApp, @karturahofficial, email, Baltimore (new, `ContactSection.tsx`, now the single `id="contact"` anchor)
10. **Footer** — newsletter, address, links, Studio login (existing, `id="contact"` removed from the footer to avoid a duplicate anchor)

Other arrangement fixes in the same patch:
- About page: CartDrawer removed (it was dead once the cart was removed from the public site).
- Site description (search / sharing): now "Fragrances, a live fragrance bar, custom favors, and bags built to order. Made to Resonate." instead of only scents and bags.
- Navigation stays: Fragrance, Fragrance Bar, Favors, Bags, Our story, Contact. FAQ is found by scrolling between Story and Contact, not as a seventh nav link.

What is deliberately NOT on the site yet: prices, a checkout, shipping/returns promises, and testimonials — none are locked yet, so they are not invented here.

## What was NOT changed — please check before going live
1. **Seed shop prices** — the code's seed catalogue still has perfumes at $58–$290 and bags at $180–$780 (Harmattan, Ìlù, Kola Noir; Adé Tote, Ọ̀nà Shoulder, Ìmọ̀ Clutch, Èkó Coin Purse), but those numbers no longer display publicly after the price-removal patch above. Confirm whether these are real or placeholder before restoring any price display.
2. **Email** — still `contact@kartura.com` in the code. Send the correct email to replace it.
3. **WhatsApp number** — still the placeholder `14105550142` in the code. Send the real number to replace it.
4. **Shop address / hours** — still "Baltimore, Maryland / Tuesday to Saturday, 11am to 7pm" in the code. Confirm or remove.
5. **Vercel** — not connected to Muse yet, so no deploy has been run.

## Next step after your review
Tell Muse: "push this" (needs GitHub sign-in) or hand this patch to your developer to apply and deploy through Vercel as usual. Do not deploy the seed prices until item 1 above is confirmed.
