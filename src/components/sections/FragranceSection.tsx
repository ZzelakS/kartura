"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { byCategory, products as seed, type Product } from "@/data/catalog";
import { listProducts } from "@/lib/convex-functions";
import { formatPrice } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import ProductGallery from "@/components/ui/ProductGallery";

function PerfumeRow({ product }: { product: Product }) {
  const sizes = product.sizes ?? [];
  const [sizeId, setSizeId] = useState(sizes[1]?.id ?? sizes[0]?.id ?? "");
  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const { add } = useCart();

  if (!size) return null;
  const perMl = size.priceCents / size.ml / 100;

  return (
    <article className="border-t border-linen/10 py-12">
      <div className="lg:flex lg:items-start lg:gap-12">
        <ProductGallery
          images={product.images}
          name={product.name}
          className="-mx-5 mb-8 w-screen sm:-mx-6 sm:w-auto lg:mx-0 lg:mb-0 lg:w-[240px] lg:shrink-0"
        />

        <div className="flex-1 md:flex md:items-start md:justify-between md:gap-16">
          <div className="md:min-w-[260px]">
            <h3 className="font-display text-3xl leading-tight">{product.name}</h3>
            <p className="mt-1 text-[13px] text-muted">Eau de parfum</p>

            <div className="mt-7 flex w-full flex-wrap gap-2">
              {sizes.map((s) => {
                const active = s.id === size.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSizeId(s.id)}
                    aria-pressed={active}
                    className={`border px-4 py-2 text-[13px] tracking-wide transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber ${
                      active
                        ? "border-amber bg-amber text-ink"
                        : "border-linen/20 text-linen hover:border-linen/45"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-[13px] text-muted">
              {size.note ? `${size.note} · ` : ""}
              {perMl < 10 ? `$${perMl.toFixed(2)} per ml` : ""}
            </p>

            <div className="mt-6 flex items-center gap-6">
              <span className="text-[17px]">{formatPrice(size.priceCents)}</span>
              <button
                type="button"
                onClick={() =>
                  add({
                    key: `${product.slug}-${size.id}`,
                    name: product.name,
                    detail: `${size.label} eau de parfum`,
                    unitPriceCents: size.priceCents,
                    image: product.images?.[0]?.path,
                  })
                }
                className="border border-amber px-6 py-2.5 text-[13px] tracking-wide text-amber transition-colors hover:bg-amber hover:text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-amber"
              >
                Add to cart
              </button>
            </div>
          </div>

          <div className="mt-10 max-w-[520px] flex-1 md:mt-0">
            <p className="mb-6 text-[15px] leading-[1.8]">{product.line}</p>
            {product.notes
              ? (
                  [
                    ["Top", product.notes.top],
                    ["Heart", product.notes.heart],
                    ["Base", product.notes.base],
                  ] as const
                ).map(([label, notes]) => (
                  <div key={label} className="flex gap-6 border-t border-linen/10 py-3">
                    <span className="w-[62px] shrink-0 text-[13px] text-sage">{label}</span>
                    <span className="text-[14px] text-muted">{notes}</span>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FragranceSection() {
  // Until Convex answers, the seed catalogue renders. If the deployment is
  // unreachable the seed data simply stays, which is quiet rather than broken.
  const live = useQuery(listProducts, {});
  const all = live && live.length > 0 ? (live as Product[]) : seed;
  const items = byCategory("perfumes", all);

  if (items.length === 0) return null;

  return (
    <section
      id="fragrance"
      className="relative z-10 overflow-x-hidden bg-ink px-5 pb-24 pt-28 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">
          Perfumes, three sizes each
        </h2>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.75] text-muted">
          Blended in small runs and rested for six weeks before bottling. The 15 ml is refillable at
          the studio, so you can live with a scent before committing to a full bottle. Notes are
          listed the way a perfumer reads them: what you meet first, what settles, what stays.
        </p>

        <div className="mt-14">
          {items.map((p) => (
            <PerfumeRow key={p.slug} product={p} />
          ))}
          <div className="border-t border-linen/10" />
        </div>
      </div>
    </section>
  );
}
