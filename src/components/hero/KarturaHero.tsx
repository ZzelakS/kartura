"use client";

import { useRef } from "react";
import { useMorphScene } from "./useMorphScene";
import { useTheme } from "@/lib/theme";
import { site } from "@/lib/site.config";

export default function KarturaHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const panelOne = useRef<HTMLDivElement | null>(null);
  const panelTwo = useRef<HTMLDivElement | null>(null);
  const panelThree = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef([panelOne, panelTwo, panelThree]).current;
  const { theme } = useTheme();

  useMorphScene({ canvasRef, stageRef, panelRefs, theme });

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      />
      {/* Veil colour follows the theme, so the edges darken on ink and lighten
          on paper instead of always fading to black. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, transparent 40%, var(--hero-veil) 100%)",
        }}
      />

      <section ref={stageRef} className="particle-stage relative z-10" aria-label="Interactive Karturah particle experience" style={{ height: "360vh" }}>
        <div className="hero-sticky sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
          <div className="relative w-full max-w-3xl text-center">
            <div ref={panelOne} className="absolute inset-x-0 top-[-34vh] sm:top-[-30vh]">
              <p className="hero-eyebrow eyebrow">Made to Resonate</p>
              <h1 className="font-display text-[clamp(3rem,13vw,8.5rem)] leading-[0.92] tracking-tight">
                {site.name}
              </h1>
              <p className="mx-auto mt-5 max-w-[30ch] text-[14px] leading-[1.75] text-muted sm:mt-6 sm:text-[15px] sm:leading-[1.8]">
                Fragrance that stays with you.
                A story that becomes your own.
              </p>
            </div>

            <div className="absolute inset-x-0 top-[22vh] sm:top-[18vh]">
              <div ref={panelTwo} style={{ opacity: 0 }}>
                <h2 className="font-display text-[clamp(1.9rem,6vw,3.6rem)] leading-[1.05]">
                  Bags and purses
                </h2>
                <p className="mx-auto mt-4 max-w-[34ch] text-[14px] leading-[1.7] text-muted sm:max-w-[36ch] sm:text-[15px]">
                  Cut and stitched on Clipper Mill Road. Pick the hide, the hardware, the lining and
                  the strap, and we build yours from there.
                </p>
              </div>

              <div ref={panelThree} className="absolute inset-x-0 top-0" style={{ opacity: 0 }}>
                <h2 className="font-display text-[clamp(1.9rem,6vw,3.6rem)] leading-[1.05]">
                  Sillage
                </h2>
                <p className="mx-auto mt-4 max-w-[34ch] text-[14px] leading-[1.7] text-muted sm:max-w-[36ch] sm:text-[15px]">
                  The part of a scent that stays in a room after you have left it. Every formula
                  here is built for that last hour.
                </p>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#fragrance" className="hero-shop">Discover the collection <span aria-hidden="true">↗</span></a>
            <a href="#house" className="hero-scroll">Explore our world <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
