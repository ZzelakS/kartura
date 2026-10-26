import { whatsappLink } from "@/lib/site.config";

export default function FragranceBarSection() {
  return (
    <section
      id="fragrance-bar"
      className="relative z-10 overflow-x-hidden bg-bark px-5 pb-24 pt-28 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Live at your event</p>
        <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">
          The Karturah Fragrance Bar
        </h2>
        <p aria-hidden="true" className="victorian-ornament">✦ ✦ ✦</p>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.75] text-muted">
          Guests smell, choose, and leave with a bottle made for the occasion —
          personalised with the celebration name and date. Karturah sets up,
          hosts the bar, and packs it down, so the host can simply enjoy the day.
        </p>
        <ul className="mt-8 grid gap-4 text-[15px] leading-[1.7] sm:grid-cols-3">
          <li className="border-t border-linen/10 pt-4">Six scents to try, with a scent menu and signage</li>
          <li className="border-t border-linen/10 pt-4">One personalised bottle per guest</li>
          <li className="border-t border-linen/10 pt-4">Setup, hosting, and breakdown included</li>
        </ul>
        <a
          href={whatsappLink("the Fragrance Bar")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block border border-amber px-6 py-2.5 text-[13px] tracking-wide text-amber transition-colors hover:bg-amber hover:text-ink"
        >
          Enquire about a date
        </a>
      </div>
    </section>
  );
}
