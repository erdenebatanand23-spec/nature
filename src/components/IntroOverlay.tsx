import { useEffect, useRef, useState } from 'react';
import {
  computeIntroFlyTransform,
  getIntroStatusLabel,
  INTRO_GLIDE_DURATION_MS,
  INTRO_LOADING_DURATION_MS,
  type FlyTransformResult,
  type IntroStage,
} from '../utils/introTransition';
import { CircularPlantCircuitLogo } from './BotanicalVisuals';

interface IntroOverlayProps {
  onStageChange?: (stage: IntroStage) => void;
  onStartReveal: () => void;
  onCompleteReveal: () => void;
}

export function IntroOverlay({
  onStageChange,
  onStartReveal,
  onCompleteReveal,
}: IntroOverlayProps) {
  const [stage, setStage] = useState<IntroStage>('idle');
  const [flyTransform, setFlyTransform] = useState<FlyTransformResult | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const loadTimerRef = useRef<number | null>(null);
  const glideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  useEffect(() => {
    return () => {
      if (loadTimerRef.current !== null) {
        window.clearTimeout(loadTimerRef.current);
      }
      if (glideTimerRef.current !== null) {
        window.clearTimeout(glideTimerRef.current);
      }
    };
  }, []);

  const beginGlideToNavbar = (reducedMotion: boolean) => {
    if (reducedMotion) {
      setStage('gliding');
      onStartReveal();
      onCompleteReveal();
      return;
    }

    const sourceEl = logoWrapRef.current;
    const targetEl = document.getElementById('navbar-brand-logo-slot');

    if (sourceEl && targetEl) {
      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      setFlyTransform(computeIntroFlyTransform(sourceRect, targetRect));
    } else {
      setFlyTransform({ dx: -320, dy: -260, scale: 0.25 });
    }

    setStage('gliding');
    onStartReveal();

    glideTimerRef.current = window.setTimeout(() => {
      onCompleteReveal();
    }, INTRO_GLIDE_DURATION_MS);
  };

  const handleClickLogo = () => {
    if (stage !== 'idle') return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setStage('loading');

    const loadDuration = prefersReducedMotion ? 160 : INTRO_LOADING_DURATION_MS;
    loadTimerRef.current = window.setTimeout(() => {
      beginGlideToNavbar(prefersReducedMotion);
    }, loadDuration);
  };

  const isLoading = stage === 'loading';
  const isGliding = stage === 'gliding';
  const statusLabel = getIntroStatusLabel(stage);

  return (
    <div
      data-testid="intro-overlay"
      data-intro-stage={stage}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 ${
        isGliding ? 'pointer-events-none' : ''
      }`}
    >
      {/* Off-White Full-Screen Backdrop */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-[#F8FAF9] transition-opacity duration-700 ease-out ${
          isGliding ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Soft Ambient Mint & Teal Glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute w-[420px] h-[420px] rounded-full transition-opacity duration-500 ${
          isGliding ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(103,192,144,0.22) 0%, rgba(33,91,99,0.06) 44%, rgba(248,250,249,0) 74%)',
        }}
      />

      {/* Interactive Centered Logo Control + Loading Circuit Ring */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Phase 2 Radial Circuit Trace Lines Animating Around Centered Logo */}
        {isLoading && (
          <svg
            aria-hidden="true"
            viewBox="0 0 360 220"
            fill="none"
            className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 w-[300px] sm:w-[360px] h-[210px] sm:h-[220px]"
          >
            {/* Left Circuit Branches */}
            <path
              d="M114 110 H72 L52 90 H16"
              stroke="#67c090"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-intro-circuit-ray"
            />
            <path
              d="M118 128 H84 L62 150 H26"
              stroke="#67c090"
              strokeOpacity="0.72"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-intro-circuit-ray"
            />
            <circle cx="16" cy="90" r="3" fill="#67c090" />
            <circle cx="26" cy="150" r="2.5" fill="#215b63" fillOpacity="0.65" />

            {/* Right Circuit Branches */}
            <path
              d="M246 110 H288 L308 90 H344"
              stroke="#67c090"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-intro-circuit-ray"
            />
            <path
              d="M242 128 H276 L298 150 H334"
              stroke="#67c090"
              strokeOpacity="0.72"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-intro-circuit-ray"
            />
            <circle cx="344" cy="90" r="3" fill="#67c090" />
            <circle cx="334" cy="150" r="2.5" fill="#215b63" fillOpacity="0.65" />
          </svg>
        )}

        <button
          type="button"
          onClick={handleClickLogo}
          disabled={stage !== 'idle'}
          aria-label="Click to load"
          aria-busy={isLoading}
          data-testid="intro-enter-button"
          className={`group relative flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#215b63] rounded-2xl p-3 ${
            stage === 'idle' ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          {/* Ambient Pulsing Glow Ring */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 w-36 h-36 sm:w-40 sm:h-40 rounded-full transition-opacity duration-300 ${
              isGliding ? 'opacity-0' : 'animate-intro-glow'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(103,192,144,0.46) 0%, rgba(103,192,144,0.14) 55%, rgba(248,250,249,0) 75%)',
            }}
          />

          {/* Centered Logo Wrapper + Phase 2 Progress Ring */}
          <div className="relative flex items-center justify-center">
            {isLoading && (
              <svg
                aria-hidden="true"
                viewBox="0 0 144 144"
                className="pointer-events-none absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90"
              >
                <circle
                  cx="72"
                  cy="72"
                  r="65"
                  fill="none"
                  stroke="#215b63"
                  strokeOpacity="0.12"
                  strokeWidth="2.25"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="65"
                  fill="none"
                  stroke="#67c090"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-intro-ring-fill"
                />
              </svg>
            )}

            <div
              ref={logoWrapRef}
              style={
                isGliding && flyTransform
                  ? {
                      transform: `translate3d(${flyTransform.dx}px, ${flyTransform.dy}px, 0) scale(${flyTransform.scale})`,
                      transition: `transform ${INTRO_GLIDE_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                    }
                  : {
                      transform: 'translate3d(0px, 0px, 0) scale(1)',
                      transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }
              }
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border border-[#215b63]/20 shadow-[0_14px_40px_-10px_rgba(33,91,99,0.22)] flex items-center justify-center transition-transform will-change-transform ${
                stage === 'idle' ? 'group-hover:scale-105' : ''
              }`}
            >
              <CircularPlantCircuitLogo className="w-24 h-24 sm:w-28 sm:h-28" />
            </div>
          </div>
        </button>

        {/* Sleek Thin Loading Progress Bar & Status Label */}
        <div
          className={`mt-4 flex flex-col items-center gap-2.5 transition-all duration-300 ${
            isGliding ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {isLoading && (
            <div
              aria-hidden="true"
              className="w-44 h-[3px] rounded-full bg-[#215b63]/12 overflow-hidden"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-r from-[#67c090] to-[#215b63] animate-intro-bar-fill" />
            </div>
          )}

          <p
            aria-live="polite"
            data-testid="intro-status-text"
            className="text-sm font-medium tracking-wide text-[#215b63]/80"
          >
            {statusLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
