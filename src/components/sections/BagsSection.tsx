"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { byKind, products as seed, type Category, type Product } from "@/data/catalog";
import { listProducts } from "@/lib/convex-functions";
import BagCustomizer from "./BagCustomizer";

type Filter = "all" | Extract<Category, "bags" | "purses">;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "bags", label: "Bags" },
  { id: "purses", label: "Purses" },
];

export default function BagsSection() {
  const live = useQuery(listProducts, {});
  const all = live && live.length > 0 ? (live as Product[]) : seed;
  const leather = byKind("leather", all);

  const [filter, setFilter] = useState<Filter>("all");
  const items = filter === "all" ? leather : leather.filter((p) => p.category === filter);

  if (leather.length === 0) return null;

  // Only offer the switch when both categories actually have something in them.
  const showFilters = new Set(leather.map((p) => p.category)).size > 1;

  return (
    <section
      id="bags"
      className="relative z-10 overflow-x-hidden bg-bark px-5 py-24 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">
          Bags and purses, built to order
        </h2>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.75] text-muted">
          Nine pieces leave the bench each month, numbered inside the seam. Choose the hide, the
          hardware, the lining and the strap below and the price updates as you go. Nothing is cut
          until you order.
        </p>

        {showFilters ? (
          <div className="mt-8 flex w-full flex-wrap gap-2">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={`border px-4 py-2 text-[13px] tracking-wide transition-colors ${
                    active
                      ? "border-amber text-amber"
                      : "border-linen/15 text-muted hover:border-linen/40"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-10">
          {items.map((product) => (
            <BagCustomizer key={product.slug} product={product} />
          ))}
          <div className="border-t border-linen/10" />
        </div>
      </div>
    </section>
  );
}
