"use client";
import { useMemo, useState } from "react";
import { scentPreview } from "@/data/scent-preview";
import { site } from "@/lib/site.config";

const groups = ["All scents", "Body perfumes", "Single perfumes", "Room fresheners"];
const pageSize = 5;

export default function ScentLibrary() {
  const [group, setGroup] = useState("All scents");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [expanded, setExpanded] = useState(true);
  const items = useMemo(() => scentPreview.filter(s =>
    (group === "All scents" || s.category === group) &&
    `${s.code} ${s.name} ${s.notes} ${s.feel}`.toLowerCase().includes(search.toLowerCase())
  ), [group, search]);
  const hero = scentPreview.find(s => s.hero)!;
  const shown = items.slice(0, visibleCount);

  return <section id="fragrance" className="scent-library" aria-labelledby="library-title">
    <div className="library-heading">
      <div><p className="eyebrow">The forthcoming collection / 22 expressions</p><h2 id="library-title">Find your <em>resonance.</em></h2></div>
      <p>Meet the collection before the first photographs.<br/>Explore the notes. Follow the feeling.<br/><span>All scents below are coming soon.</span></p>
    </div>
    <article className="hero-scent">
      <div className="hero-scent-title"><p className="eyebrow">The signature spotlight · {hero.code}</p><h3>Ms. Ceemee<span>✦</span></h3><p>Named for Simisola. Made to be remembered.</p></div>
      <div className="hero-scent-copy"><p className="eyebrow">Bold. Feminine. Fully you.</p><p>{hero.feel}</p><p className="spotlight-notes">Blackcurrant & mint / Hibiscus tea, rose & cinnamon / Vanilla, leather & musk</p><a href="#scent-index" onClick={() => setExpanded(true)}>Discover the collection</a></div>
    </article>
    <div id="scent-index" className="collection-toggle-row">
      <p className="eyebrow">The scent library</p>
      <button type="button" className="collection-toggle" aria-expanded={expanded} aria-controls="scent-list-panel" onClick={() => setExpanded(value => !value)}>{expanded ? "Hide collection" : "Show collection"}<span aria-hidden="true">{expanded ? "−" : "+"}</span></button>
    </div>
    <div id="scent-list-panel" hidden={!expanded}>
      <div className="library-tools">
        <div className="scent-filters" aria-label="Filter fragrance category">{groups.map(g => <button type="button" key={g} onClick={() => { setGroup(g); setVisibleCount(pageSize); }} aria-pressed={g === group}>{g}</button>)}</div>
        <label className="scent-search"><span className="sr-only">Search fragrances, notes or feelings</span><input type="search" value={search} onChange={e => { setSearch(e.target.value); setVisibleCount(pageSize); }} placeholder="Search a scent, note or feeling"/><span aria-hidden="true">⌕</span></label>
      </div>
      <p className="result-count" role="status">Showing {shown.length} of {items.length} {items.length === 1 ? "expression" : "expressions"}</p>
      <div className="scent-list">{shown.map(s => <details className={`scent-entry ${s.hero ? "signature-entry" : ""}`} key={s.code}>
        <summary><span className="scent-entry-code">{s.code}</span><span className="scent-entry-name">{s.name}<span className="scent-entry-category">{s.category}</span></span><span className="scent-entry-status">{s.hero ? "★ HERO · COMING SOON" : "COMING SOON"}</span><span className="scent-entry-symbol" aria-hidden="true">+</span></summary>
        <div className="scent-entry-body"><p className="scent-feeling">{s.feel}</p>{s.notes && <div><p className="eyebrow">The notes</p><p className="scent-notes">{s.notes}</p></div>}<a className="scent-enquiry" href={`mailto:${site.email}?subject=${encodeURIComponent("Fragrance enquiry: " + s.code + " " + s.name)}`}>Enquire about this scent</a></div>
      </details>)}</div>
      {items.length === 0 && <div className="empty-scents"><p>No scents match your search.</p><button type="button" onClick={() => { setSearch(""); setGroup("All scents"); setVisibleCount(pageSize); }}>Show all fragrances</button></div>}
      {shown.length < items.length && <div className="load-more-row"><button type="button" className="load-more-scents" onClick={() => setVisibleCount(count => count + pageSize)}>Load more</button><p>{items.length - shown.length} more to discover</p></div>}
    </div>
    <p className="library-note">A first introduction. Product imagery, sizes and pricing will follow.</p>
  </section>;
}
