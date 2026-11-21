import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeIntroFlyTransform,
  computeLoadingProgress,
  getIntroStatusLabel,
  INTRO_LOADING_DURATION_MS,
  shouldSkipIntroFromUrl,
} from './introTransition';

test('shouldSkipIntroFromUrl detects autostart=1 and autostart=true safely', () => {
  assert.equal(shouldSkipIntroFromUrl('?autostart=1'), true);
  assert.equal(shouldSkipIntroFromUrl('?foo=bar&autostart=true'), true);
  assert.equal(shouldSkipIntroFromUrl('?autostart=0'), false);
  assert.equal(shouldSkipIntroFromUrl(''), false);
});

test('getIntroStatusLabel returns Phase 1 prompt and Phase 2 loading message cleanly', () => {
  assert.equal(getIntroStatusLabel('idle'), 'Click to load');
  assert.equal(getIntroStatusLabel('loading'), 'Initializing eco-systems...');
  assert.equal(getIntroStatusLabel('gliding'), '');
  assert.equal(getIntroStatusLabel('entered'), '');
});

test('computeLoadingProgress clamps smoothly between 0 and 1', () => {
  assert.equal(computeLoadingProgress(-50, 1450), 0);
  assert.equal(computeLoadingProgress(0, 1450), 0);
  assert.equal(computeLoadingProgress(725, 1450), 0.5);
  assert.equal(computeLoadingProgress(2000, INTRO_LOADING_DURATION_MS), 1);
});

test('computeIntroFlyTransform calculates accurate FLIP deltas and scale', () => {
  const source = { left: 660, top: 390, width: 120, height: 120 };
  const target = { left: 32, top: 18, width: 28, height: 28 };

  const result = computeIntroFlyTransform(source, target);
  assert.equal(result.dx, -674);
  assert.equal(result.dy, -418);
  assert.equal(result.scale, 0.233);
});

test('computeIntroFlyTransform handles invalid dimensions gracefully', () => {
  const result = computeIntroFlyTransform(
    { left: 0, top: 0, width: 0, height: 0 },
    { left: 20, top: 20, width: 28, height: 28 }
  );
  assert.deepEqual(result, { dx: 0, dy: 0, scale: 0.25 });
});
