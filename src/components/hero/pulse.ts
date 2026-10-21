/** Two soft waves, bounded in strength and settled after 2.4 seconds. */
export function pulseEnvelope(seconds: number): number {
  if (seconds < 0 || seconds >= 2.4 || !Number.isFinite(seconds)) return 0;
  const attack = Math.min(1, seconds / 0.08);
  const release = Math.pow(1 - seconds / 2.4, 2);
  return attack * release * (0.5 + 0.5 * Math.cos(seconds * Math.PI * 3));
}
