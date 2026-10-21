"use client";

import { useMutation, useQuery } from "convex/react";
import { adminAllOrders, adminSetOrderStatus, type OrderDoc } from "@/lib/convex-functions";
import { formatPrice } from "@/lib/pricing";

const statuses: OrderDoc["status"][] = ["pending", "paid", "in_production", "shipped", "cancelled"];

const labels: Record<OrderDoc["status"], string> = {
  pending: "Pending",
  paid: "Paid",
  in_production: "In production",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export default function OrderManager() {
  const rows = useQuery(adminAllOrders, {});
  const setStatus = useMutation(adminSetOrderStatus);

  if (rows === undefined) return <p className="text-[14px] text-muted">Loading orders</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl">Orders</h1>

      <div className="mt-8">
        {rows.length === 0 ? (
          <p className="text-[15px] text-muted">No orders yet.</p>
        ) : (
          rows.map((order) => (
            <div key={order._id} className="border-t border-linen/10 py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="text-[15px]">
                    {order._id.slice(-6).toUpperCase()} · {formatPrice(order.subtotalCents)}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">
                    {new Date(order._creationTime).toLocaleString()}
                    {order.email ? ` · ${order.email}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void setStatus({ id: order._id, status: s })}
                      className={`border px-3 py-1.5 text-[12px] ${
                        order.status === s
                          ? "border-sage text-sage"
                          : "border-linen/15 text-muted hover:border-linen/40"
                      }`}
                    >
                      {labels[s]}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="mt-4 space-y-1 text-[13px] text-muted">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.quantity} × {item.name} — {item.detail}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
        <div className="border-t border-linen/10" />
      </div>
    </div>
  );
}
