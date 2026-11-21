export type BotanicalMotif = 'sprout' | 'ginkgo' | 'fern' | 'conifer' | 'blossom';

export interface BotanicalParticle {
  id: string;
  x: number;
  y: number;
  motif: BotanicalMotif;
  color: string;
  sizePx: number;
  rotationDeg: number;
  driftX: number;
  driftY: number;
  durationMs: number;
  createdAt: number;
}

export const TRAIL_DISTANCE_THRESHOLD_PX = 40;
export const TRAIL_TIME_COOLDOWN_MS = 65;
export const TRAIL_MAX_PARTICLES = 18;

const MOTIFS: BotanicalMotif[] = ['sprout', 'ginkgo', 'fern', 'conifer', 'blossom'];

const BOTANICAL_COLORS = [
  '#1F7A4C',
  '#2D9A62',
  '#165B38',
  '#0E6BA8',
  '#3FA36C',
];

export function shouldSpawnTrailParticle(
  lastX: number | null,
  lastY: number | null,
  lastTimeMs: number,
  nextX: number,
  nextY: number,
  nowMs: number
): boolean {
  if (lastX === null || lastY === null) {
    return true;
  }

  if (nowMs - lastTimeMs < TRAIL_TIME_COOLDOWN_MS) {
    return false;
  }

  const dx = nextX - lastX;
  const dy = nextY - lastY;
  const distance = Math.hypot(dx, dy);
  return distance >= TRAIL_DISTANCE_THRESHOLD_PX;
}

export function createBotanicalParticle(
  x: number,
  y: number,
  sequenceIndex: number,
  nowMs: number,
  seedOffset: number = 0
): BotanicalParticle {
  const index = Math.abs(sequenceIndex + seedOffset);
  const motif = MOTIFS[index % MOTIFS.length];
  const color = BOTANICAL_COLORS[(index * 2) % BOTANICAL_COLORS.length];

  const angleSlots = [-24, 16, -12, 26, -6, 20, -28, 8];
  const driftXSlots = [-16, 18, -10, 22, 12, -20, 14, -8];
  const driftYSlots = [-28, -36, -32, -42, -30, -38, -34, -26];
  const sizeSlots = [24, 28, 26, 32, 24, 30];

  return {
    id: `bt-${nowMs}-${sequenceIndex}-${seedOffset}`,
    x,
    y,
    motif,
    color,
    sizePx: sizeSlots[index % sizeSlots.length],
    rotationDeg: angleSlots[index % angleSlots.length],
    driftX: driftXSlots[index % driftXSlots.length],
    driftY: driftYSlots[index % driftYSlots.length],
    durationMs: 850,
    createdAt: nowMs,
  };
}

export function createClickBurstParticles(
  x: number,
  y: number,
  startSequence: number,
  nowMs: number
): BotanicalParticle[] {
  const offsets = [
    { dx: -18, dy: -16, rot: -26 },
    { dx: 0, dy: -26, rot: 4 },
    { dx: 18, dy: -14, rot: 28 },
  ];

  return offsets.map((offset, idx) => {
    const base = createBotanicalParticle(x, y, startSequence + idx, nowMs, idx);
    return {
      ...base,
      sizePx: 26 + idx * 2,
      driftX: offset.dx,
      driftY: offset.dy - 18,
      rotationDeg: offset.rot,
      durationMs: 920,
    };
  });
}

export function pruneAndAppendParticles(
  existing: BotanicalParticle[],
  incoming: BotanicalParticle[],
  nowMs: number,
  maxCount: number = TRAIL_MAX_PARTICLES
): BotanicalParticle[] {
  const active = existing.filter((p) => nowMs - p.createdAt < p.durationMs);
  const combined = [...active, ...incoming];
  if (combined.length <= maxCount) {
    return combined;
  }
  return combined.slice(combined.length - maxCount);
}
