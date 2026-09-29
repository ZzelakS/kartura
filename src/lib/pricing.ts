import type { BagOptionGroup, Product } from "@/data/catalog";

export type BagConfig = {
  monogram: string;
  /** Group id to chosen choice id. Groups are editable, so this cannot be fixed keys. */
  choices: Record<string, string>;
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}

export function defaultConfig(product: Product): BagConfig {
  const choices: Record<string, string> = {};
  for (const group of product.options ?? []) {
    if (group.choices[0]) choices[group.id] = group.choices[0].id;
  }
  return { choices, monogram: "" };
}

function chosen(group: BagOptionGroup, config: BagConfig) {
  return group.choices.find((c) => c.id === config.choices[group.id]);
}

export function configPrice(product: Product, config: BagConfig): number {
  let total = product.basePriceCents ?? 0;
  for (const group of product.options ?? []) {
    total += chosen(group, config)?.addCents ?? 0;
  }
  if (config.monogram.trim() && product.monogram) total += product.monogram.addCents;
  return total;
}

/** Human-readable one-liner used in the cart and in the WhatsApp message. */
export function describeConfig(product: Product, config: BagConfig): string {
  const parts = (product.options ?? [])
    .map((group) => {
      const choice = chosen(group, config);
      if (!choice) return null;
      return group.id === "lining" ? `${choice.label.toLowerCase()} lining` : choice.label;
    })
    .filter((v): v is string => Boolean(v));

  if (config.monogram.trim()) parts.push(`monogram ${config.monogram.trim().toUpperCase()}`);
  return parts.join(", ");
}

/** Stable cart key, so two different builds of one bag stay separate lines. */
export function configKey(product: Product, config: BagConfig): string {
  const picks = (product.options ?? []).map((g) => config.choices[g.id] ?? "").join("-");
  return `${product.slug}-${picks}-${config.monogram.trim().toUpperCase()}`;
}
