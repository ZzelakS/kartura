"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { createOrder } from "@/lib/convex-functions";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/pricing";
import { site } from "@/lib/site.config";
import { imagekitUrl } from "@/lib/imagekit";

export default function CartDrawer() {
  const { items, isOpen, setOpen, remove, clear, subtotalCents, count } = useCart();
  const [placing, setPlacing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const placeOrder = useMutation(createOrder);

  if (!isOpen) return null;

  const handoff = (reference: string) => {
    const lines = items.map((i) => `${i.quantity} × ${i.name} (${i.detail})`).join("\n");
    const text = `${reference}\n${lines}\nSubtotal ${formatPrice(subtotalCents)}`;
    window.open(
      `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener",
    );
  };

  const checkout = async () => {
    setPlacing(true);
    setNotice(null);
    try {
      const orderId = await placeOrder({
        items: items.map((i) => ({
          name: i.name,
          detail: i.detail,
          unitPriceCents: i.unitPriceCents,
          quantity: i.quantity,
        })),
        subtotalCents,
      });
      // Stripe session would be created here and the customer redirected.
      // Until keys are wired up, hand the order reference to the studio.
      handoff(`Order ${String(orderId).slice(-6).toUpperCase()}`);
      clear();
      setOpen(false);
    } catch {
      // Convex is not reachable yet. Do not strand the customer: send the
      // basket through anyway and let the studio record it by hand.
      handoff("New order (not yet recorded)");
      setNotice("We sent your basket to the studio by message. Someone will confirm shortly.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/60"
      />
      <aside
        role="dialog"
        aria-label="Cart"
        className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-bark px-5 py-6 sm:px-6"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Cart ({count})</h2>
          <button type="button" onClick={() => setOpen(false)} className="text-[13px] text-muted">
            Close
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-[15px] leading-[1.8] text-muted">
              Nothing here yet. Start with a 15 ml bottle, or build a bag below.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.key} className="border-t border-linen/10 py-5">
                <div className="flex justify-between gap-4">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagekitUrl(item.image, { width: 140, crop: "at_max" })}
                      alt=""
                      loading="lazy"
                      className="h-16 w-16 shrink-0 object-cover"
                    />
                  ) : null}
                  <div className="flex-1">
                    <p className="text-[15px]">
                      {item.quantity > 1 ? `${item.quantity} × ` : ""}
                      {item.name}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.7] text-muted">{item.detail}</p>
                  </div>
                  <span className="whitespace-nowrap text-[14px]">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.key)}
                  className="mt-3 text-[12px] text-muted underline-offset-4 hover:text-linen hover:underline"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-linen/10 pt-5">
            <div className="flex justify-between text-[15px]">
              <span>Subtotal</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <p className="mt-2 text-[13px] text-muted">{site.shippingNote}</p>
            {notice ? <p className="mt-3 text-[13px] text-sage">{notice}</p> : null}
            <button
              type="button"
              onClick={() => void checkout()}
              disabled={placing}
              className="mt-5 w-full border border-amber bg-amber py-3 text-[13px] tracking-wide text-ink disabled:opacity-60"
            >
              {placing ? "Placing order" : "Checkout"}
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
