"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  adminAllProducts,
  adminDeleteProduct,
  adminSaveProduct,
  type ProductDoc,
  type ProductInput,
} from "@/lib/convex-functions";
import {
  categories,
  kindOf,
  labelOf,
  leatherOptions,
  type Category,
  type ProductImage,
} from "@/data/catalog";
import { formatPrice } from "@/lib/pricing";
import ImageUploader from "./ImageUploader";
import {
  Button,
  Field,
  MoneyInput,
  NumberInput,
  TextArea,
  TextInput,
  Toggle,
  slugify,
} from "./Fields";

// Exactly what saveProduct accepts: both Convex system fields come off, `_id`
// travelling back as `id`. Sharing the type means the editor and the mutation
// cannot drift apart.
type Draft = ProductInput;
type Group = NonNullable<ProductDoc["options"]>[number];

const blankSizes = [
  { id: "15", label: "15 ml", ml: 15, priceCents: 0, note: "Travel size, refillable" },
  { id: "50", label: "50 ml", ml: 50, priceCents: 0 },
  { id: "100", label: "100 ml", ml: 100, priceCents: 0, note: "Best value per ml" },
];

function blank(category: Category, order: number): Draft {
  const base: Draft = {
    slug: "",
    name: "",
    line: "",
    category,
    images: [],
    published: false,
    order,
  };

  if (kindOf(category) === "fragrance") {
    return { ...base, sizes: blankSizes, notes: { top: "", heart: "", base: "" } };
  }
  return {
    ...base,
    basePriceCents: 0,
    dimensions: "",
    leadTime: "Made to order, about three weeks",
    options: leatherOptions,
    monogram: { addCents: 4000, maxChars: 3 },
  };
}

/**
 * Convex adds `_id` and `_creationTime` to every document and rejects them as
 * mutation arguments, so an existing row has to be stripped before it can be
 * edited. `_id` moves to `id`, which is what saveProduct expects.
 */
function toDraft(row: ProductDoc): Draft {
  const { _id, _creationTime, ...fields } = row;
  void _creationTime;
  return { ...fields, id: _id };
}

/**
 * Changing category mid-edit swaps which field set applies. The fields for the
 * other shape are dropped rather than carried along, so a perfume never ships
 * with a stale base price hiding in the row.
 */
function recategorise(draft: Draft, category: Category): Draft {
  if (kindOf(draft.category) === kindOf(category)) return { ...draft, category };
  const fresh = blank(category, draft.order);
  return {
    ...fresh,
    id: draft.id,
    slug: draft.slug,
    name: draft.name,
    line: draft.line,
    images: draft.images,
    published: draft.published,
  };
}

