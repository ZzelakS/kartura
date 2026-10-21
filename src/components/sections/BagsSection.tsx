"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { listProducts } from "@/lib/convex-functions";
import { formatPrice } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site.config";
import ProductGallery from "@/components/ui/ProductGallery";
type Filter = "all" | "bags" | "purses";
const filters: { id: Filter; label: string }[] = [{ id: "all", label: "Everything" }, { id: "bags", label: "Bags" }, { id: "purses", label: "Purses" }];
export default function BagsSection() {
  const all = useQuery(listProducts, {});
  const [filter, setFilter] = useState<Filter>("all");
  const leather = (all ?? []).filter((product) => product.category === "bags" || product.category === "purses");
  const items = filter === "all" ? leather : leather.filter((product) => product.category === filter);
  return <section id="bags" className="relative z-10 overflow-x-hidden bg-bark px-5 py-24 sm:px-6 md:px-12"><div className="mx-auto max-w-5xl"><h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">Bags and purses</h2><p className="mt-4 text-[15px] text-muted">Discover the Karturah collection.</p>{new Set(leather.map((product) => product.category)).size > 1 && <div className="mt-8 flex flex-wrap gap-2">{filters.map((item) => <button key={item.id} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} className={`border px-4 py-2 text-sm ${filter === item.id ? "border-amber text-amber" : "border-linen/15 text-muted"}`}>{item.label}</button>)}</div>}<div className="mt-10">{all === undefined ? <p className="text-muted">Loading collection…</p> : leather.length === 0 ? <p className="text-muted">Our bags and purses are coming soon.</p> : items.map((product) => <article key={product._id} className="border-t border-linen/10 py-12 lg:flex lg:gap-12"><ProductGallery images={product.images} name={product.name} className="-mx-5 mb-8 w-screen sm:-mx-6 sm:w-auto lg:mx-0 lg:mb-0 lg:w-[260px] lg:shrink-0"/><div><h3 className="font-display text-3xl">{product.name}</h3>{product.status !== "live" ? <p className="mt-5 text-sm uppercase tracking-[0.2em] text-amber">{product.status === "out_of_stock" ? "Out of Stock" : "Coming Soon"}</p> : <><p className="mt-5 text-xl text-amber">{formatPrice(product.basePriceCents ?? 0)}</p>{product.line && <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-muted">{product.line}</p>}{product.dimensions && <p className="mt-3 text-sm text-muted">{product.dimensions}</p>}<a href={whatsappLink(product.name)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block border border-amber px-6 py-2.5 text-sm text-amber">Enquire about this piece</a></>}</div></article>)}<div className="border-t border-linen/10"/></div></div></section>;
}
