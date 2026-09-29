import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * One products table with a category discriminator.
 *
 * Three categories, two field sets. The perfume fields and the leather fields
 * are both optional because a given row only uses one set; which one is decided
 * by `category`. Validation that the right fields are present lives in
 * admin.saveProduct, where it can produce a readable message.
 */

const category = v.union(v.literal("perfumes"), v.literal("bags"), v.literal("purses"));

const fragranceSize = v.object({
  id: v.string(),
  label: v.string(),
  ml: v.number(),
  priceCents: v.number(),
  note: v.optional(v.string()),
});

const optionChoice = v.object({
  id: v.string(),
  label: v.string(),
  addCents: v.number(),
  swatch: v.optional(v.string()),
  note: v.optional(v.string()),
});

const optionGroup = v.object({
  id: v.string(),
  label: v.string(),
  help: v.string(),
  choices: v.array(optionChoice),
});

const image = v.object({
  path: v.string(),
  alt: v.optional(v.string()),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
});

export const productFields = {
  slug: v.string(),
  name: v.string(),
  line: v.string(),
  category,
  images: v.optional(v.array(image)),
  published: v.boolean(),
  order: v.number(),

  // Perfumes
  sizes: v.optional(v.array(fragranceSize)),
  notes: v.optional(v.object({ top: v.string(), heart: v.string(), base: v.string() })),

  // Bags and purses
  basePriceCents: v.optional(v.number()),
  dimensions: v.optional(v.string()),
  leadTime: v.optional(v.string()),
  options: v.optional(v.array(optionGroup)),
  monogram: v.optional(v.object({ addCents: v.number(), maxChars: v.number() })),
};

export default defineSchema({
  ...authTables,

  products: defineTable(productFields)
    .index("by_slug", ["slug"])
    .index("by_category", ["category"]),

  orders: defineTable({
    items: v.array(
      v.object({
        name: v.string(),
        detail: v.string(),
        unitPriceCents: v.number(),
        quantity: v.number(),
      }),
    ),
    subtotalCents: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("in_production"),
      v.literal("shipped"),
      v.literal("cancelled"),
    ),
    email: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
  }).index("by_status", ["status"]),

  subscribers: defineTable({
    email: v.string(),
    source: v.string(),
  }).index("by_email", ["email"]),
});
