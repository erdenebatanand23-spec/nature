export type IntroStage = 'idle' | 'loading' | 'gliding' | 'entered';

export const INTRO_LOADING_DURATION_MS = 1450;
export const INTRO_GLIDE_DURATION_MS = 800;

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface FlyTransformResult {
  dx: number;
  dy: number;
  scale: number;
}

export function shouldSkipIntroFromUrl(search: string): boolean {
  if (!search) return false;
  try {
    const params = new URLSearchParams(search);
    const val = params.get('autostart');
    return val === '1' || val === 'true';
  } catch {
    return false;
  }
}

export function getIntroStatusLabel(stage: IntroStage): string {
  if (stage === 'loading') {
    return 'Initializing eco-systems...';
  }
  if (stage === 'idle') {
    return 'Click to load';
  }
  return '';
}

export function computeLoadingProgress(
  elapsedMs: number,
  durationMs: number = INTRO_LOADING_DURATION_MS
): number {
  if (durationMs <= 0) return 1;
  const ratio = elapsedMs / durationMs;
  if (ratio <= 0) return 0;
  if (ratio >= 1) return 1;
  return Math.round(ratio * 1000) / 1000;
}

export function computeIntroFlyTransform(
  sourceRect: RectLike,
  targetRect: RectLike
): FlyTransformResult {
  if (
    sourceRect.width <= 0 ||
    sourceRect.height <= 0 ||
    targetRect.width <= 0 ||
    targetRect.height <= 0
  ) {
    return { dx: 0, dy: 0, scale: 0.25 };
  }

  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  const dx = Math.round((targetCenterX - sourceCenterX) * 100) / 100;
  const dy = Math.round((targetCenterY - sourceCenterY) * 100) / 100;
  const rawScale = targetRect.width / sourceRect.width;
  const scale = Math.max(0.15, Math.min(1, Math.round(rawScale * 1000) / 1000));

  return { dx, dy, scale };
}
