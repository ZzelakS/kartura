"use client";

import { useEffect, useRef } from "react";

/** A single shared viewport canvas: decorative, non-interactive gold silk waves. */
export default function GoldWaves() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let teardown: (() => void) | undefined;

    const start = async () => {
      if (motion.matches || disposed) return;
      const THREE = await import("three");
      if (disposed || motion.matches) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      } catch {
        // The CSS gold glow remains when WebGL is unavailable.
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 2;
      const narrow = window.innerWidth < 768;
      const strands = narrow ? 9 : 15;
      const samples = narrow ? 100 : 150;
      const ribbons: { geometry: InstanceType<typeof THREE.BufferGeometry>; material: InstanceType<typeof THREE.LineBasicMaterial>; band: number; strand: number }[] = [];
      for (let band = 0; band < 3; band++) {
        for (let strand = 0; strand < strands; strand++) {
          const geometry = new THREE.BufferGeometry();
          const attribute = new THREE.BufferAttribute(new Float32Array(samples * 3), 3);
          attribute.setUsage(THREE.DynamicDrawUsage);
          geometry.setAttribute("position", attribute);
          const material = new THREE.LineBasicMaterial({
            color: strand % 4 === 0 ? 0xf2d393 : 0xbd8c3d,
            transparent: true,
            opacity: (narrow ? 0.13 : 0.19) * (0.45 + Math.sin(strand / strands * Math.PI) * 0.55),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          scene.add(new THREE.Line(geometry, material));
          ribbons.push({ geometry, material, band, strand });
        }
      }
      let scroll = window.scrollY;
      let frame = 0;
      let previous = -Infinity;
      let elapsed = 0;
      let lastTime = 0;
      const resize = () => renderer.setSize(window.innerWidth, window.innerHeight);
      const onScroll = () => { scroll = window.scrollY; };
      const draw = (now: number) => {
        frame = 0;
        if (disposed || document.hidden || motion.matches) return;
        if (now - previous >= 1000 / 30) {
          elapsed += lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
          lastTime = now;
          previous = now;
          const phase = elapsed * 0.21 + scroll * 0.00025;
          for (const { geometry, band, strand } of ribbons) {
            const positions = geometry.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
            for (let i = 0; i < samples; i++) {
              const u = i / (samples - 1);
              const offset = (strand - strands / 2) * 0.012;
              // Curving ribbons travel along the edges, leaving the reading area clear.
              if (band < 2) {
                const side = band === 0 ? -1 : 1;
                positions.setXYZ(i, side * (0.94 + 0.11 * Math.sin(u * 8 + phase + band) + 0.045 * Math.sin(u * 15 - phase * 0.6)) + offset * Math.sin(u * Math.PI), u * 2.5 - 1.25, 0);
              } else {
                positions.setXYZ(i, u * 2.5 - 1.25, -1.04 + 0.12 * Math.sin(u * 7 + phase * 0.7) + offset * Math.sin(u * Math.PI), 0);
              }
            }
            positions.needsUpdate = true;
          }
          renderer.render(scene, camera);
        }
        frame = requestAnimationFrame(draw);
      };
      const visibility = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        if (!document.hidden && !motion.matches && !disposed) frame = requestAnimationFrame(draw);
      };
      resize();
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", visibility);
      visibility();
      teardown = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", visibility);
        ribbons.forEach(({ geometry, material }) => { geometry.dispose(); material.dispose(); });
        renderer.dispose();
        renderer.domElement.remove();
      };
    };
    const changeMotion = () => {
      teardown?.();
      teardown = undefined;
      if (!motion.matches) void start().catch(() => {});
    };
    motion.addEventListener("change", changeMotion);
    void start().catch(() => {});
    return () => {
      disposed = true;
      motion.removeEventListener("change", changeMotion);
      teardown?.();
    };
  }, []);

  return <div ref={host} className="gold-wave-layer" aria-hidden="true" />;
}
