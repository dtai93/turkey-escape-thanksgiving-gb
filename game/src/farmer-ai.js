// Hank's brain: CHASE, SEARCH, CORNER, LUNGE. He closes, sweeps, and cuts lanes.

import { FARMER, LANES } from './config.js';
import { setBanner } from './game-state.js';

export function createFarmerAi() {
  return {
    x: 0,
    z: 8,
    lane: 1,
    state: 'CHASE',
    stateT: 0,
    phase: 0,
    searchSweep: 0,
    lost: false,
  };
}

export function resetFarmer(ai) {
  ai.x = 0;
  ai.z = 8.2;
  ai.lane = 1;
  ai.state = 'CHASE';
  ai.stateT = 0;
  ai.phase = 0;
  ai.searchSweep = 0;
  ai.lost = false;
}

export function stepFarmer(ai, bird, state, dt, difficulty) {
  ai.stateT += dt;
  ai.phase += dt * (7 + difficulty * 2);

  const hidden = bird.hiding;
  if (hidden && ai.state !== 'SEARCH') {
    ai.state = 'SEARCH';
    ai.stateT = 0;
    ai.lost = true;
    state.spotted = false;
    setBanner(state, 'HIDDEN', 0.9);
  }
  if (!hidden && ai.state === 'SEARCH' && ai.stateT > 1.4) {
    ai.state = 'CHASE';
    ai.stateT = 0;
    ai.lost = false;
    state.spotted = true;
    setBanner(state, 'SPOTTED!', 0.9);
  }

  const targetGap = hidden ? 9.5 : Math.max(1.55, 5.8 - difficulty * 3.4);
  if (state.farmerDist > targetGap) state.farmerDist -= (1.8 + difficulty * 2.4) * dt;
  else if (!hidden) state.farmerDist += 0.25 * dt;
  else state.farmerDist += 1.6 * dt;
  if (bird.dashing > 0) state.farmerDist += 3.4 * dt;
  state.farmerDist = Math.max(0.65, Math.min(16, state.farmerDist));

  if (!hidden && state.farmerDist < FARMER.lungeGap && Math.abs(ai.x - bird.x) < 1.3) {
    if (ai.state !== 'LUNGE') {
      ai.state = 'LUNGE';
      ai.stateT = 0;
    }
  } else if (!hidden && ai.state === 'LUNGE' && ai.stateT > 0.45) {
    ai.state = 'CHASE';
    ai.stateT = 0;
  }

  if (!hidden && ai.state === 'CHASE' && ai.stateT > 2.8 && difficulty > 0.35) {
    ai.state = 'CORNER';
    ai.stateT = 0;
    ai.lane = bird.lane === 1 ? (bird.x > 0 ? 0 : 2) : 1;
  }
  if (ai.state === 'CORNER' && ai.stateT > 1.3) {
    ai.state = 'CHASE';
    ai.stateT = 0;
    ai.lane = bird.lane;
  }
  if (ai.state === 'CHASE' || ai.state === 'LUNGE' || ai.state === 'SEARCH') {
    ai.lane = bird.lane;
  }

  const targetX = LANES[ai.lane] + (ai.state === 'CORNER' ? 0 : 0);
  const follow = ai.state === 'CORNER' ? 6 : 4;
  ai.x += (targetX - ai.x) * Math.min(1, follow * dt);
  ai.z = bird.z + state.farmerDist;

  state.farmerState = ai.state;
  if (state.farmerDist < 4.2 && !hidden && state.bannerT <= 0 && ai.state === 'CHASE') {
    setBanner(state, 'FARMER CLOSING IN', 0.7);
  }
  return ai.state;
}
