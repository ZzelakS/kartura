import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("products").collect();
    return rows.filter((r) => r.published).sort((a, b) => a.order - b.order);
  },
});

export const listByCategory = query({
  args: {
    category: v.union(v.literal("perfumes"), v.literal("bags"), v.literal("purses")),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return rows.filter((r) => r.published).sort((a, b) => a.order - b.order);
  },
});
