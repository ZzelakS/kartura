const faqs = [
  {
    q: "What does Made to Resonate mean?",
    a: "A beautiful fragrance doesn't simply sit on your skin. It can remind you of a person, a season, a place, or even a version of yourself you had almost forgotten.",
  },
  {
    q: "How does the Fragrance Bar work?",
    a: "Guests smell, choose, and leave with a bottle made for the occasion, personalised with the celebration name and date. Karturah sets up, hosts the bar, and packs it down.",
  },
  {
    q: "Can I order custom favors for my celebration?",
    a: "Yes. Mini vials and monogrammed bottles can be personalised for birthdays and celebrations. Tell us the occasion and the number of guests, and we will work out the rest with you.",
  },
  {
    q: "What sizes do the perfumes come in?",
    a: "15 ml, 50 ml, and 100 ml. The 15 ml is refillable, so you can live with a scent before committing to a full bottle.",
  },
  {
    q: "How do I know when a product is available?",
    a: "Each product displays its current availability: Coming Soon, Out of Stock, or a live price when available.",
  },
  {
    q: "How do I book or enquire?",
    a: "Message Karturah on WhatsApp or Instagram — both links are in the Contact section below.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="relative z-10 overflow-x-hidden bg-bark px-5 pb-24 pt-28 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Good to know</p>
        <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">
          Questions, answered
        </h2>
        <p aria-hidden="true" className="victorian-ornament">✦ ✦ ✦</p>
        <div className="mt-10">
          {faqs.map((f) => (
            <div key={f.q} className="border-t border-linen/10 py-6">
              <h3 className="text-[17px] leading-snug">{f.q}</h3>
              <p className="mt-2 max-w-prose text-[15px] leading-[1.75] text-muted">{f.a}</p>
            </div>
          ))}
          <div className="border-t border-linen/10" />
        </div>
      </div>
    </section>
  );
}
