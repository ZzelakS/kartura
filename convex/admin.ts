import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { productFields } from "./schema";

/**
 * Authentication and authorization are separate.
 *
 * Convex Auth decides who is signed in. ADMIN_EMAILS decides who may touch the
 * dashboard. It is a comma-separated list set in the Convex dashboard under
 * Settings, Environment Variables. Adding somebody there lets them sign up with
 * that exact address and pick their own password, so credentials never need to
 * be shared.
 */
function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

async function currentEmail(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  const user = await ctx.db.get(userId);
  return user?.email?.toLowerCase() ?? null;
}

export async function requireAdmin(ctx: MutationCtx | QueryCtx): Promise<string> {
  const email = await currentEmail(ctx);
  if (!email) throw new Error("Sign in first.");
  if (!allowedEmails().includes(email)) {
    throw new Error("That account is not on the studio list.");
  }
  return email;
}

/** Drives the dashboard shell: who am I, and may I be here. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const email = await currentEmail(ctx);
    if (!email) return { signedIn: false, isAdmin: false, email: null };
    return { signedIn: true, isAdmin: allowedEmails().includes(email), email };
  },
});

export const overview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [products, orders, subscribers] = await Promise.all([
      ctx.db.query("products").collect(),
      ctx.db.query("orders").order("desc").take(200),
      ctx.db.query("subscribers").collect(),
    ]);

    const count = (category: string) => products.filter((p) => p.category === category).length;
    const live = (category: string) =>
      products.filter((p) => p.category === category && p.published).length;

    return {
      perfumes: count("perfumes"),
      perfumesLive: live("perfumes"),
      bags: count("bags"),
      bagsLive: live("bags"),
      purses: count("purses"),
      pursesLive: live("purses"),
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      revenueCents: orders
        .filter((o) => o.status !== "cancelled" && o.status !== "pending")
        .reduce((sum, o) => sum + o.subtotalCents, 0),
      subscribers: subscribers.length,
    };
  },
});

/* ----------------------------- products ----------------------------- */

export const allProducts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("products").collect();
    return rows.sort((a, b) => a.order - b.order);
  },
});

export const saveProduct = mutation({
  args: { id: v.optional(v.id("products")), ...productFields },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...row } = args;

    if (!row.name.trim()) throw new Error("The product needs a name.");

    // Which fields are required depends on the category, so the message can say
    // what is actually missing rather than failing on a null further down.
    if (row.category === "perfumes") {
      if (!row.sizes || row.sizes.length === 0) {
        throw new Error("A perfume needs at least one size.");
      }
      if (row.sizes.some((s) => s.priceCents <= 0)) {
        throw new Error("Every size needs a price above zero.");
      }
    } else {
      if (!row.basePriceCents || row.basePriceCents <= 0) {
        throw new Error("A bag or purse needs a base price.");
      }
      for (const group of row.options ?? []) {
        if (group.choices.length === 0) {
          throw new Error(`"${group.label}" has no choices. Remove the group or add one.`);
        }
      }
    }

    const clash = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", row.slug))
      .unique();
    if (clash && clash._id !== id) throw new Error(`The slug "${row.slug}" is already in use.`);

    if (id) {
      await ctx.db.patch(id, row);
      return id;
    }
    return await ctx.db.insert("products", row);
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

/* ------------------------------ orders ------------------------------ */

export const allOrders = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("orders").order("desc").take(200);
  },
});

export const setOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("in_production"),
      v.literal("shipped"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const allSubscribers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("subscribers").order("desc").take(500);
  },
});
