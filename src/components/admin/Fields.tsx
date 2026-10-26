"use client";

import type { ReactNode } from "react";

const base =
  "w-full border border-linen/20 bg-transparent px-3 py-2 text-[14px] text-linen placeholder:text-muted/50 focus:border-amber focus:outline-none";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] text-sage">{label}</span>
      {hint ? <span className="ml-2 text-[12px] text-muted">{hint}</span> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <input
      className={base}
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      className={base}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** Money is stored in cents and edited in dollars. */
export function MoneyInput({
  cents,
  onChange,
}: {
  cents: number;
  onChange: (cents: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] text-muted">$</span>
      <input
        className={base}
        inputMode="decimal"
        value={(cents / 100).toString()}
        onChange={(e) => {
          const n = Number.parseFloat(e.target.value);
          onChange(Number.isFinite(n) ? Math.round(n * 100) : 0);
        }}
      />
    </div>
  );
}

export function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      className={base}
      inputMode="numeric"
      value={String(value)}
      onChange={(e) => {
        const n = Number.parseInt(e.target.value, 10);
        onChange(Number.isFinite(n) ? n : 0);
      }}
    />
  );
}

export function Toggle({
  on,
  onChange,
  onLabel = "Live",
  offLabel = "Draft",
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={`border px-4 py-2 text-[13px] ${
        on ? "border-sage text-sage" : "border-linen/20 text-muted"
      }`}
    >
      {on ? onLabel : offLabel}
    </button>
  );
}

export function Button({
  children,
  onClick,
  tone = "primary",
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "primary" | "quiet" | "danger";
  disabled?: boolean;
}) {
  const styles = {
    primary: "border-amber bg-amber text-ink",
    quiet: "border-linen/20 text-linen hover:border-linen/45",
    danger: "border-linen/20 text-muted hover:border-amber hover:text-amber",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border px-5 py-2.5 text-[13px] tracking-wide disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  );
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
