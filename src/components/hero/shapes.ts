import * as THREE from "three";

/** Flacon: lathed body, closed base, collar ring, stopper. */
export function bottleParts(): THREE.BufferGeometry[] {
  const profile = [
    new THREE.Vector2(0.002, -0.95),
    new THREE.Vector2(0.5, -0.95),
    new THREE.Vector2(0.58, -0.84),
    new THREE.Vector2(0.58, 0.3),
    new THREE.Vector2(0.49, 0.52),
    new THREE.Vector2(0.16, 0.63),
    new THREE.Vector2(0.16, 0.8),
  ];

  const body = new THREE.LatheGeometry(profile, 72);

  const base = new THREE.CircleGeometry(0.5, 48);
  base.rotateX(Math.PI / 2);
  base.translate(0, -0.95, 0);

  const collar = new THREE.TorusGeometry(0.18, 0.032, 10, 40);
  collar.rotateX(Math.PI / 2);
  collar.translate(0, 0.73, 0);

  const stopper = new THREE.CylinderGeometry(0.255, 0.255, 0.3, 48);
  stopper.translate(0, 0.95, 0);

  return [body, base, collar, stopper];
}

/** Purse: extruded body with a softened base, arc handle, clasp. */
export function purseParts(): THREE.BufferGeometry[] {
  const shape = new THREE.Shape();
  const wTop = 0.8;
  const wBottom = 0.6;
  const yBottom = -0.8;
  const yTop = 0.36;
  const radius = 0.2;

  shape.moveTo(-wTop, yTop);
  shape.lineTo(-wBottom, yBottom + radius);
  shape.quadraticCurveTo(-wBottom, yBottom, -wBottom + radius, yBottom);
  shape.lineTo(wBottom - radius, yBottom);
  shape.quadraticCurveTo(wBottom, yBottom, wBottom, yBottom + radius);
  shape.lineTo(wTop, yTop);
  shape.closePath();

  const shell = new THREE.ExtrudeGeometry(shape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: 20,
  });
  shell.translate(0, 0, -0.2);

  const handle = new THREE.TorusGeometry(0.42, 0.035, 10, 64, Math.PI);
  handle.translate(0, 0.36, 0);

  const clasp = new THREE.BoxGeometry(0.26, 0.14, 0.07);
  clasp.translate(0, 0.3, 0.26);

  return [shell, handle, clasp];
}

/**
 * Sillage: a rising, widening swirl. Generated directly rather than sampled,
 * because the shape is the dispersal itself and has no surface.
 *
 * `spread` narrows the swirl on portrait viewports, where a wide plume would
 * otherwise run past the edges of the screen.
 */
export function plumeCloud(count: number, spread = 1): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const radius = (0.1 + Math.pow(t, 1.5) * 1.2 + Math.random() * 0.2) * spread;
    const angle = t * 5.4 + Math.random() * 1.0 + (i % 2) * Math.PI;
    out[i * 3] = Math.cos(angle) * radius;
    out[i * 3 + 1] = -1.25 + t * 2.7;
    out[i * 3 + 2] = Math.sin(angle) * radius * 0.75;
  }
  return out;
}

export function disposeAll(parts: THREE.BufferGeometry[]): void {
  parts.forEach((p) => p.dispose());
}
