import { useEffect, useState } from 'react';
import { computeCanopyParallax, type CanopyParallaxOffset } from '../utils/natureFrame';

interface NatureFrameOverlayProps {
  enabled: boolean;
}

const SUN_MOTES = [
  { top: '22%', left: '3%', size: 'w-2 h-2', delay: '0s' },
  { top: '36%', right: '2.5%', size: 'w-1.5 h-1.5', delay: '1.8s' },
  { bottom: '30%', left: '2%', size: 'w-2.5 h-2.5', delay: '3.1s' },
  { bottom: '24%', right: '3%', size: 'w-2 h-2', delay: '0.9s' },
  { top: '62%', left: '1.5%', size: 'w-1.5 h-1.5', delay: '2.4s' },
  { top: '54%', right: '1.5%', size: 'w-2 h-2', delay: '4.2s' },
];

export function NatureFrameOverlay({ enabled }: NatureFrameOverlayProps) {
  const [parallax, setParallax] = useState<CanopyParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId = 0;
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        setParallax(
          computeCanopyParallax(e.clientX, e.clientY, window.innerWidth, window.innerHeight)
        );
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      data-testid="nature-canopy-frame"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {/* Natural sunlit clearing + subtle deep-forest edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 64%, rgba(22, 68, 50, 0.055) 89%, rgba(15, 36, 29, 0.13) 100%)',
        }}
      />

      {/* Warm top-center dappled greenhouse sunlight glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 4rem, rgba(126, 224, 174, 0.10), transparent 46%)',
        }}
      />

      {/* Delicate botanical inner perimeter border */}
      <div className="hidden md:block absolute top-20 bottom-3 inset-x-3 rounded-2xl border border-[#1F7A4C]/12" />

      {/* Top-Left Canopy: Monstera, Hanging Vine & Forest Leaves */}
      <div
        className="absolute top-14 -left-2 w-20 sm:w-32 lg:w-44 xl:w-52 opacity-45 sm:opacity-65 lg:opacity-75 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * 0.8}px, ${parallax.y * 0.8}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 280 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto animate-canopy-sway-a origin-top-left"
        >
          <path
            d="M12 0C22 52 16 112 34 188"
            stroke="#164432"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
          <path d="M18 46C38 42 52 54 50 70C32 70 20 60 18 46Z" fill="#1F7A4C" fillOpacity="0.72" />
          <path d="M20 96C3 90 -4 104 4 118C18 116 24 106 20 96Z" fill="#2D9A62" fillOpacity="0.68" />
          <path d="M27 136C44 134 56 146 50 162C35 160 27 148 27 136Z" fill="#165B38" fillOpacity="0.72" />
          <path d="M32 174C44 176 48 190 36 200C27 194 26 182 32 174Z" fill="#4BA87A" fillOpacity="0.75" />

          <path
            d="M0 10C62 24 114 48 182 28"
            stroke="#164432"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path d="M44 20C32 -6 66 -12 88 12C94 34 66 44 44 20Z" fill="#0F241D" fillOpacity="0.68" />
          <path d="M92 32C112 6 154 6 172 34C146 56 112 52 92 32Z" fill="#1F7A4C" fillOpacity="0.72" />
          <path
            d="M98 32C122 28 144 30 164 34"
            stroke="#C5F3DA"
            strokeWidth="1.1"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
          <path d="M52 24C74 44 76 76 50 96C30 78 32 46 52 24Z" fill="#2D9A62" fillOpacity="0.65" />
          <path d="M126 36C148 54 152 82 132 100C114 82 114 54 126 36Z" fill="#164432" fillOpacity="0.55" />
          <circle cx="182" cy="28" r="3" fill="#7EE0AE" fillOpacity="0.8" />
          <circle cx="88" cy="58" r="2.2" fill="#0E6BA8" fillOpacity="0.55" />
        </svg>
      </div>

      {/* Top-Right Canopy: Arching Willow & Ginkgo Sprigs */}
      <div
        className="absolute top-14 -right-2 w-20 sm:w-32 lg:w-44 xl:w-52 opacity-45 sm:opacity-65 lg:opacity-75 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * -0.8}px, ${parallax.y * 0.8}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 280 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto animate-canopy-sway-b origin-top-right"
        >
          <path
            d="M280 12C212 22 152 54 98 32"
            stroke="#164432"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.62"
          />
          <path
            d="M258 0C244 58 250 118 232 184"
            stroke="#1F7A4C"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
          <path d="M188 30C170 6 142 6 130 22C146 34 166 36 188 30Z" fill="#2D9A62" fillOpacity="0.72" />
          <path d="M224 22C208 -6 178 -4 170 16C188 26 206 28 224 22Z" fill="#165B38" fillOpacity="0.74" />
          <path d="M142 38C124 48 104 42 96 28C114 22 130 28 142 38Z" fill="#4BA87A" fillOpacity="0.72" />
          <path d="M248 56C226 54 214 68 220 84C236 80 248 70 248 56Z" fill="#1F7A4C" fillOpacity="0.7" />
          <path d="M244 106C262 104 270 118 260 132C248 128 240 118 244 106Z" fill="#0F241D" fillOpacity="0.62" />
          <path d="M238 144C218 146 210 160 220 174C234 168 240 156 238 144Z" fill="#2D9A62" fillOpacity="0.68" />
          <circle cx="98" cy="32" r="2.8" fill="#0E6BA8" fillOpacity="0.5" />
          <circle cx="232" cy="184" r="2.5" fill="#7EE0AE" fillOpacity="0.75" />
        </svg>
      </div>

      {/* Bottom-Left Forest Floor: Ferns, Wild Grass & Moss */}
      <div
        className="absolute -bottom-3 -left-3 w-24 sm:w-36 lg:w-48 xl:w-56 opacity-45 sm:opacity-65 lg:opacity-75 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y * -0.7}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 300 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto animate-canopy-sway-b origin-bottom-left"
        >
          <path
            d="M0 220V182C36 172 72 184 112 198C144 210 174 210 208 220H0Z"
            fill="#0F241D"
            fillOpacity="0.62"
          />
          <path
            d="M0 220V196C30 188 64 198 96 210C122 218 148 218 176 220H0Z"
            fill="#1F7A4C"
            fillOpacity="0.58"
          />

          <path
            d="M20 214C38 156 72 104 128 52"
            stroke="#164432"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <path d="M36 176C20 158 24 136 42 138C48 154 46 168 36 176Z" fill="#2D9A62" fillOpacity="0.74" />
          <path d="M52 156C76 148 92 162 82 178C66 180 54 170 52 156Z" fill="#1F7A4C" fillOpacity="0.74" />
          <path d="M58 136C40 118 44 98 62 102C68 118 66 128 58 136Z" fill="#165B38" fillOpacity="0.74" />
          <path d="M74 118C98 110 112 124 104 138C88 140 78 130 74 118Z" fill="#4BA87A" fillOpacity="0.72" />
          <path d="M84 96C68 82 72 64 90 68C94 80 92 90 84 96Z" fill="#2D9A62" fillOpacity="0.72" />
          <path d="M100 80C120 74 132 86 124 98C112 100 102 92 100 80Z" fill="#1F7A4C" fillOpacity="0.72" />
          <path d="M114 62C110 46 124 40 134 48C134 58 124 64 114 62Z" fill="#7EE0AE" fillOpacity="0.78" />

          <path d="M10 216C12 158 18 110 34 64" stroke="#2D9A62" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.65" />
          <path d="M78 216C100 180 132 156 172 138" stroke="#4BA87A" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.62" />
        </svg>
      </div>

      {/* Bottom-Right Conservatory Flora: Broad Leaves & Dewdrops */}
      <div
        className="absolute -bottom-3 -right-3 w-24 sm:w-36 lg:w-48 xl:w-56 opacity-45 sm:opacity-65 lg:opacity-75 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * -1}px, ${parallax.y * -0.7}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 300 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto animate-canopy-sway-a origin-bottom-right"
        >
          <path
            d="M300 220V184C260 174 224 188 184 202C152 212 124 212 92 220H300Z"
            fill="#0F241D"
            fillOpacity="0.6"
          />
          <path
            d="M300 220V198C268 190 236 200 202 212C176 218 152 218 128 220H300Z"
            fill="#1F7A4C"
            fillOpacity="0.56"
          />

          <path
            d="M278 214C256 156 226 108 170 54"
            stroke="#164432"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <path d="M218 118C180 100 162 64 184 44C216 54 234 86 218 118Z" fill="#1F7A4C" fillOpacity="0.74" />
          <path
            d="M184 52C198 74 210 94 216 114"
            stroke="#C5F3DA"
            strokeWidth="1.2"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          <path d="M246 154C214 146 196 120 212 100C238 108 254 130 246 154Z" fill="#2D9A62" fillOpacity="0.72" />
          <path d="M256 168C276 142 294 124 296 94C270 102 254 132 256 168Z" fill="#165B38" fillOpacity="0.74" />
          <path d="M192 184C162 174 146 152 160 134C182 140 196 160 192 184Z" fill="#4BA87A" fillOpacity="0.7" />
          <circle cx="170" cy="54" r="2.8" fill="#0E6BA8" fillOpacity="0.6" />
          <circle cx="200" cy="120" r="2.2" fill="#7EE0AE" fillOpacity="0.78" />
        </svg>
      </div>

      {/* Gentle Floating Sunlit Forest Pollen Motes */}
      {SUN_MOTES.map((mote, index) => (
        <span
          key={index}
          className={`hidden sm:block absolute rounded-full bg-[#7EE0AE]/50 blur-[1px] animate-sun-mote ${mote.size}`}
          style={{
            top: mote.top,
            bottom: mote.bottom,
            left: mote.left,
            right: mote.right,
            animationDelay: mote.delay,
          }}
        />
      ))}
    </div>
  );
}
