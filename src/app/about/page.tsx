import Image from "next/image";
import type { Metadata } from "next";
import story from "@/data/about.json";
import SiteHeader from "@/components/ui/SiteHeader";
import SiteFooter from "@/components/sections/SiteFooter";
import CartDrawer from "@/components/ui/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "The Journey to Karturah — Our Story",
  description: story.subtitle,
};

export default function About() {
  return (
    <div id="top" className="about-page bg-ink">
      <SiteHeader />
      <main id="main-content">
        <header className="story-hero">
          <div className="story-hero-inner">
            <p className="eyebrow">The founder’s story</p>
            <h1>{story.title}</h1>
            <p className="story-subtitle">{story.subtitle}</p>
            <a className="story-start" href="#chapter-1">Read the story <span aria-hidden="true">↓</span></a>
          </div>
          <figure className="story-hero-photo"><Image src="/images/karturah-perfume-filled.png" alt="Golden perfume in Karturah’s signature black-label bottle" width={1024} height={1536} sizes="(max-width: 767px) 100vw, 40vw" priority /></figure>
        </header>
        <div className="story-layout">
          <aside className="story-index">
            <nav aria-label="Story chapters">
              <p className="eyebrow">In this story</p>
              {story.sections.map((section, i) => (
                <a href={`#chapter-${i + 1}`} key={i}>
                  <span className="chapter-number">0{i + 1}</span>
                  <span>{section.title ?? "The beginning"}</span>
                </a>
              ))}
            </nav>
            <div className="story-brand"><Image src="/images/karturah-logo-transparent.png" alt="Karturah — Made to Resonate" width={1254} height={1254} sizes="250px" /></div>
          </aside>
          <article className="story-prose" aria-label={story.title}>
            {story.sections.map((section, i) => (
              <section id={`chapter-${i + 1}`} key={i} aria-label={section.title ?? "The beginning"}>
                {i === 4 && <figure className="story-bar-photo"><Image src="/images/fragrance-bar.jpeg" alt="The illuminated Karturah Fragrance Bar" width={1087} height={1447} sizes="(max-width: 767px) 100vw, 680px" /></figure>}
                {section.title && <><span className="eyebrow" aria-hidden="true">0{i + 1} / The journey</span><h2>{section.title}</h2></>}
                {section.paragraphs.map((paragraph, j) => <p key={j}>{paragraph}</p>)}
              </section>
            ))}
          </article>
        </div>
        <div className="story-end"><span className="eyebrow">Karturah · Made to Resonate</span><a href="/#fragrance">Discover the fragrances <span aria-hidden="true">↗</span></a></div>
      </main>
      <SiteFooter />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
