import { internalMutation } from "./_generated/server";

/** Explicit one-time reset. Run repeatedly until deleted === 0; never runs automatically. */
export const deleteProductBatch = internalMutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").take(100);
    for (const product of products) await ctx.db.delete(product._id);
    return { deleted: products.length, repeat: products.length === 100 };
  },
});
