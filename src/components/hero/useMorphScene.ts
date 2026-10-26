"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { bottleParts, disposeAll, plumeCloud, purseParts } from "./shapes";
import { sampleShape } from "./sampling";
import { pulseEnvelope } from "./pulse";
import { fragmentShader, vertexShader } from "./shaders";
import type { Theme } from "@/lib/theme";

const FOV = 38;

/**
 * Dark mode uses additive blending, which is what makes the cloud glow. That
 * technique only works over a dark background: added onto paper it washes out
 * to white. Light mode switches to normal blending with dark ink particles, so
 * the shape reads as pigment rather than light.
 */
const palettes = {
  dark: {
    a: "#E0A45C",
    b: "#8FA07C",
    c: "#EFE7DA",
    blending: THREE.AdditiveBlending,
    tint: 1.6,
  },
  light: {
    a: "#8A5A22",
    b: "#4B5739",
    c: "#2A211C",
    blending: THREE.NormalBlending,
    tint: 0.72,
  },
} as const;

type Options = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  panelRefs: RefObject<HTMLDivElement | null>[];
  theme: Theme;
};

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** Trapezoid window with soft edges, used to cross-fade the three text panels. */
function band(p: number, start: number, end: number, fade = 0.06): number {
  return Math.min(clamp01((p - start) / fade), clamp01((end - p) / fade));
}

export function useMorphScene({ canvasRef, stageRef, panelRefs, theme }: Options): void {
  // Held so a theme change can repaint the existing cloud instead of rebuilding
  // thirty thousand points.
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = motionPreference.matches;
    const portrait = window.innerWidth < 720;
    const count = portrait ? 13000 : 30000;

    const bottle = bottleParts();
    const purse = purseParts();
    const posA = sampleShape(bottle, count);
    const posB = sampleShape(purse, count);
    const posC = plumeCloud(count, portrait ? 0.74 : 1);
    disposeAll(bottle);
    disposeAll(purse);

    const rand = new Float32Array(count);
    const drift = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      rand[i] = Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const m = 0.3 + Math.random() * 0.9;
      drift[i * 3] = Math.sin(phi) * Math.cos(theta) * m;
      drift[i * 3 + 1] = Math.cos(phi) * m;
      drift[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * m;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(posA, 3));
    geometry.setAttribute("posB", new THREE.BufferAttribute(posB, 3));
    geometry.setAttribute("posC", new THREE.BufferAttribute(posC, 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geometry.setAttribute("aDrift", new THREE.BufferAttribute(drift, 3));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const palette = palettes[theme];

    const uniforms = {
      uMix1: { value: 0 },
      uMix2: { value: 0 },
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uSize: { value: 9 },
      uDpr: { value: dpr },
      uIdle: { value: reduced ? 0 : 1 },
      // Turbulence throws particles outward mid-transition. On a narrow screen
      // that is the difference between fitting and spilling past the edge.
      uTurbulence: { value: portrait ? 0.3 : 0.5 },
      uOpacity: { value: 0 },
      uTint: { value: palette.tint },
      uColorA: { value: new THREE.Color(palette.a) },
      uColorB: { value: new THREE.Color(palette.b) },
      uColorC: { value: new THREE.Color(palette.c) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: palette.blending,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;

    const group = new THREE.Group();
    group.add(points);
    group.rotation.y = -0.35;

    const scene = new THREE.Scene();
    scene.add(group);

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    /**
     * Pull the camera back far enough that the widest silhouette fits the
     * viewport horizontally as well as vertically. A phone in portrait has a
     * narrow horizontal field of view, which is what pushed the cloud past the
     * screen edges before.
     */
    const fit = (width: number, height: number) => {
      const aspect = width / height;
      const halfAngle = Math.tan((FOV * Math.PI) / 360);

      // Measured off the normalised shapes: the purse is the widest silhouette,
      // the plume the tallest, plus room for turbulence.
      const halfHeight = 1.42;
      const halfWidth = portrait ? 1.3 : 1.75;

      const forHeight = halfHeight / halfAngle;
      const forWidth = halfWidth / (halfAngle * aspect);

      camera.position.z = Math.min(8.4, Math.max(4.2, Math.max(forHeight, forWidth) * 1.06));
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      fit(w, h);
      camera.updateProjectionMatrix();
      // Points shrink as the camera retreats, so give some of that back.
      const distanceBoost = camera.position.z / 4.8;
      uniforms.uSize.value = 9 * Math.min(1.4, Math.max(0.7, h / 900)) * distanceBoost;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    // Pointer parallax is a mouse affordance. On touch it only fights the scroll.
    if (!reduced && !portrait) window.addEventListener("pointermove", onPointerMove);

    // A click (not pointerdown) allows touch scrolling without accidental pulses.
    // Links and commerce controls keep their normal behavior.
    let pulseStarted = -Infinity;
    const onResonate = (event: MouseEvent) => {
      if (motionPreference.matches) return;
      const target = event.target;
      if (target instanceof Element &&
          target.closest("a, button, input, select, textarea")) return;
      pulseStarted = performance.now();
    };
    stage.addEventListener("click", onResonate);

    const clock = new THREE.Clock();
    let frame = 0;
    let mix1 = 0;
    let mix2 = 0;
    let opacity = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);

      const rect = stage.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = clamp01(-rect.top / Math.max(1, span));

      const target1 = clamp01((p - 0.08) / 0.34);
      const target2 = clamp01((p - 0.5) / 0.34);

      // Damped follow keeps the morph silky even on a jumpy trackpad.
      mix1 += (target1 - mix1) * 0.09;
      mix2 += (target2 - mix2) * 0.09;

      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      const targetOpacity = visible ? clamp01(1 - (p - 0.9) / 0.1) : 0;
      opacity += (targetOpacity - opacity) * 0.1;

      uniforms.uMix1.value = mix1;
      uniforms.uMix2.value = mix2;
      uniforms.uOpacity.value = opacity;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uPulse.value = motionPreference.matches ? 0 :
        pulseEnvelope((performance.now() - pulseStarted) / 1000);

      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      // A narrower swing on portrait keeps the widest silhouette inside the
      // frame through the whole rotation.
      const swing = portrait ? 0.12 : 0.22;
      const idle = reduced ? 0 : Math.sin(clock.getElapsedTime() * 0.16) * swing;
      group.rotation.y = -0.35 + idle + pointer.x * 0.28;
      group.rotation.x = pointer.y * 0.12;
      group.position.y = -p * 0.35;

      const windows: [number, number][] = [
        [-0.1, 0.3],
        [0.4, 0.62],
        [0.72, 1.1],
      ];
      panelRefs.forEach((ref, i) => {
        const node = ref.current;
        if (!node) return;
        const o = band(p, windows[i][0], windows[i][1]);
        node.style.opacity = String(o);
        node.style.transform = `translateY(${(1 - o) * 14}px)`;
      });

      if (visible || opacity > 0.002) renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      window.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("click", onResonate);
      materialRef.current = null;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
    // Theme is handled by the effect below, so toggling does not resample.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, stageRef, panelRefs]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;

    const palette = palettes[theme];
    material.uniforms.uColorA.value.set(palette.a);
    material.uniforms.uColorB.value.set(palette.b);
    material.uniforms.uColorC.value.set(palette.c);
    material.uniforms.uTint.value = palette.tint;
    material.blending = palette.blending;
    material.needsUpdate = true;
  }, [theme]);
}
