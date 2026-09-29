"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation } from "convex/react";
import { subscribeToNewsletter } from "@/lib/convex-functions";
import { site, whatsappLink } from "@/lib/site.config";

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const subscribe = useMutation(subscribeToNewsletter);

  const join = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("saving");
    try {
      await subscribe({ email: email.trim().toLowerCase() });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer
      id="contact"
      className="relative z-10 overflow-x-hidden bg-bark px-5 pb-12 pt-20 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="md:flex md:justify-between md:gap-16">
          <div>
            <a href="/#top" className="footer-brand" aria-label="Karturah home"><Image src="/images/karturah-logo-transparent.png" alt="Karturah — Made to Resonate" width={1280} height={1280} sizes="220px" /></a>
            <p className="mt-3 text-[14px] leading-[1.8] text-muted">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              Open {site.address.hours}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-linen underline-offset-4 hover:underline"
              >
                Message us on WhatsApp
              </a>
              <a
                href={`mailto:${site.email}`}
                className="text-muted underline-offset-4 hover:text-linen hover:underline"
              >
                {site.email}
              </a>
              <a href="/about" className="text-muted underline-offset-4 hover:text-linen hover:underline">Our story</a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline-offset-4 hover:text-linen hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="mt-12 w-full max-w-[360px] md:mt-0">
            <p className="text-[15px] leading-[1.7]">
              New releases, twice a season. No other mail.
            </p>
            <div className="mt-5 flex w-full min-w-0">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void join();
                }}
                placeholder="Email address"
                className="w-full min-w-0 flex-1 border border-r-0 border-linen/20 bg-transparent px-4 py-3 text-[14px] text-linen placeholder:text-muted/60 focus:border-amber focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void join()}
                disabled={status === "saving"}
                className="shrink-0 whitespace-nowrap border border-amber bg-amber px-4 py-3 text-[13px] tracking-wide text-ink disabled:opacity-60 sm:px-5"
              >
                {status === "saving" ? "Adding" : "Join the list"}
              </button>
            </div>
            <p className="mt-3 min-h-[20px] text-[13px] text-muted">
              {status === "done" ? "You are on the list." : null}
              {status === "error" ? "That address did not look right. Try again." : null}
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-linen/10 pt-8 text-[13px] text-muted md:flex md:justify-between">
          <p>
            {site.payments} {site.shippingNote}
          </p>
          <p className="mt-3 md:mt-0">
            <a
              href="/admin"
              className="text-muted underline-offset-4 hover:text-linen hover:underline"
            >
              Studio login
            </a>{" "}
            · © {new Date().getFullYear()} {site.name} ·{" "}
            <a
              href={site.builtBy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-linen underline-offset-4 hover:underline"
            >
              {site.builtBy.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
