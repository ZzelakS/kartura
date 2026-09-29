"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { adminOverview } from "@/lib/convex-functions";
import { formatPrice } from "@/lib/pricing";

export default function Overview() {
  const data = useQuery(adminOverview, {});

  if (data === undefined) return <p className="text-[14px] text-muted">Loading</p>;

  const stats = [
    {
      label: "Perfumes live",
      value: `${data.perfumesLive} of ${data.perfumes}`,
      href: "/admin/products",
    },
    { label: "Bags live", value: `${data.bagsLive} of ${data.bags}`, href: "/admin/products" },
    {
      label: "Purses live",
      value: `${data.pursesLive} of ${data.purses}`,
      href: "/admin/products",
    },
    { label: "Orders awaiting action", value: String(data.pendingOrders), href: "/admin/orders" },
    { label: "Taken so far", value: formatPrice(data.revenueCents), href: "/admin/orders" },
    { label: "On the mailing list", value: String(data.subscribers) },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl">Studio</h1>
      <p className="mt-3 text-[15px] leading-[1.8] text-muted">
        Everything on the shop is edited from here. Changes go live the moment you save.
      </p>

      <div className="mt-10 grid gap-px border border-linen/10 bg-linen/10 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const inner = (
            <div className="h-full bg-ink p-6">
              <p className="text-[13px] text-muted">{s.label}</p>
              <p className="mt-2 font-display text-3xl">{s.value}</p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="block hover:bg-bark">
              {inner}
            </Link>
          ) : (
            <div key={s.label}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
