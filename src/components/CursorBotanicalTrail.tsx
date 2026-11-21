import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  createBotanicalParticle,
  createClickBurstParticles,
  pruneAndAppendParticles,
  shouldSpawnTrailParticle,
  type BotanicalMotif,
  type BotanicalParticle,
} from '../utils/cursorTrail';

function BotanicalMotifSvg({
  motif,
  color,
  sizePx,
}: {
  motif: BotanicalMotif;
  color: string;
  sizePx: number;
}) {
  if (motif === 'ginkgo') {
    return (
      <svg width={sizePx} height={sizePx} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 27V18M16 18C10 17 5 11.5 7 6.5C10.5 7 13.5 9 15.5 11.5L16 8L16.5 11.5C18.5 9 21.5 7 25 6.5C27 11.5 22 17 16 18Z"
          fill={color}
          fillOpacity="0.22"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (motif === 'fern') {
    return (
      <svg width={sizePx} height={sizePx} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 27C16 20 16 12 19 6M16 21C12.5 20.5 10 18.5 9.5 16.5M16 17C19.5 16.5 22 14.5 22.5 12.5M16.4 13C13.5 12.5 11.5 11 11 9.2M17.2 9.5C19.5 9 21 7.8 21.5 6.4"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (motif === 'conifer') {
    return (
      <svg width={sizePx} height={sizePx} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 27V8M16 20L10 15M16 20L22 15M16 15L11 10.5M16 15L21 10.5M16 10.5L13 7M16 10.5L19 7"
          stroke={color}
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (motif === 'blossom') {
    return (
      <svg width={sizePx} height={sizePx} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 13.5C14.2 10 14.5 6 16 5C17.5 6 17.8 10 16 13.5ZM18.5 16C22 14.2 26 14.5 27 16C26 17.5 22 17.8 18.5 16ZM16 18.5C17.8 22 17.5 26 16 27C14.5 26 14.2 22 16 18.5ZM13.5 16C10 17.8 6 17.5 5 16C6 14.5 10 14.2 13.5 16Z"
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="2" fill={color} />
      </svg>
    );
  }

  return (
    <svg width={sizePx} height={sizePx} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 27V14M16 16C16 10.5 20.5 7 25 7.5C24.5 12.5 21 16 16 16ZM16 19C16 13.5 11.5 10 7 10.5C7.5 15.5 11 19 16 19Z"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CursorBotanicalTrail() {
  const [particles, setParticles] = useState<BotanicalParticle[]>([]);
  const lastPosRef = useRef<{ x: number | null; y: number | null; time: number }>({
    x: null,
    y: null,
    time: 0,
  });
  const seqRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const now = Date.now();
      const last = lastPosRef.current;

      if (!shouldSpawnTrailParticle(last.x, last.y, last.time, e.clientX, e.clientY, now)) {
        return;
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
      seqRef.current += 1;
      const particle = createBotanicalParticle(e.clientX, e.clientY, seqRef.current, now);
      setParticles((prev) => pruneAndAppendParticles(prev, [particle], now));
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const now = Date.now();
      seqRef.current += 3;
      const burst = createClickBurstParticles(e.clientX, e.clientY, seqRef.current, now);
      setParticles((prev) => pruneAndAppendParticles(prev, burst, now));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const pruneInterval = window.setInterval(() => {
      const now = Date.now();
      setParticles((prev) => {
        if (prev.length === 0) return prev;
        const remaining = prev.filter((p) => now - p.createdAt < p.durationMs);
        return remaining.length === prev.length ? prev : remaining;
      });
    }, 350);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.clearInterval(pruneInterval);
    };
  }, []);

  if (particles.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="cursor-botanical-trail"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {particles.map((particle) => {
        const style = {
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          animationDuration: `${particle.durationMs}ms`,
          '--drift-x': `${particle.driftX}px`,
          '--drift-y': `${particle.driftY}px`,
          '--rot': `${particle.rotationDeg}deg`,
        } as CSSProperties;

        return (
          <div
            key={particle.id}
            data-testid="cursor-botanical-leaf"
            className="absolute animate-botanical-sprout"
            style={style}
          >
            <BotanicalMotifSvg
              motif={particle.motif}
              color={particle.color}
              sizePx={particle.sizePx}
            />
          </div>
        );
      })}
    </div>
  );
}