export default function ProductManager() {
  const rows = useQuery(adminAllProducts, {});
  const save = useMutation(adminSaveProduct);
  const remove = useMutation(adminDeleteProduct);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (p: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...p } : d));

  const patchGroup = (index: number, next: Group) => {
    if (!draft) return;
    const options = [...(draft.options ?? [])];
    options[index] = next;
    patch({ options });
  };

  const commit = async () => {
    if (!draft) return;
    setBusy(true);
    setError(null);
    try {
      await save({ ...draft, slug: draft.slug || slugify(draft.name) });
      setDraft(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  if (rows === undefined) return <p className="text-[14px] text-muted">Loading products</p>;

  if (draft) {
    const isFragrance = kindOf(draft.category) === "fragrance";

    return (
      <div className="max-w-3xl">
        <h1 className="font-display text-2xl">
          {draft.id ? `Edit ${draft.name || "product"}` : "New product"}
        </h1>

        <div className="mt-8 space-y-6">
          <div>
            <p className="text-[13px] text-sage">Product type</p>
            <p className="mt-1 text-[12px] text-muted">
              Perfumes are sold in volumes. Bags and purses are built to order from options.
            </p>
            <div className="mt-3 flex w-full flex-wrap gap-2">
              {categories.map((c) => {
                const active = draft.category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setDraft(recategorise(draft, c.id))}
                    aria-pressed={active}
                    className={`border px-4 py-2 text-[13px] ${
                      active
                        ? "border-amber text-amber"
                        : "border-linen/15 text-muted hover:border-linen/40"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Field label="Name">
            <TextInput
              value={draft.name}
              onChange={(name) => patch({ name, slug: draft.id ? draft.slug : slugify(name) })}
            />
          </Field>

          <Field label="Web address" hint="the slug used in links">
            <TextInput value={draft.slug} onChange={(slug) => patch({ slug: slugify(slug) })} />
          </Field>

          <Field label="Description">
            <TextArea value={draft.line} onChange={(line) => patch({ line })} />
          </Field>

          {isFragrance ? (
            <>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Top notes">
                  <TextInput
                    value={draft.notes?.top ?? ""}
                    onChange={(top) =>
                      patch({
                        notes: { ...(draft.notes ?? { heart: "", base: "" }), top } as never,
                      })
                    }
                  />
                </Field>
                <Field label="Heart notes">
                  <TextInput
                    value={draft.notes?.heart ?? ""}
                    onChange={(heart) =>
                      patch({
                        notes: { ...(draft.notes ?? { top: "", base: "" }), heart } as never,
                      })
                    }
                  />
                </Field>
                <Field label="Base notes">
                  <TextInput
                    value={draft.notes?.base ?? ""}
                    onChange={(base) =>
                      patch({
                        notes: { ...(draft.notes ?? { top: "", heart: "" }), base } as never,
                      })
                    }
                  />
                </Field>
              </div>

              <div>
                <p className="text-[13px] text-sage">Sizes</p>
                <p className="mt-1 text-[12px] text-muted">
                  Remove a row if you are not selling that volume.
                </p>
                <div className="mt-4 space-y-3">
                  {(draft.sizes ?? []).map((size, i) => (
                    <div key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_100px_1fr_auto]">
                      <Field label="Label">
                        <TextInput
                          value={size.label}
                          onChange={(label) => {
                            const sizes = [...(draft.sizes ?? [])];
                            sizes[i] = { ...size, label };
                            patch({ sizes });
                          }}
                        />
                      </Field>
                      <Field label="ml">
                        <NumberInput
                          value={size.ml}
                          onChange={(ml) => {
                            const sizes = [...(draft.sizes ?? [])];
                            sizes[i] = { ...size, ml, id: String(ml) };
                            patch({ sizes });
                          }}
                        />
                      </Field>
                      <Field label="Price">
                        <MoneyInput
                          cents={size.priceCents}
                          onChange={(priceCents) => {
                            const sizes = [...(draft.sizes ?? [])];
                            sizes[i] = { ...size, priceCents };
                            patch({ sizes });
                          }}
                        />
                      </Field>
                      <button
                        type="button"
                        onClick={() =>
                          patch({ sizes: (draft.sizes ?? []).filter((_, j) => j !== i) })
                        }
                        className="pb-2.5 text-[12px] text-muted hover:text-amber"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      sizes: [
                        ...(draft.sizes ?? []),
                        {
                          id: `new-${(draft.sizes ?? []).length}`,
                          label: "",
                          ml: 0,
                          priceCents: 0,
                        },
                      ],
                    })
                  }
                  className="mt-4 text-[13px] text-muted hover:text-linen"
                >
                  Add a size
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Base price" hint="before options">
                  <MoneyInput
                    cents={draft.basePriceCents ?? 0}
                    onChange={(basePriceCents) => patch({ basePriceCents })}
                  />
                </Field>
                <Field label="Dimensions">
                  <TextInput
                    value={draft.dimensions ?? ""}
                    onChange={(dimensions) => patch({ dimensions })}
                  />
                </Field>
                <Field label="Lead time">
                  <TextInput
                    value={draft.leadTime ?? ""}
                    onChange={(leadTime) => patch({ leadTime })}
                  />
                </Field>
              </div>

              <div>
                <p className="text-[13px] text-sage">Customisation</p>
                <p className="mt-1 text-[12px] text-muted">
                  Each group becomes a row of buttons on the shop. Extra costs are added to the base
                  price as the customer picks.
                </p>

                <div className="mt-5 space-y-6">
                  {(draft.options ?? []).map((group, gi) => (
                    <div key={gi} className="border border-linen/10 p-4">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <Field label="Group name">
                            <TextInput
                              value={group.label}
                              onChange={(label) =>
                                patchGroup(gi, { ...group, label, id: group.id || slugify(label) })
                              }
                            />
                          </Field>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            patch({ options: (draft.options ?? []).filter((_, j) => j !== gi) })
                          }
                          className="pb-2.5 text-[12px] text-muted hover:text-amber"
                        >
                          Remove group
                        </button>
                      </div>

                      <div className="mt-4">
                        <Field label="Note" hint="shown next to the group name">
                          <TextInput
                            value={group.help}
                            onChange={(help) => patchGroup(gi, { ...group, help })}
                          />
                        </Field>
                      </div>

                      <div className="mt-5 space-y-3">
                        {group.choices.map((choice, ci) => (
                          <div
                            key={ci}
                            className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_110px_auto]"
                          >
                            <Field label="Choice">
                              <TextInput
                                value={choice.label}
                                onChange={(label) => {
                                  const choices = [...group.choices];
                                  choices[ci] = {
                                    ...choice,
                                    label,
                                    id: choice.id || slugify(label),
                                  };
                                  patchGroup(gi, { ...group, choices });
                                }}
                              />
                            </Field>
                            <Field label="Extra cost">
                              <MoneyInput
                                cents={choice.addCents}
                                onChange={(addCents) => {
                                  const choices = [...group.choices];
                                  choices[ci] = { ...choice, addCents };
                                  patchGroup(gi, { ...group, choices });
                                }}
                              />
                            </Field>
                            <Field label="Swatch" hint="optional">
                              <input
                                type="color"
                                value={choice.swatch ?? "#1B1614"}
                                onChange={(e) => {
                                  const choices = [...group.choices];
                                  choices[ci] = { ...choice, swatch: e.target.value };
                                  patchGroup(gi, { ...group, choices });
                                }}
                                className="h-[38px] w-full border border-linen/20 bg-transparent"
                              />
                            </Field>
                            <button
                              type="button"
                              onClick={() =>
                                patchGroup(gi, {
                                  ...group,
                                  choices: group.choices.filter((_, j) => j !== ci),
                                })
                              }
                              className="pb-2.5 text-[12px] text-muted hover:text-amber"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          patchGroup(gi, {
                            ...group,
                            choices: [...group.choices, { id: "", label: "", addCents: 0 }],
                          })
                        }
                        className="mt-4 text-[13px] text-muted hover:text-linen"
                      >
                        Add a choice
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    patch({
                      options: [
                        ...(draft.options ?? []),
                        {
                          id: `group-${(draft.options ?? []).length}`,
                          label: "",
                          help: "",
                          choices: [],
                        },
                      ],
                    })
                  }
                  className="mt-4 text-[13px] text-muted hover:text-linen"
                >
                  Add a group
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Monogram cost">
                  <MoneyInput
                    cents={draft.monogram?.addCents ?? 0}
                    onChange={(addCents) =>
                      patch({ monogram: { maxChars: draft.monogram?.maxChars ?? 3, addCents } })
                    }
                  />
                </Field>
                <Field label="Monogram letters" hint="maximum">
                  <NumberInput
                    value={draft.monogram?.maxChars ?? 3}
                    onChange={(maxChars) =>
                      patch({ monogram: { addCents: draft.monogram?.addCents ?? 0, maxChars } })
                    }
                  />
                </Field>
              </div>
            </>
          )}

          <div>
            <p className="text-[13px] text-sage">Photos</p>
            <div className="mt-3">
              <ImageUploader
                images={draft.images ?? []}
                onChange={(images: ProductImage[]) => patch({ images })}
                folder={`/kartura/${draft.category}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Toggle on={draft.published} onChange={(published) => patch({ published })} />
            <span className="text-[13px] text-muted">
              {draft.published ? "Visible on the shop" : "Hidden until you set it live"}
            </span>
          </div>

          {error ? <p className="text-[13px] text-amber">{error}</p> : null}

          <div className="flex gap-3 border-t border-linen/10 pt-6">
            <Button onClick={() => void commit()} disabled={busy}>
              {busy ? "Saving" : "Save"}
            </Button>
            <Button tone="quiet" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const visible = filter === "all" ? rows : rows.filter((r) => r.category === filter);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-2xl">Products</h1>
        <Button onClick={() => setDraft(blank("perfumes", rows.length + 1))}>New product</Button>
      </div>

      <div className="mt-6 flex w-full flex-wrap gap-2">
        {[{ id: "all" as const, label: "Everything" }, ...categories].map((c) => {
          const active = filter === c.id;
          const n = c.id === "all" ? rows.length : rows.filter((r) => r.category === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id as Category | "all")}
              aria-pressed={active}
              className={`border px-4 py-2 text-[13px] ${
                active
                  ? "border-amber text-amber"
                  : "border-linen/15 text-muted hover:border-linen/40"
              }`}
            >
              {c.label} ({n})
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {visible.length === 0 ? (
          <p className="text-[15px] text-muted">
            Nothing here yet. Add a product, or run the seed script to load the starters.
          </p>
        ) : (
          visible.map((row) => (
            <div
              key={row._id}
              className="flex flex-wrap items-center justify-between gap-4 border-t border-linen/10 py-5"
            >
              <div>
                <p className="text-[16px]">
                  {row.name}{" "}
                  {row.published ? null : <span className="text-[12px] text-muted">Draft</span>}
                </p>
                <p className="mt-1 text-[13px] text-muted">
                  {labelOf(row.category)}
                  {" · "}
                  {row.sizes
                    ? row.sizes.map((s) => `${s.label} ${formatPrice(s.priceCents)}`).join(" · ")
                    : `From ${formatPrice(row.basePriceCents ?? 0)} · ${row.dimensions ?? ""}`}
                </p>
              </div>
              <div className="flex gap-4 text-[13px]">
                <button
                  type="button"
                  onClick={() => setDraft(toDraft(row))}
                  className="text-muted hover:text-linen"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete ${row.name}? This cannot be undone.`)) {
                      void remove({ id: row._id });
                    }
                  }}
                  className="text-muted hover:text-amber"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
        <div className="border-t border-linen/10" />
      </div>
    </div>
  );
}