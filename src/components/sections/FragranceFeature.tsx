import Image from "next/image";

export default function FragranceFeature() {
  return (
    <section className="fragrance-feature" aria-labelledby="fragrance-feature-title">
      <div className="feature-photo">
        <Image src="/images/karturah-perfume-filled.png" alt="Karturah perfume, filled with golden fragrance, with a black and gold label" width={1024} height={1536} sizes="(max-width: 767px) 100vw, 50vw" />
        <span className="photo-note">Karturah / Made to Resonate</span>
      </div>
      <div className="feature-copy">
        <p className="eyebrow">Fragrance, with feeling</p>
        <h2 id="fragrance-feature-title">A presence.<br />A memory.<br /><em>A resonance.</em></h2>
        <p>A beautiful fragrance doesn’t simply sit on your skin. It can remind you of a person, a season, a place or even a version of yourself you had almost forgotten.</p>
        <a className="brand-button" href="#fragrance">Explore the fragrances <span aria-hidden="true">↗</span></a>
        <div className="feature-footnote"><span>01 / Fragrance</span><a href="/about">Discover our story <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  );
}
