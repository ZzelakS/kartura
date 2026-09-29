"use client";

import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { site } from "@/lib/site.config";
import ThemeToggle from "./ThemeToggle";
import MobileMenu, { type NavLink } from "./MobileMenu";

const links: NavLink[] = [
  { href: "/#fragrance", label: "Fragrance" },
  { href: "/#bags", label: "Bags" },
  { href: "/#house", label: "The house" },
  { href: "/about", label: "Our story" },
];

export default function SiteHeader() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      // A little past the fold so the bar does not flicker on a small nudge.
      setScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The open panel is opaque, so the bar must be too or the wordmark sits on
  // nothing while the menu is up.
  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`site-header fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-5 transition-all duration-300 sm:px-6 md:px-12 ${
          solid
            ? "border-b border-linen/10 bg-ink/95 py-4 backdrop-blur-md supports-[backdrop-filter]:bg-ink/80"
            : "border-b border-transparent bg-transparent py-5 sm:py-6"
        }`}
      >
        <a
          href="/#top"
          onClick={closeMenu}
          className="font-display text-[19px] tracking-wordmark sm:text-[22px]"
        >
          {site.wordmark}
        </a>

        <nav className="flex items-center gap-5 text-[13px] tracking-wide md:gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hidden text-muted hover:text-linen md:inline">
              {l.label}
            </a>
          ))}

          <ThemeToggle className="-mr-1" />

          <button type="button" onClick={() => setOpen(true)} className="text-linen">
            Cart ({count})
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-mr-1 flex h-8 w-8 items-center justify-center text-linen md:hidden"
          >
            {/* Two bars that cross into an X. Cheaper than swapping icons and it
                animates rather than popping. */}
            <span className="relative block h-[10px] w-[19px]">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "top-[5px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "top-[5px] -rotate-45" : "top-[10px]"
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} links={links} />
    </>
  );
}
