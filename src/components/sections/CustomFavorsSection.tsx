import { whatsappLink } from "@/lib/site.config";

export default function CustomFavorsSection() {
  return (
    <section
      id="favors"
      className="relative z-10 overflow-x-hidden bg-ink px-5 pb-24 pt-28 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Made for your celebration</p>
        <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">
          Custom favors
        </h2>
        <p aria-hidden="true" className="victorian-ornament">✦ ✦ ✦</p>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.75] text-muted">
          Mini vials and monogrammed bottles, personalised for birthdays,
          celebrations, and special days — with your name, your date, and a
          scent your guests will remember. Tell us the occasion and the number
          of guests, and we will work out the rest with you.
        </p>
        <a
          href={whatsappLink("custom favors")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block border border-amber px-6 py-2.5 text-[13px] tracking-wide text-amber transition-colors hover:bg-amber hover:text-ink"
        >
          Enquire about favors
        </a>
      </div>
    </section>
  );
}
