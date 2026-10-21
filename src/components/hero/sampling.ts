import * as THREE from "three";

/** Total surface area of a geometry, used to split a point budget between parts. */
export function geometryArea(geometry: THREE.BufferGeometry): number {
  const geo = geometry.index ? geometry.toNonIndexed() : geometry;
  const pos = geo.attributes.position.array as ArrayLike<number>;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const cross = new THREE.Vector3();
  let total = 0;
  for (let i = 0; i < pos.length / 9; i++) {
    a.fromArray(pos, i * 9);
    b.fromArray(pos, i * 9 + 3);
    c.fromArray(pos, i * 9 + 6);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    total += cross.crossVectors(ab, ac).length() * 0.5;
  }
  return total;
}

/**
 * Scatter `count` points across the surface of a geometry, weighted by triangle
 * area so large faces do not read as sparse. Writes straight into `target`.
 */
export function sampleSurface(
  geometry: THREE.BufferGeometry,
  count: number,
  target: Float32Array,
  offset: number,
): void {
  const geo = geometry.index ? geometry.toNonIndexed() : geometry;
  const pos = geo.attributes.position.array as ArrayLike<number>;
  const triangles = Math.floor(pos.length / 9);

  const cumulative = new Float32Array(triangles);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const cross = new THREE.Vector3();

  let running = 0;
  for (let i = 0; i < triangles; i++) {
    a.fromArray(pos, i * 9);
    b.fromArray(pos, i * 9 + 3);
    c.fromArray(pos, i * 9 + 6);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    running += cross.crossVectors(ab, ac).length() * 0.5;
    cumulative[i] = running;
  }

  for (let i = 0; i < count; i++) {
    const r = Math.random() * running;
    let lo = 0;
    let hi = triangles - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    a.fromArray(pos, lo * 9);
    b.fromArray(pos, lo * 9 + 3);
    c.fromArray(pos, lo * 9 + 6);

    let u = Math.random();
    let v = Math.random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;

    const k = (offset + i) * 3;
    target[k] = a.x * w + b.x * u + c.x * v;
    target[k + 1] = a.y * w + b.y * u + c.y * v;
    target[k + 2] = a.z * w + b.z * u + c.z * v;
  }
}

/**
 * Sample a multi-part shape and normalise it, so every silhouette in the morph
 * arrives at the same visual weight and sits on the same centre.
 */
export function sampleShape(
  parts: THREE.BufferGeometry[],
  count: number,
  targetHeight = 2.35,
): Float32Array {
  const out = new Float32Array(count * 3);
  const areas = parts.map(geometryArea);
  const sum = areas.reduce((x, y) => x + y, 0);

  let cursor = 0;
  parts.forEach((part, i) => {
    const n = i === parts.length - 1 ? count - cursor : Math.floor((areas[i] / sum) * count);
    sampleSurface(part, n, out, cursor);
    cursor += n;
  });

  let minY = Infinity;
  let maxY = -Infinity;
  let cx = 0;
  let cz = 0;
  for (let i = 0; i < count; i++) {
    const y = out[i * 3 + 1];
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    cx += out[i * 3];
    cz += out[i * 3 + 2];
  }
  cx /= count;
  cz /= count;
  const cy = (minY + maxY) / 2;
  const scale = targetHeight / Math.max(0.0001, maxY - minY);

  for (let i = 0; i < count; i++) {
    out[i * 3] = (out[i * 3] - cx) * scale;
    out[i * 3 + 1] = (out[i * 3 + 1] - cy) * scale;
    out[i * 3 + 2] = (out[i * 3 + 2] - cz) * scale;
  }
  return out;
}
