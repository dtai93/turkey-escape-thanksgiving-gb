// Hank's brain: CHASE, SEARCH, CORNER, LUNGE. He closes, sweeps, cuts lanes, and swings the net.

import { FARMER, LANES } from './config.js';
import { setBanner } from './game-state.js';

const SHOUTS = [
  'Come back here, dinner!',
  'I can smell the gravy!',
  'Hold still, drumstick!',
];

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
    cornerLane: 1,
    lungeT: 0,
    shoutT: 0,
    nextShout: 2.4,
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
  ai.cornerLane = 1;
  ai.lungeT = 0;
  ai.shoutT = 0;
  ai.nextShout = 2.4;
}

function say(ai, state, text, seconds) {
  ai.shoutT = seconds;
  state.shout = text;
  state.shoutT = seconds;
}

function cue(state, text, seconds) {
  const locked = state.banner === 'NEAR MISS!' || state.banner === 'OUCH!' || state.banner === 'GOBBLE!';
  if (locked && state.bannerT > 0.2) return;
  setBanner(state, text, seconds);
}

export function stepFarmer(ai, bird, state, dt, difficulty) {
  ai.stateT += dt;
  ai.phase += dt * (6.5 + difficulty * 2);
  ai.shoutT = Math.max(0, ai.shoutT - dt);
  ai.nextShout = Math.max(0, ai.nextShout - dt);
  state.shoutT = Math.max(0, state.shoutT - dt);
  if (state.shoutT <= 0) state.shout = '';

  const hidden = bird.hiding;
  const decoying = state.decoyT > 0;

  if ((hidden || decoying) && ai.state !== 'SEARCH') {
    ai.state = 'SEARCH';
    ai.stateT = 0;
    ai.lost = true;
    state.spotted = false;
    state.cornerLane = -1;
    cue(state, hidden ? 'HIDDEN' : 'DECOY!', 1.05);
    say(ai, state, '?', 1.2);
  }

  if (!hidden && !decoying && ai.state === 'SEARCH' && ai.stateT > 1.2) {
    ai.state = 'CHASE';
    ai.stateT = 0;
    ai.lost = false;
    state.spotted = true;
    cue(state, 'SPOTTED!', 0.95);
    say(ai, state, 'Come back here, dinner!', 1.35);
  }

  if (state.alerted) {
    state.alerted = false;
    ai.lost = false;
    if (hidden) {
      bird.hiding = false;
      state.hidden = false;
      state.hideMeter = 0;
    }
    ai.state = 'CHASE';
    ai.stateT = 0;
    state.farmerDist = Math.max(1.7, state.farmerDist - 1.55);
    state.spotted = true;
    cue(state, 'SPOTTED!', 1);
    say(ai, state, 'The hens gave you away!', 1.25);
  }

  let closeRate = hidden || decoying ? -1.7 : 1.35 + difficulty * 2.5;
  if (!hidden && !decoying && (bird.sliding > 0 || state.muddy)) closeRate += 1.5 + difficulty;
  if (!hidden && state.invuln > 0.82) closeRate += 2.4;
  if (bird.dashing > 0) closeRate -= 3.5;

  const targetGap = hidden || decoying ? 11 : Math.max(1.4, 6.1 - difficulty * 3.1);
  if (state.farmerDist > targetGap) state.farmerDist -= closeRate * dt;
  else state.farmerDist -= Math.max(0, closeRate) * 0.25 * dt;
  if (hidden || decoying) state.farmerDist += 1.5 * dt;
  state.farmerDist = Math.max(0.7, Math.min(16, state.farmerDist));

  const aligned = Math.abs(ai.x - bird.x) < 1.3;
  if (!hidden && !decoying && ai.state === 'CHASE' && state.farmerDist < FARMER.lungeGap && aligned) {
    ai.state = 'LUNGE';
    ai.stateT = 0;
    ai.lungeT = 0.52;
    say(ai, state, 'Got you, dinner!', 0.7);
  }

  if (ai.state === 'LUNGE') {
    ai.lungeT -= dt;
    const dodged = !bird.grounded || bird.sliding > 0.05 || Math.abs(LANES[bird.lane] - ai.x) > 1.2;
    if (dodged && ai.stateT > 0.14) {
      state.farmerDist = Math.min(12, state.farmerDist + 2.15);
      ai.state = 'CHASE';
      ai.stateT = 0;
      state.lungeMiss = true;
      say(ai, state, 'Come back here, dinner!', 1.15);
    } else if (ai.lungeT <= 0) {
      ai.state = 'CHASE';
      ai.stateT = 0;
    }
  }

  const cornerReady = !hidden && !decoying && ai.state === 'CHASE' && ai.stateT > 3.1 && difficulty > 0.32;
  if (cornerReady) {
    ai.state = 'CORNER';
    ai.stateT = 0;
    ai.cornerLane = bird.lane === 1 ? (bird.x >= 0 ? 2 : 0) : bird.lane;
    state.cornerLane = ai.cornerLane;
    cue(state, 'CORNERED!', 0.85);
    say(ai, state, '!', 1.15);
  }

  if (ai.state === 'CORNER') {
    state.cornerLane = ai.cornerLane;
    const ahead = bird.z - 3.4;
    ai.z += (ahead - ai.z) * Math.min(1, 4 * dt);
    if (ai.stateT > 1.15) {
      ai.state = 'CHASE';
      ai.stateT = 0;
      state.cornerLane = -1;
      ai.z = bird.z + state.farmerDist;
    }
  } else {
    state.cornerLane = -1;
    ai.z = bird.z + state.farmerDist;
  }

  if (ai.state === 'SEARCH') {
    ai.searchSweep += dt * (1.8 + difficulty);
    const wave = Math.sin(ai.searchSweep);
    const base = decoying ? state.decoyLane : bird.lane;
    ai.lane = Math.max(0, Math.min(2, base + (wave > 0.45 ? 1 : wave < -0.45 ? -1 : 0)));
  } else if (ai.state === 'CORNER') {
    ai.lane = ai.cornerLane;
  } else {
    ai.lane = bird.lane;
  }

  const targetX = LANES[ai.lane] + (ai.state === 'SEARCH' ? Math.sin(ai.searchSweep * 1.3) * 0.35 : 0);
  const follow = ai.state === 'CORNER' ? 8 : ai.state === 'LUNGE' ? 9 : 5;
  ai.x += (targetX - ai.x) * Math.min(1, follow * dt);

  if (ai.state === 'CHASE' && ai.nextShout <= 0 && state.farmerDist < 7 && state.shoutT <= 0) {
    say(ai, state, SHOUTS[Math.floor(ai.phase) % SHOUTS.length], 1.2);
    ai.nextShout = 4.5;
  }

  state.farmerState = ai.state;
  state.farmerSweep = ai.searchSweep;
  return ai.state;
}
