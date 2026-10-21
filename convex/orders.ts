import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    items: v.array(
      v.object({
        name: v.string(),
        detail: v.string(),
        unitPriceCents: v.number(),
        quantity: v.number(),
      }),
    ),
    subtotalCents: v.number(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) throw new Error("Cannot place an empty order.");

    // Recompute the total server-side; never trust a price sent from the client.
    const computed = args.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
    if (computed !== args.subtotalCents) {
      throw new Error("Order total did not match the items. Refresh and try again.");
    }

    return await ctx.db.insert("orders", {
      items: args.items,
      subtotalCents: computed,
      status: "pending",
      email: args.email,
    });
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) =>
    await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(50),
});
