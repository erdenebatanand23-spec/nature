import test from 'node:test';
import assert from 'node:assert/strict';
import { computeCanopyParallax, MAX_PARALLAX_PX } from './natureFrame';

test('computeCanopyParallax centers cleanly and clamps to max bounds', () => {
  const center = computeCanopyParallax(720, 450, 1440, 900);
  assert.equal(center.x, 0);
  assert.equal(center.y, 0);

  const topLeft = computeCanopyParallax(0, 0, 1440, 900);
  assert.equal(topLeft.x, MAX_PARALLAX_PX);
  assert.equal(topLeft.y, MAX_PARALLAX_PX);

  const bottomRight = computeCanopyParallax(1440, 900, 1440, 900);
  assert.equal(bottomRight.x, -MAX_PARALLAX_PX);
  assert.equal(bottomRight.y, -MAX_PARALLAX_PX);

  const invalid = computeCanopyParallax(100, 100, 0, 0);
  assert.deepEqual(invalid, { x: 0, y: 0 });
});
