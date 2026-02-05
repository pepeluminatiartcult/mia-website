/**
 * Seeded PRNG using mulberry32 algorithm.
 * Deterministic: same seed always produces the same sequence.
 */

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

export function createPRNG(seed: string) {
  let state = hashString(seed);

  function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    /** Returns float in [0, 1) */
    random: next,

    /** Returns integer in [min, max] inclusive */
    randInt(min: number, max: number): number {
      return min + Math.floor(next() * (max - min + 1));
    },

    /** Returns float in [min, max) */
    uniform(min: number, max: number): number {
      return min + next() * (max - min);
    },
  };
}

export type PRNG = ReturnType<typeof createPRNG>;
