/**
 * Collage layout generator — pure computation, no DOM.
 * Ported from generate-card.py's collage algorithm.
 */

import { createPRNG } from './prng';
import { textures, TEXTURE_COUNT } from './textures';

export interface CropRegion {
  x: number; // % offset into source image
  y: number;
  w: number; // % of source image to use
  h: number;
}

export interface CollageChunk {
  textureIndex: number;
  crop: CropRegion;
  left: number;   // % position on viewport
  top: number;
  width: number;  // % of viewport
  height: number;
  pixelated: boolean;
  zIndex: number;
  sizeClass: 'lg' | 'sm' | 'pix'; // which WebP variant to use
  hideMobile: boolean;
}

export interface GlitchBand {
  top: number;    // % position
  height: number; // % height
  offsetX: number; // px displacement
  textureIndex: number; // which texture to sample
  cropY: number;  // % vertical offset into the texture
}

export interface CollageLayout {
  chunks: CollageChunk[];
  glitchBands: GlitchBand[];
  baseColor: string;
}

export type Density = 'full' | 'medium' | 'sparse';

const BASE_COLORS = [
  'rgb(200, 210, 220)',  // cool grey-blue
  'rgb(190, 200, 185)',  // sage
  'rgb(215, 210, 200)',  // warm grey
  'rgb(180, 195, 210)',  // steel blue
];

const DENSITY_MULTIPLIERS: Record<Density, number> = {
  full: 1.0,
  medium: 0.65,
  sparse: 0.4,
};

function cropRandom(rng: ReturnType<typeof createPRNG>, minFrac: number, maxFrac: number): CropRegion {
  const w = rng.uniform(minFrac, maxFrac);
  const h = rng.uniform(minFrac, maxFrac);
  const x = rng.uniform(0, Math.max(0, 1 - w));
  const y = rng.uniform(0, Math.max(0, 1 - h));
  return { x: x * 100, y: y * 100, w: w * 100, h: h * 100 };
}

export function generateCollageLayout(seed: string, density: Density = 'full'): CollageLayout {
  const rng = createPRNG(seed);
  const mult = DENSITY_MULTIPLIERS[density];

  const baseColor = BASE_COLORS[rng.randInt(0, BASE_COLORS.length - 1)];
  const chunks: CollageChunk[] = [];
  let z = 0;

  // Phase 1: Large background chunks (4-6)
  const largeCt = Math.round(rng.randInt(4, 6) * mult);
  for (let i = 0; i < largeCt; i++) {
    const texIdx = rng.randInt(0, TEXTURE_COUNT - 1);
    const crop = cropRandom(rng, 0.3, 0.7);
    const width = rng.uniform(35, 75);
    const height = rng.uniform(30, 65);
    const left = rng.uniform(-width * 0.25, 100 - width * 0.5);
    const top = rng.uniform(-height * 0.25, 100 - height * 0.5);

    chunks.push({
      textureIndex: texIdx,
      crop,
      left, top, width, height,
      pixelated: false,
      zIndex: z++,
      sizeClass: 'lg',
      hideMobile: false,
    });
  }

  // Phase 2: Medium chunks (8-14), 30% pixelated
  const medCt = Math.round(rng.randInt(8, 14) * mult);
  for (let i = 0; i < medCt; i++) {
    const texIdx = rng.randInt(0, TEXTURE_COUNT - 1);
    const crop = cropRandom(rng, 0.15, 0.45);
    const width = rng.uniform(12, 40);
    const height = rng.uniform(10, 35);
    const left = rng.uniform(-width * 0.15, 100 - width * 0.5);
    const top = rng.uniform(-height * 0.15, 100 - height * 0.5);
    const pixelated = rng.random() < 0.3;

    chunks.push({
      textureIndex: texIdx,
      crop,
      left, top, width, height,
      pixelated,
      zIndex: z++,
      sizeClass: pixelated ? 'pix' : 'lg',
      hideMobile: i > medCt * 0.6,
    });
  }

  // Phase 3: Small accent chunks (6-12), 40% pixelated
  const smallCt = Math.round(rng.randInt(6, 12) * mult);
  for (let i = 0; i < smallCt; i++) {
    const texIdx = rng.randInt(0, TEXTURE_COUNT - 1);
    const crop = cropRandom(rng, 0.08, 0.25);
    const width = rng.uniform(5, 18);
    const height = rng.uniform(5, 20);
    const left = rng.uniform(0, 100 - width);
    const top = rng.uniform(0, 100 - height);
    const pixelated = rng.random() < 0.4;

    chunks.push({
      textureIndex: texIdx,
      crop,
      left, top, width, height,
      pixelated,
      zIndex: z++,
      sizeClass: pixelated ? 'pix' : 'sm',
      hideMobile: true,
    });
  }

  // Phase 4: Horizontal glitch displacement bands (3-8)
  const bandCt = Math.round(rng.randInt(3, 8) * mult);
  const glitchBands: GlitchBand[] = [];
  for (let i = 0; i < bandCt; i++) {
    glitchBands.push({
      top: rng.uniform(0, 100),
      height: rng.uniform(0.5, 4),
      offsetX: rng.randInt(-80, 80),
      textureIndex: rng.randInt(0, TEXTURE_COUNT - 1),
      cropY: rng.uniform(0, 80),
    });
  }

  return { chunks, glitchBands, baseColor };
}

export { textures };
