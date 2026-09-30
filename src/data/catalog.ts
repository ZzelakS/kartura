/**
 * One product model with a category discriminator, the same shape Calary uses.
 *
 * Three categories, two field sets. Perfumes carry volume variants and a note
 * pyramid; bags and purses carry a base price, dimensions and customisation
 * options. `kind` on each category is what the editor and the storefront branch
 * on, so adding a fourth leather category later needs no new code.
 */

export type Category = "perfumes" | "bags" | "purses";
export type Kind = "fragrance" | "leather";

export const categories: {
  id: Category;
  label: string;
  kind: Kind;
}[] = [
  { id: "perfumes", label: "Perfumes", kind: "fragrance" },
  { id: "bags", label: "Bags", kind: "leather" },
  { id: "purses", label: "Purses", kind: "leather" },
];

export function kindOf(category: Category): Kind {
  return categories.find((c) => c.id === category)?.kind ?? "leather";
}

export function labelOf(category: Category): string {
  return categories.find((c) => c.id === category)?.label ?? category;
}

export type ProductImage = {
  path: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type FragranceSize = {
  id: string;
  label: string;
  ml: number;
  priceCents: number;
  note?: string;
};

export type BagOptionChoice = {
  id: string;
  label: string;
  addCents: number;
  swatch?: string;
  note?: string;
};

export type BagOptionGroup = {
  id: string;
  label: string;
  help: string;
  choices: BagOptionChoice[];
};

export type Product = {
  slug: string;
  name: string;
  line: string;
  category: Category;
  images?: ProductImage[];
  published: boolean;
  order: number;

  /** Perfumes only. */
  sizes?: FragranceSize[];
  notes?: {
    top: string;
    heart: string;
    base: string;
  };

  /** Bags and purses only. */
  basePriceCents?: number;
  dimensions?: string;
  leadTime?: string;
  options?: BagOptionGroup[];
  monogram?: {
    addCents: number;
    maxChars: number;
  };
};

/* --------------------------- shared option sets --------------------------- */

export const leatherOptions: BagOptionGroup[] = [
  {
    id: "leather",
    label: "Leather",
    help: "Every hide is cut from the same tannery run, so colour holds across a set.",
    choices: [
      {
        id: "black-calf",
        label: "Black calf",
        addCents: 0,
        swatch: "#1B1614",
      },
      {
        id: "cognac-calf",
        label: "Cognac calf",
        addCents: 0,
        swatch: "#8A5227",
      },
      {
        id: "bone-pebbled",
        label: "Bone pebbled",
        addCents: 3500,
        swatch: "#C9BCA6",
      },
      {
        id: "olive-veg",
        label: "Olive vegetable-tanned",
        addCents: 6000,
        swatch: "#5D6444",
      },
    ],
  },
  {
    id: "hardware",
    label: "Hardware",
    help: "Brass is left unplated and will darken. The others stay as they arrive.",
    choices: [
      {
        id: "brass",
        label: "Brushed brass",
        addCents: 0,
        swatch: "#B98A4B",
      },
      {
        id: "steel",
        label: "Blackened steel",
        addCents: 2500,
        swatch: "#2E2E30",
      },
      {
        id: "nickel",
        label: "Polished nickel",
        addCents: 2500,
        swatch: "#B7BCC0",
      },
    ],
  },
  {
    id: "lining",
    label: "Lining",
    help: "Unlined shows the raw flesh side of the hide and breaks in faster.",
    choices: [
      {
        id: "unlined",
        label: "Unlined",
        addCents: 0,
      },
      {
        id: "cotton",
        label: "Striped cotton",
        addCents: 2000,
      },
      {
        id: "suede",
        label: "Suede",
        addCents: 4500,
      },
    ],
  },
  {
    id: "strap",
    label: "Strap",
    help: "Straps are removable. You can add a second one later at any time.",
    choices: [
      {
        id: "none",
        label: "Top handle only",
        addCents: 0,
      },
      {
        id: "crossbody",
        label: "Detachable crossbody",
        addCents: 9500,
      },
      {
        id: "chain",
        label: "Cast chain",
        addCents: 13000,
      },
    ],
  },
];

/* ------------------------------ seed catalogue ---------------------------- */

export const products: Product[] = [];

/* ------------------------------ helpers ---------------------------------- */

export const byCategory = (
  category: Category,
  list: Product[] = products
): Product[] =>
  list
    .filter((p) => p.category === category)
    .sort((a, b) => a.order - b.order);

export const byKind = (
  kind: Kind,
  list: Product[] = products
): Product[] =>
  list
    .filter((p) => kindOf(p.category) === kind)
    .sort((a, b) => a.order - b.order);