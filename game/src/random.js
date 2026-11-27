// Seeded RNG so a screenshot query always lands on the same frame.

export function makeRng(seed) {
  let state = (Number(seed) || 1) >>> 0;
  if (state === 0) state = 1;
  return function rng() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function range(rng, min, max) {
  return min + (max - min) * rng();
}

export function pick(rng, list) {
  return list[(rng() * list.length) | 0];
}

export function chance(rng, p) {
  return rng() < p;
}

export function hashSeed(text) {
  let h = 2166136261;
  const s = String(text || '1');
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
