"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/catalog";
import {
  configKey,
  configPrice,
  defaultConfig,
  describeConfig,
  formatPrice,
  type BagConfig,
} from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/site.config";
import ProductGallery from "@/components/ui/ProductGallery";

export default function BagCustomizer({ product }: { product: Product }) {
  const [config, setConfig] = useState<BagConfig>(() => defaultConfig(product));
  const { add } = useCart();

  const price = useMemo(() => configPrice(product, config), [product, config]);
  const summary = useMemo(() => describeConfig(product, config), [product, config]);

  const pick = (groupId: string, choiceId: string) =>
    setConfig((prev) => ({ ...prev, choices: { ...prev.choices, [groupId]: choiceId } }));

  return (
    <article className="border-t border-linen/10 py-12">
      <div className="lg:flex lg:gap-12">
        <ProductGallery
          images={product.images}
          name={product.name}
          aspect="aspect-square"
          className="-mx-5 mb-8 w-screen sm:-mx-6 sm:w-auto lg:mx-0 lg:mb-0 lg:w-[260px] lg:shrink-0"
        />

        <div className="flex-1">
          <div>
            <h3 className="font-display text-3xl leading-tight">{product.name}</h3>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.75] text-muted">
              {product.line}
            </p>
            <p className="mt-4 text-[13px] leading-[1.9] text-muted">
              {[product.dimensions, product.leadTime].filter(Boolean).join(" · ")}
            </p>
          </div>

          <div className="mt-8">
            {(product.options ?? []).map((group) => (
              <fieldset key={group.id} className="border-t border-linen/10 py-6">
                <legend className="sr-only">{group.label}</legend>
                <div className="mb-4 flex flex-wrap items-baseline gap-x-4">
                  <span className="text-[13px] text-sage">{group.label}</span>
                  <span className="text-[13px] text-muted">{group.help}</span>
                </div>

                <div className="flex w-full flex-wrap gap-2">
                  {group.choices.map((choice) => {
                    const active = config.choices[group.id] === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => pick(group.id, choice.id)}
                        aria-pressed={active}
                        className={`flex items-center gap-2.5 border px-4 py-2 text-[13px] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber ${
                          active
                            ? "border-amber text-linen"
                            : "border-linen/15 text-muted hover:border-linen/40"
                        }`}
                      >
                        {choice.swatch ? (
                          <span
                            aria-hidden
                            className="h-3.5 w-3.5 rounded-full border border-linen/25"
                            style={{ background: choice.swatch }}
                          />
                        ) : null}
                        <span>{choice.label}</span>
                        {choice.addCents > 0 ? (
                          <span className="text-muted">+{formatPrice(choice.addCents)}</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {product.monogram ? (
              <div className="border-t border-linen/10 py-6">
                <label htmlFor={`${product.slug}-monogram`} className="text-[13px] text-sage">
                  Monogram
                </label>
                <p className="mt-1 text-[13px] text-muted">
                  Up to {product.monogram.maxChars} letters, foil-stamped inside the top edge. Adds{" "}
                  {formatPrice(product.monogram.addCents)} and one week.
                </p>
                <input
                  id={`${product.slug}-monogram`}
                  value={config.monogram}
                  maxLength={product.monogram.maxChars}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      monogram: e.target.value.replace(/[^a-zA-Z]/g, ""),
                    }))
                  }
                  placeholder="SOA"
                  className="mt-4 w-[140px] border border-linen/20 bg-transparent px-4 py-2.5 text-[14px] uppercase tracking-[0.2em] text-linen placeholder:text-muted/60 focus:border-amber focus:outline-none"
                />
              </div>
            ) : null}

            <div className="border-t border-linen/10 pt-6">
              <p className="text-[13px] leading-[1.8] text-muted">{summary}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
                <span className="text-[19px]">{formatPrice(price)}</span>
                <button
                  type="button"
                  onClick={() =>
                    add({
                      key: configKey(product, config),
                      name: product.name,
                      detail: summary,
                      unitPriceCents: price,
                      image: product.images?.[0]?.path,
                    })
                  }
                  className="border border-amber px-6 py-2.5 text-[13px] tracking-wide text-amber transition-colors hover:bg-amber hover:text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-amber"
                >
                  Add to cart
                </button>
                <a
                  href={whatsappLink(`a custom ${product.name}: ${summary}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-muted underline-offset-4 hover:text-linen hover:underline"
                >
                  Ask about this build on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
