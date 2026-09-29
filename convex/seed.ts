import { internalMutation } from "./_generated/server";

/**
 * Seeds the catalogue. Safe to run more than once: rows with the same slug are
 * updated rather than duplicated.
 *
 *   npx convex run seed:run
 */

const leatherOptions = [
  {
    id: "leather",
    label: "Leather",
    help: "Every hide is cut from the same tannery run, so colour holds across a set.",
    choices: [
      { id: "black-calf", label: "Black calf", addCents: 0, swatch: "#1B1614" },
      { id: "cognac-calf", label: "Cognac calf", addCents: 0, swatch: "#8A5227" },
      { id: "bone-pebbled", label: "Bone pebbled", addCents: 3500, swatch: "#C9BCA6" },
      { id: "olive-veg", label: "Olive vegetable-tanned", addCents: 6000, swatch: "#5D6444" },
    ],
  },
  {
    id: "hardware",
    label: "Hardware",
    help: "Brass is left unplated and will darken. The others stay as they arrive.",
    choices: [
      { id: "brass", label: "Brushed brass", addCents: 0, swatch: "#B98A4B" },
      { id: "steel", label: "Blackened steel", addCents: 2500, swatch: "#2E2E30" },
      { id: "nickel", label: "Polished nickel", addCents: 2500, swatch: "#B7BCC0" },
    ],
  },
  {
    id: "lining",
    label: "Lining",
    help: "Unlined shows the raw flesh side of the hide and breaks in faster.",
    choices: [
      { id: "unlined", label: "Unlined", addCents: 0 },
      { id: "cotton", label: "Striped cotton", addCents: 2000 },
      { id: "suede", label: "Suede", addCents: 4500 },
    ],
  },
  {
    id: "strap",
    label: "Strap",
    help: "Straps are removable. You can add a second one later at any time.",
    choices: [
      { id: "none", label: "Top handle only", addCents: 0 },
      { id: "crossbody", label: "Detachable crossbody", addCents: 9500 },
      { id: "chain", label: "Cast chain", addCents: 13000 },
    ],
  },
];

const sizes = (a: number, b: number, c: number) => [
  { id: "15", label: "15 ml", ml: 15, priceCents: a, note: "Travel size, refillable" },
  { id: "50", label: "50 ml", ml: 50, priceCents: b },
  { id: "100", label: "100 ml", ml: 100, priceCents: c, note: "Best value per ml" },
];

const monogram = { addCents: 4000, maxChars: 3 };

const catalogue = [
  {
    slug: "harmattan",
    name: "Harmattan",
    category: "perfumes" as const,
    line: "Built for the dry months, when the air goes thin and cold after dark.",
    notes: {
      top: "Bergamot, cardamom, dry grass",
      heart: "Iris, jasmine sambac",
      base: "Vetiver, cedar, ambrette",
    },
    sizes: sizes(5800, 14500, 22500),
    published: true,
    order: 1,
  },
  {
    slug: "ilu",
    name: "Ìlù",
    category: "perfumes" as const,
    line: "Loud on purpose. Two sprays is a decision, not an accident.",
    notes: {
      top: "Pink pepper, mandarin",
      heart: "Tuberose, saffron",
      base: "Oud, benzoin, leather",
    },
    sizes: sizes(7200, 18500, 29000),
    published: true,
    order: 2,
  },
  {
    slug: "kola-noir",
    name: "Kola Noir",
    category: "perfumes" as const,
    line: "Bitter at the open, sweet by the third hour. Our most worn scent.",
    notes: {
      top: "Black pepper, lime peel",
      heart: "Kola nut, tobacco leaf",
      base: "Amber, tonka, vanilla",
    },
    sizes: sizes(6200, 15800, 24500),
    published: true,
    order: 3,
  },
  {
    slug: "ade-tote",
    name: "Adé Tote",
    category: "bags" as const,
    line: "Carries a laptop flat, a folder, and a 100 ml bottle without slumping.",
    basePriceCents: 78000,
    dimensions: "34 × 28 × 12 cm",
    leadTime: "Made to order, about three weeks",
    options: leatherOptions,
    monogram,
    published: true,
    order: 4,
  },
  {
    slug: "ona-shoulder",
    name: "Ọ̀nà Shoulder",
    category: "bags" as const,
    line: "Sits high on the body. The chain shortens with a hidden clasp inside the seam.",
    basePriceCents: 62000,
    dimensions: "26 × 18 × 8 cm",
    leadTime: "Made to order, about three weeks",
    options: leatherOptions,
    monogram,
    published: true,
    order: 5,
  },
  {
    slug: "imo-clutch",
    name: "Ìmọ̀ Clutch",
    category: "purses" as const,
    line: "Flat enough to sit under an arm, deep enough for a phone and a card case.",
    basePriceCents: 42000,
    dimensions: "24 × 14 × 4 cm",
    leadTime: "Made to order, about two weeks",
    options: leatherOptions,
    monogram,
    published: true,
    order: 6,
  },
  {
    slug: "eko-coin-purse",
    name: "Èkó Coin Purse",
    category: "purses" as const,
    line: "One seam, one zip, no lining. The offcut piece, and the one we carry most.",
    basePriceCents: 18000,
    dimensions: "12 × 9 × 2 cm",
    leadTime: "Usually in stock",
    options: leatherOptions.slice(0, 2),
    monogram: { addCents: 2500, maxChars: 3 },
    published: true,
    order: 7,
  },
];

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const row of catalogue) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", row.slug))
        .unique();
      if (existing) await ctx.db.patch(existing._id, row);
      else await ctx.db.insert("products", row);
    }
    return { products: catalogue.length };
  },
});
