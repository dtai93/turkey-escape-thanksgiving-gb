// Distance, kernels, near-miss bonuses and a no-hit streak multiplier.

import { setBanner } from './game-state.js';

export function addDistance(state, metres) {
  state.distance += metres;
  state.score += metres * 2 * state.multiplier;
}

export function addKernel(state) {
  state.kernels += 1;
  state.streak += 1;
  state.multiplier = 1 + Math.min(4, Math.floor(state.streak / 5));
  state.score += 25 * state.multiplier;
  setBanner(state, 'GOBBLE!', 0.55);
}

export function addNearMiss(state) {
  state.nearMisses += 1;
  state.streak += 1;
  state.multiplier = 1 + Math.min(4, Math.floor(state.streak / 5));
  state.score += 40 * state.multiplier;
  state.slow = 0.45;
  setBanner(state, 'NEAR MISS!', 0.85);
}

export function applyHit(state) {
  state.lives -= 1;
  state.streak = 0;
  state.multiplier = 1;
  state.invuln = 1.15;
  state.shake = 0.45;
  state.flash = 0.35;
  state.farmerDist = Math.min(12, state.farmerDist + 2.4);
  setBanner(state, 'OUCH!', 0.8);
}

export function refreshStage(state) {
  const len = state.stageLengths[state.stageIndex] || 200;
  const into = stageDistance(state);
  state.stageProgress = Math.max(0, Math.min(1, into / len));
}

function stageDistance(state) {
  let start = 0;
  for (let i = 0; i < state.stageIndex; i += 1) start += state.stageLengths[i];
  return state.distance - start;
}

export function stageIndexFor(state) {
  let cursor = 0;
  for (let i = 0; i < state.stageLengths.length; i += 1) {
    cursor += state.stageLengths[i];
    if (state.distance < cursor) return i;
  }
  return state.stageLengths.length - 1;
}
