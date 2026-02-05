'use client';

import { useEffect, useRef, useMemo } from 'react';
import { generateCollageLayout, textures, type Density } from '@/lib/collage';

interface Props {
  seed: string;
  density?: Density;
  className?: string;
}

export default function CollageBackground({ seed, density = 'full', className = '' }: Props) {
  const layout = useMemo(() => generateCollageLayout(seed, density), [seed, density]);
  const bandsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        bandsRef.current.forEach((el, i) => {
          if (!el) return;
          // Each band gets a different parallax rate
          const rate = ((i % 2 === 0 ? 1 : -1) * (0.3 + (i * 0.15)));
          const baseOffset = layout.glitchBands[i]?.offsetX ?? 0;
          const scrollOffset = scrollY * rate;
          el.style.transform = `translateX(${baseOffset + scrollOffset}px)`;
        });
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [layout.glitchBands]);

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden ${className}`}
      style={{ backgroundColor: layout.baseColor }}
      aria-hidden="true"
    >
      {/* Collage chunks */}
      {layout.chunks.map((chunk, i) => {
        const tex = textures[chunk.textureIndex];
        const src = chunk.sizeClass === 'pix' ? tex.pix : chunk.sizeClass === 'lg' ? tex.lg : tex.sm;

        return (
          <div
            key={i}
            className={chunk.hideMobile ? 'hidden sm:block' : undefined}
            style={{
              position: 'absolute',
              left: `${chunk.left}%`,
              top: `${chunk.top}%`,
              width: `${chunk.width}%`,
              height: `${chunk.height}%`,
              zIndex: chunk.zIndex,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: `${chunk.crop.x}% ${chunk.crop.y}%`,
              imageRendering: chunk.pixelated ? 'pixelated' : undefined,
              opacity: 0.92,
            }}
          />
        );
      })}

      {/* Glitch displacement bands — photo slivers, scroll-reactive */}
      {layout.glitchBands.map((band, i) => {
        const tex = textures[band.textureIndex];
        return (
          <div
            key={`band-${i}`}
            ref={el => { bandsRef.current[i] = el; }}
            className="collage-glitch-band"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${band.top}%`,
              height: `${band.height}%`,
              zIndex: 100 + i,
              transform: `translateX(${band.offsetX}px)`,
              backgroundImage: `url(${tex.sm})`,
              backgroundSize: 'cover',
              backgroundPosition: `50% ${band.cropY}%`,
              opacity: 0.85,
              '--band-offset': `${band.offsetX}px`,
              '--band-delay': `${i * 2.5}`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
