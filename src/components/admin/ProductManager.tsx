"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { adminAllProducts, adminDeleteProduct, adminSaveProduct, type ProductDoc, type ProductInput } from "@/lib/convex-functions";
import { categories, labelOf, type Category, type ProductImage } from "@/data/catalog";
import { formatPrice } from "@/lib/pricing";
import ImageUploader from "./ImageUploader";
import { Button, Field, MoneyInput, NumberInput, TextArea, TextInput, Toggle, slugify } from "./Fields";

type Status = "coming_soon" | "out_of_stock" | "live";
type Draft = ProductInput;
const statuses: { value: Status; label: string }[] = [
  { value: "coming_soon", label: "Coming Soon" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "live", label: "Live" },
];
const blank = (category: Category, order: number): Draft => ({
  slug: "", name: "", line: "", category, images: [], published: true, order,
  status: "coming_soon", sizes: category === "perfumes" ? [{ id: "50", label: "50 ml", ml: 50, priceCents: 0 }] : undefined,
  basePriceCents: category === "perfumes" ? undefined : 0,
});
function toDraft(row: ProductDoc): Draft {
  const { _id, _creationTime, ...fields } = row;
  void _creationTime;
  return { ...fields, id: _id, status: fields.status ?? "coming_soon" };
}
export default function ProductManager() {
  const rows = useQuery(adminAllProducts, {});
  const save = useMutation(adminSaveProduct);
  const remove = useMutation(adminDeleteProduct);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const patch = (update: Partial<Draft>) => setDraft((current) => current ? { ...current, ...update } : current);
  async function commit() {
    if (!draft) return;
    setBusy(true); setError(null);
    try {
      const slug = draft.slug.trim() || slugify(draft.name);
      await save({ ...draft, slug });
      setDraft(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save product.");
    } finally { setBusy(false); }
  }
  if (rows === undefined) return <p className="text-muted">Loading products…</p>;
  if (draft) return <div className="max-w-3xl">
    <h1 className="font-display text-2xl">{draft.id ? `Edit ${draft.name}` : "New product"}</h1>
    <div className="mt-8 space-y-6">
      <Field label="Product category"><div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category.id} type="button" onClick={() => patch({ category: category.id, sizes: category.id === "perfumes" ? (draft.sizes?.length ? draft.sizes : blank("perfumes", 0).sizes) : undefined, basePriceCents: category.id === "perfumes" ? undefined : (draft.basePriceCents ?? 0) })} className={`border px-4 py-2 text-sm ${draft.category === category.id ? "border-amber text-amber" : "border-linen/20 text-muted"}`}>{category.label}</button>)}</div></Field>
      <Field label="Product name"><TextInput value={draft.name} onChange={(name) => patch({ name })} /></Field>
      <Field label="Slug" hint="Leave blank to generate from product name"><TextInput value={draft.slug} onChange={(slug) => patch({ slug })} /></Field>
      <Field label="Availability status"><div className="flex flex-wrap gap-2">{statuses.map((status) => <button key={status.value} type="button" aria-pressed={(draft.status ?? "coming_soon") === status.value} onClick={() => patch({ status: status.value })} className={`border px-4 py-2 text-sm ${(draft.status ?? "coming_soon") === status.value ? "border-amber bg-amber text-ink" : "border-linen/20 text-muted"}`}>{status.label}</button>)}</div><p className="mt-2 text-xs text-muted">Coming Soon hides all prices and details. Out of Stock displays its status. Live displays prices and product details.</p></Field>
      <Field label="Description" hint="Shown only when Live"><TextArea value={draft.line ?? ""} onChange={(line) => patch({ line })} /></Field>
      {draft.category === "perfumes" ? <div className="space-y-4"><p className="text-sm text-sage">Perfume sizes and prices (visible only when Live)</p>{(draft.sizes ?? []).map((size, index) => <div key={index} className="grid gap-3 border-t border-linen/10 pt-4 sm:grid-cols-3"><Field label="Size label"><TextInput value={size.label} onChange={(label) => patch({ sizes: (draft.sizes ?? []).map((s, i) => i === index ? { ...s, label, id: slugify(label) } : s) })} /></Field><Field label="Volume (ml)"><NumberInput value={size.ml} onChange={(ml) => patch({ sizes: (draft.sizes ?? []).map((s, i) => i === index ? { ...s, ml } : s) })} /></Field><Field label="Price"><MoneyInput cents={size.priceCents} onChange={(priceCents) => patch({ sizes: (draft.sizes ?? []).map((s, i) => i === index ? { ...s, priceCents } : s) })} /></Field><button className="text-left text-xs text-muted hover:text-amber" onClick={() => patch({ sizes: (draft.sizes ?? []).filter((_, i) => i !== index) })}>Remove size</button></div>)}<button type="button" className="text-sm text-amber" onClick={() => patch({ sizes: [...(draft.sizes ?? []), { id: `size-${Date.now()}`, label: "", ml: 0, priceCents: 0 }] })}>+ Add size</button><div className="grid gap-4 sm:grid-cols-3">{(["top", "heart", "base"] as const).map((key) => <Field key={key} label={`${key[0].toUpperCase()}${key.slice(1)} notes`}><TextInput value={draft.notes?.[key] ?? ""} onChange={(value) => patch({ notes: { top: draft.notes?.top ?? "", heart: draft.notes?.heart ?? "", base: draft.notes?.base ?? "", [key]: value } })} /></Field>)}</div></div> : <><Field label="Price" hint="Only shown when Live"><MoneyInput cents={draft.basePriceCents ?? 0} onChange={(basePriceCents) => patch({ basePriceCents })} /></Field><Field label="Dimensions" hint="Optional; only shown when Live"><TextInput value={draft.dimensions ?? ""} onChange={(dimensions) => patch({ dimensions })} /></Field></>}
      <div><p className="text-sm text-sage">Product photos</p><div className="mt-3"><ImageUploader images={draft.images ?? []} onChange={(images: ProductImage[]) => patch({ images })} folder={`/kartura/${draft.category}`} /></div></div>
      <div className="flex items-center gap-4"><Toggle on={draft.published} onChange={(published) => patch({ published })} /><span className="text-sm text-muted">{draft.published ? "Visible on the storefront" : "Hidden (draft)"}</span></div>
      {error && <p className="text-sm text-amber">{error}</p>}
      <div className="flex gap-3 border-t border-linen/10 pt-6"><Button onClick={() => void commit()} disabled={busy}>{busy ? "Saving…" : "Save product"}</Button><Button tone="quiet" onClick={() => setDraft(null)}>Cancel</Button></div>
    </div>
  </div>;
  const visible = filter === "all" ? rows : rows.filter((row) => row.category === filter);
  return <div className="max-w-4xl"><div className="flex items-center justify-between gap-4"><h1 className="font-display text-2xl">Products</h1><Button onClick={() => setDraft(blank("perfumes", rows.length + 1))}>New product</Button></div>
    <div className="mt-6 flex flex-wrap gap-2">{[{ id: "all" as const, label: "Everything" }, ...categories].map((category) => <button type="button" key={category.id} onClick={() => setFilter(category.id)} className={`border px-4 py-2 text-sm ${filter === category.id ? "border-amber text-amber" : "border-linen/20 text-muted"}`}>{category.label}</button>)}</div>
    <div className="mt-8">{visible.length === 0 ? <p className="text-muted">No products yet. Add your first product above.</p> : visible.map((row) => <div key={row._id} className="flex flex-wrap items-center justify-between gap-4 border-t border-linen/10 py-5"><div><p>{row.name} {!row.published && <span className="text-xs text-muted">(Hidden)</span>}</p><p className="mt-1 text-sm text-muted">{labelOf(row.category)} · {statuses.find((status) => status.value === (row.status ?? "coming_soon"))?.label}{(row.status === "live") ? ` · ${formatPrice(row.category === "perfumes" ? (row.sizes?.[0]?.priceCents ?? 0) : (row.basePriceCents ?? 0))}` : ""}</p></div><div className="flex gap-4 text-sm"><button onClick={() => setDraft(toDraft(row))} className="text-muted hover:text-linen">Edit</button><button className="text-muted hover:text-amber" onClick={() => { if (confirm(`Delete ${row.name}? This cannot be undone.`)) void remove({ id: row._id }); }}>Delete</button></div></div>)}<div className="border-t border-linen/10" /></div>
  </div>;
}
