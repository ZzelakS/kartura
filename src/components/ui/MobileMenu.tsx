"use client";

import { useEffect } from "react";
import { site, whatsappLink } from "@/lib/site.config";

export type NavLink = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
};

export default function MobileMenu({ open, onClose, links }: Props) {
  // Lock the page behind the panel and close on Escape.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[45] flex flex-col bg-ink md:hidden"
    >
      {/* Spacer matching the header, so the panel opens beneath the bar rather
          than covering the close button. */}
      <div className="h-[68px] shrink-0" />

      <nav className="flex flex-1 flex-col justify-center px-8 pb-24">
        {links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="border-b border-linen/10 py-5 font-display text-[32px] leading-tight first:border-t"
            style={{ animation: `menuIn 320ms ${i * 45}ms both ease-out` }}
          >
            {link.label}
          </a>
        ))}

        <div className="mt-10 space-y-3 text-[14px]">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="block text-muted"
          >
            Message us on WhatsApp
          </a>
          <a href={`mailto:${site.email}`} onClick={onClose} className="block text-muted">
            {site.email}
          </a>
          <p className="pt-4 text-[13px] leading-[1.8] text-muted">
            {site.address.line1}
            <br />
            {site.address.line2}
          </p>
        </div>
      </nav>

      <style>{`
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes menuIn { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}
