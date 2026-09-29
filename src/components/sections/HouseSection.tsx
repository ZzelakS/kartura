import Image from "next/image";

export default function HouseSection() {
  return (
    <section id="house" className="house-editorial relative z-10 bg-ink">
      <div className="house-copy">
        <p className="eyebrow">The world of Karturah</p>
        <h2>A story still<br /><em>unfolding.</em></h2>
        <p>It carries something from the little girl who watched her father run his businesses.</p>
        <p>Something from the student with many dreams.</p>
        <p>And something from the woman I have become through all of it.</p>
        <a href="/about" className="house-story-link">The journey to Karturah <span aria-hidden="true">↗</span></a>
      </div>
      <figure className="house-photo">
        <Image src="/images/fragrance-bar.jpeg" alt="The Karturah Fragrance Bar, with a white canopy, gold rail and illuminated brand panel" width={1087} height={1447} sizes="(max-width: 767px) 100vw, 50vw" />
        <figcaption><span>Karturah Fragrance Bar</span><span>Behind the brand</span></figcaption>
      </figure>
    </section>
  );
}
