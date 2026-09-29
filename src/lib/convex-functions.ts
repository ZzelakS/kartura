import { makeFunctionReference } from "convex/server";

/**
 * Function references built by name instead of imported from `convex/_generated`.
 *
 * The generated folder only exists after `npx convex dev` has run once, so
 * importing from it breaks a fresh clone at build time. These references resolve
 * at runtime against the same `file:export` names, so the app compiles before
 * Convex is provisioned and works unchanged after.
 *
 * The string is `<file>:<export>`. Rename a Convex export and you must rename it
 * here too.
 */

/* ------------------------------- documents ------------------------------- */

export type ImageDoc = { path: string; alt?: string; width?: number; height?: number };

export type Category = "perfumes" | "bags" | "purses";

export type SizeDoc = {
  id: string;
  label: string;
  ml: number;
  priceCents: number;
  note?: string;
};

export type ChoiceDoc = {
  id: string;
  label: string;
  addCents: number;
  swatch?: string;
  note?: string;
};

export type OptionGroupDoc = {
  id: string;
  label: string;
  help: string;
  choices: ChoiceDoc[];
};

export type ProductDoc = {
  _id: string;
  _creationTime: number;
  slug: string;
  name: string;
  line: string;
  category: Category;
  images?: ImageDoc[];
  published: boolean;
  order: number;

  // Perfumes
  sizes?: SizeDoc[];
  notes?: { top: string; heart: string; base: string };

  // Bags and purses
  basePriceCents?: number;
  dimensions?: string;
  leadTime?: string;
  options?: OptionGroupDoc[];
  monogram?: { addCents: number; maxChars: number };
};

export type OrderStatus = "pending" | "paid" | "in_production" | "shipped" | "cancelled";

export type OrderItem = {
  name: string;
  detail: string;
  unitPriceCents: number;
  quantity: number;
};

export type OrderDoc = {
  _id: string;
  _creationTime: number;
  items: OrderItem[];
  subtotalCents: number;
  status: OrderStatus;
  email?: string;
};

/* ------------------------------- arguments ------------------------------- */

type Empty = Record<string, never>;

/** Neither system field is ever sent: `_id` travels as `id`, `_creationTime` is the database's. */
export type ProductInput = Omit<ProductDoc, "_id" | "_creationTime"> & { id?: string };

export type SubscribeArgs = { email: string; source?: string };

export type CreateOrderArgs = { items: OrderItem[]; subtotalCents: number; email?: string };

export type MeResult = { signedIn: boolean; isAdmin: boolean; email: string | null };

export type OverviewResult = {
  perfumes: number;
  perfumesLive: number;
  bags: number;
  bagsLive: number;
  purses: number;
  pursesLive: number;
  pendingOrders: number;
  revenueCents: number;
  subscribers: number;
};

/* ------------------------------- storefront ------------------------------ */

export const listProducts = makeFunctionReference<"query", Empty, ProductDoc[]>("products:list");

export const subscribeToNewsletter = makeFunctionReference<"mutation", SubscribeArgs, string>(
  "newsletter:subscribe",
);

export const createOrder = makeFunctionReference<"mutation", CreateOrderArgs, string>(
  "orders:create",
);

/* --------------------------------- admin --------------------------------- */

export const adminMe = makeFunctionReference<"query", Empty, MeResult>("admin:me");

export const adminOverview = makeFunctionReference<"query", Empty, OverviewResult>(
  "admin:overview",
);

export const adminAllProducts = makeFunctionReference<"query", Empty, ProductDoc[]>(
  "admin:allProducts",
);

export const adminSaveProduct = makeFunctionReference<"mutation", ProductInput, string>(
  "admin:saveProduct",
);

export const adminDeleteProduct = makeFunctionReference<"mutation", { id: string }, null>(
  "admin:deleteProduct",
);

export const adminAllOrders = makeFunctionReference<"query", Empty, OrderDoc[]>("admin:allOrders");

export const adminSetOrderStatus = makeFunctionReference<
  "mutation",
  { id: string; status: OrderStatus },
  null
>("admin:setOrderStatus");
