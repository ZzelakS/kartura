"use client";

import { useEffect, useRef, useState } from "react";
import media from "@/data/gallery.json";
import styles from "./GallerySection.module.css";

type Filter = "all" | "image" | "video";

export default function GallerySection() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const touchX = useRef<number | null>(null);
  const items = media.filter(item => filter === "all" || item.type === filter);
  const index = items.findIndex(item => item.id === activeId);
  const active = items[index];
  const opened = activeId !== null;

  useEffect(() => {
    if (!opened) return;
    const node = dialog.current;
    if (!node) return;
    const overflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      node.close();
      document.body.style.overflow = overflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [opened]);

  const move = (direction: number) => {
    if (items.length) setActiveId(items[(index + direction + items.length) % items.length].id);
  };

  return (
    <section id="gallery" className={styles.gallery} aria-labelledby="gallery-title">
      <div className={styles.heading}>
        <div><p className="eyebrow">The Karturah journal</p><h2 id="gallery-title">Moments made<br /><em>to stay with you.</em></h2></div>
        <p className={styles.intro}>A closer look at the scents, the celebrations, and the little details that make it personal. Step inside our world.</p>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter gallery">
          {([['all', 'All moments'], ['image', 'Photographs'], ['video', 'Films']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{value === 'all' ? media.length : media.filter(item => item.type === value).length}</span></button>)}
        </div>
        <span className={styles.hint}>Select a moment to explore ↗</span>
      </div>
      <div className={styles.masonry}>
        {items.map((item, i) => (
          <button className={`${styles.tile} ${styles[`shape${i % 5}`]}`} key={item.id} type="button" aria-label={`Open ${item.type === 'video' ? 'film' : 'photo'}: ${item.title}`} aria-haspopup="dialog" onClick={event => { trigger.current = event.currentTarget; setActiveId(item.id); }}>
            {item.type === 'video' ? <video src={`${item.src}#t=0.1`} muted playsInline preload="metadata" tabIndex={-1} aria-hidden="true" /> : <img src={item.src} alt={item.title} loading="lazy" decoding="async" />}
            <span className={styles.shade} />
            <span className={styles.kind}>{item.type === 'video' ? 'Film' : 'Photograph'}</span>
            {item.type === 'video' && <span className={styles.play} aria-hidden="true">▶</span>}
            <span className={styles.caption}><span>{item.title}</span><span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
      <p className={styles.endnote}>KARTURAH <span>◆</span> Made to Resonate</p>
      <dialog ref={dialog} className={styles.lightbox} aria-label="Karturah gallery viewer" aria-describedby="gallery-viewer-help" onCancel={() => setActiveId(null)} onClose={() => setActiveId(null)} onClick={event => { if (event.target === event.currentTarget) setActiveId(null); }} onKeyDown={event => {
        if (event.target instanceof HTMLVideoElement) return;
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      }}>
        {active && <div className={styles.viewer}>
          <div className={styles.viewerTop}><span>KARTURAH <span className={styles.viewerCount}>{String(index + 1).padStart(2, '0')} / {items.length}</span></span><button type="button" autoFocus onClick={() => setActiveId(null)} aria-label="Close gallery">✕</button></div>
          <div className={styles.stage}>
            <button type="button" className={styles.previous} onClick={() => move(-1)} aria-label="Previous item">‹</button>
            <div className={styles.media} onTouchStart={event => { touchX.current = event.touches[0].clientX; }} onTouchEnd={event => {
              if (active.type === 'image' && touchX.current !== null) {
                const delta = event.changedTouches[0].clientX - touchX.current;
                if (Math.abs(delta) > 60) move(delta < 0 ? 1 : -1);
              }
              touchX.current = null;
            }}>
              {active.type === 'video' ? <video key={active.id} src={active.src} controls playsInline preload="metadata" aria-label={active.title} /> : <img key={active.id} src={active.src} alt={active.title} />}
            </div>
            <button type="button" className={styles.next} onClick={() => move(1)} aria-label="Next item">›</button>
          </div>
          <div className={styles.viewerBottom}><p aria-live="polite">{active.title}</p><p id="gallery-viewer-help">{active.type === 'video' ? 'Press play to watch' : 'Use arrows to explore'} · Esc to close</p></div>
        </div>}
      </dialog>
    </section>
  );
}
