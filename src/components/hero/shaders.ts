export const vertexShader = /* glsl */ `
uniform float uMix1;
uniform float uMix2;
uniform float uTime;
uniform float uSize;
uniform float uDpr;
uniform float uIdle;
uniform float uTurbulence;
uniform float uPulse;

attribute vec3 posB;
attribute vec3 posC;
attribute float aRand;
attribute vec3 aDrift;

varying float vRand;
varying float vY;
varying float vDepth;

float ease(float x) {
  return x * x * (3.0 - 2.0 * x);
}

void main() {
  // Each particle starts its own transition slightly late, so the silhouette
  // flows into the next one instead of snapping as a single block.
  float s1 = ease(clamp((uMix1 - aRand * 0.30) / 0.70, 0.0, 1.0));
  float s2 = ease(clamp((uMix2 - aRand * 0.30) / 0.70, 0.0, 1.0));

  vec3 p = mix(position, posB, s1);
  p = mix(p, posC, s2);

  // Turbulence peaks mid-transition and settles back to zero at either end.
  float turbulence = sin(s1 * 3.14159) + sin(s2 * 3.14159);
  p += aDrift * turbulence * uTurbulence;

  // Barely-there idle breathing so a held silhouette never looks frozen.
  p += aDrift * uIdle * (0.04 + aRand * 0.05) * sin(uTime * 0.5 + aRand * 6.2831);

  // A restrained outward ripple preserves the silhouette while it resonates.
  p *= 1.0 + uPulse * 0.13;
  p += aDrift * uPulse * 0.065;

  vRand = aRand;
  vY = p.y;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;

  gl_PointSize = uSize * (1.0 + uPulse * 0.28) * uDpr * (1.0 / max(0.001, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uOpacity;
uniform float uTint;
uniform float uPulse;

varying float vRand;
varying float vY;
varying float vDepth;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.08, d);

  vec3 col = mix(uColorA, uColorB, smoothstep(-1.3, 1.4, vY));
  col = mix(col, uColorC, vRand * 0.30 + uPulse * 0.16);

  float fog = smoothstep(7.2, 3.2, vDepth);
  gl_FragColor = vec4(col, alpha * uOpacity * uTint * (0.32 + 0.68 * fog));
}
`;
