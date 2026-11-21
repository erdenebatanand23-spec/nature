import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createBotanicalParticle,
  createClickBurstParticles,
  pruneAndAppendParticles,
  shouldSpawnTrailParticle,
  TRAIL_DISTANCE_THRESHOLD_PX,
  TRAIL_MAX_PARTICLES,
  TRAIL_TIME_COOLDOWN_MS,
} from './cursorTrail';

test('shouldSpawnTrailParticle gates by initial position, cooldown, and travel distance', () => {
  assert.equal(shouldSpawnTrailParticle(null, null, 0, 100, 100, 1000), true);

  assert.equal(
    shouldSpawnTrailParticle(100, 100, 1000, 180, 180, 1000 + TRAIL_TIME_COOLDOWN_MS - 10),
    false
  );

  assert.equal(
    shouldSpawnTrailParticle(100, 100, 1000, 110, 110, 1000 + TRAIL_TIME_COOLDOWN_MS + 20),
    false
  );

  assert.equal(
    shouldSpawnTrailParticle(
      100,
      100,
      1000,
      100 + TRAIL_DISTANCE_THRESHOLD_PX + 5,
      100,
      1000 + TRAIL_TIME_COOLDOWN_MS + 10
    ),
    true
  );
});

test('createBotanicalParticle cycles through all botanical motifs with valid coordinates', () => {
  const motifs = new Set<string>();
  for (let i = 0; i < 10; i += 1) {
    const p = createBotanicalParticle(200 + i, 300 + i, i, 5000 + i);
    motifs.add(p.motif);
    assert.ok(p.sizePx >= 22 && p.sizePx <= 36);
    assert.ok(p.driftY < 0);
  }
  assert.equal(motifs.size, 5);
});

test('createClickBurstParticles generates 3 distinct radiating botanical leaves', () => {
  const burst = createClickBurstParticles(400, 250, 10, 2000);
  assert.equal(burst.length, 3);
  const uniqueIds = new Set(burst.map((b) => b.id));
  assert.equal(uniqueIds.size, 3);
  assert.ok(burst[0].driftX < 0);
  assert.ok(burst[2].driftX > 0);
});

test('pruneAndAppendParticles expires finished particles and enforces max particle cap', () => {
  const now = 5000;
  const expired = createBotanicalParticle(10, 10, 0, 1000);
  const active = createBotanicalParticle(20, 20, 1, 4700);
  const incoming = Array.from({ length: 25 }, (_, i) =>
    createBotanicalParticle(50 + i, 60 + i, i + 2, now)
  );

  const result = pruneAndAppendParticles([expired, active], incoming, now, TRAIL_MAX_PARTICLES);
  assert.equal(result.length, TRAIL_MAX_PARTICLES);
  assert.ok(!result.some((p) => p.id === expired.id));
});
