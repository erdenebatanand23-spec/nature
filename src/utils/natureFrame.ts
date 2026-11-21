export interface CanopyParallaxOffset {
  x: number;
  y: number;
}

export const MAX_PARALLAX_PX = 8;

export function computeCanopyParallax(
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number,
  maxOffsetPx: number = MAX_PARALLAX_PX
): CanopyParallaxOffset {
  if (viewportWidth <= 0 || viewportHeight <= 0) {
    return { x: 0, y: 0 };
  }

  const normX = Math.max(-1, Math.min(1, (clientX / viewportWidth) * 2 - 1));
  const normY = Math.max(-1, Math.min(1, (clientY / viewportHeight) * 2 - 1));

  return {
    x: Number((-normX * maxOffsetPx).toFixed(2)),
    y: Number((-normY * maxOffsetPx).toFixed(2)),
  };
}
