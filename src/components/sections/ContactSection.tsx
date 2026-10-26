import { site, whatsappLink } from "@/lib/site.config";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 overflow-x-hidden bg-ink px-5 pb-24 pt-28 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Book & enquire</p>
        <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">
          Talk to Karturah
        </h2>
        <p aria-hidden="true" className="victorian-ornament">✦ ✦ ✦</p>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.75] text-muted">
          For the Fragrance Bar, custom favors, fragrances, or bags — tell us
          the occasion and what you have in mind, and we will take it from there.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-amber px-6 py-2.5 text-[13px] tracking-wide text-amber transition-colors hover:bg-amber hover:text-ink"
          >
            Message us on WhatsApp
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-linen/20 px-6 py-2.5 text-[13px] tracking-wide text-linen transition-colors hover:border-linen/45"
          >
            @karturahofficial on Instagram
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-block border border-linen/20 px-6 py-2.5 text-[13px] tracking-wide text-linen transition-colors hover:border-linen/45"
          >
            {site.email}
          </a>
        </div>
        <p className="mt-8 text-[14px] leading-[1.8] text-muted">
          {site.address.line2}
        </p>
      </div>
    </section>
  );
}
