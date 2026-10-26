"use client";
import ScentLibrary from "./ScentLibrary";
import { useQuery } from "convex/react";
import { listProducts, type ProductDoc } from "@/lib/convex-functions";
import { formatPrice } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site.config";
import ProductGallery from "@/components/ui/ProductGallery";
export default function FragranceSection() {
  const all = useQuery(listProducts, {});
  const items = (all ?? []).filter((product) => product.category === "perfumes");
  return items.length === 0 ? <ScentLibrary /> : <><ScentLibrary /><section id="available-fragrances" className="relative z-10 overflow-x-hidden bg-ink px-5 pb-24 pt-28 sm:px-6 md:px-12"><div className="mx-auto max-w-5xl"><h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">Available from the house</h2><p className="mt-4 text-[15px] text-muted">Explore our fragrance collection.</p><div className="mt-14">{all === undefined ? <p className="text-muted">Loading collection…</p> : items.length === 0 ? <p className="text-muted">Our fragrance collection is coming soon.</p> : items.map((product: ProductDoc) => <article key={product._id} className="border-t border-linen/10 py-12 lg:flex lg:gap-12"><ProductGallery images={product.images} name={product.name} className="-mx-5 mb-8 w-screen sm:-mx-6 sm:w-auto lg:mx-0 lg:mb-0 lg:w-[240px] lg:shrink-0"/><div className="flex-1"><h3 className="font-display text-3xl">{product.name}</h3>{product.status !== "live" ? <p className="mt-5 text-sm uppercase tracking-[0.2em] text-amber">{product.status === "out_of_stock" ? "Out of Stock" : "Coming Soon"}</p> : <><p className="mt-5 text-[15px] leading-relaxed">{product.line}</p><div className="mt-5 flex flex-wrap gap-3">{product.sizes?.map((size) => <a key={size.id} href={whatsappLink(`${product.name} ${size.label}`)} target="_blank" rel="noopener noreferrer" className="border border-amber px-4 py-3 text-sm text-amber">{size.label} · {formatPrice(size.priceCents)}</a>)}</div>{product.notes && <div className="mt-6">{(["top", "heart", "base"] as const).map((key) => product.notes?.[key] ? <p key={key} className="border-t border-linen/10 py-2 text-sm text-muted"><span className="mr-5 capitalize text-sage">{key}</span>{product.notes[key]}</p> : null)}</div>}</>}</div></article>)}<div className="border-t border-linen/10"/></div></div></section></>;
}
