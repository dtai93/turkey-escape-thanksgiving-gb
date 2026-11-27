// Deterministic scenes for ?shot=cover|kitchen|title|end&seed=1.
// Each one runs the real simulation a fixed number of steps, then the loop freezes.

import { resetRun } from './game-state.js';
import { resetTurkey } from './turkey-controller.js';
import { resetFarmer } from './farmer-ai.js';
import { STAGES } from './stages.js';

export function readQuery() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('shot');
  const seed = Number(params.get('seed') || '1') || 1;
  return { name, seed };
}

export function shotSteps(name) {
  if (name === 'cover') return 48;
  if (name === 'kitchen') return 72;
  if (name === 'title') return 30;
  if (name === 'end') return 40;
  if (name === 'escaped') return 24;
  return 0;
}

function showHats(state) {
  state.bestScore = Math.max(state.bestScore, 2480);
  state.bestStage = Math.max(state.bestStage, 3);
  if (state.hats.indexOf('straw') < 0) state.hats.push('straw');
  state.hat = 'straw';
}

export function prepareShot(name, state, bird, farmer) {
  if (!name) return;
  resetTurkey(bird);
  resetFarmer(farmer);
  showHats(state);
  if (name === 'title') {
    state.mode = 'title';
    state.farmerDist = 2.5;
    state.farmerState = 'SEARCH';
    state.shout = '?';
    state.shoutT = 4;
    farmer.z = 4.6;
    farmer.x = 2.15;
    farmer.state = 'SEARCH';
    return;
  }
  resetRun(state);
  showHats(state);
  state.stamina = 0.72;
  if (name === 'kitchen') {
    const skip = STAGES[0].length + STAGES[1].length + 18;
    state.distance = skip;
    bird.z = -skip;
    state.stageIndex = 2;
    state.stageName = 'KITCHEN';
    state.stageProgress = 18 / STAGES[2].length;
    state.score = 1860;
    state.lives = 2;
    state.farmerDist = 4.4;
    state.nearMisses = 3;
    state.decoys = 1;
    state.banner = '';
    state.bannerT = 0;
    farmer.state = 'CHASE';
  } else if (name === 'end') {
    state.distance = 206;
    bird.z = -206;
    state.score = 1120;
    state.lives = 1;
    state.farmerDist = 2.1;
    state.nearMisses = 6;
    state.stageIndex = 1;
    state.stageName = 'BARN & PORCH';
    state.stageProgress = 0.42;
    state.decoys = 1;
  } else if (name === 'escaped') {
    const skip = STAGES[0].length + STAGES[1].length + STAGES[2].length - 6;
    state.distance = skip;
    bird.z = -skip;
    state.stageIndex = 2;
    state.stageName = 'KITCHEN';
    state.score = 2740;
    state.farmerDist = 6.5;
    state.nearMisses = 9;
  } else {
    state.farmerDist = 3.4;
    state.score = 240;
    state.nearMisses = 1;
    state.banner = '';
    state.bannerT = 0;
    state.stageName = 'FARMYARD';
    state.stageIndex = 0;
    farmer.state = 'CHASE';
  }
}

export function autopilot(name, step, input) {
  if (name === 'cover') {
    if (step === 40) input.tap('jump');
    if (step === 22) input.tap('right');
  } else if (name === 'kitchen') {
    if (step === 22) input.tap('jump');
    if (step === 48) input.tap('down');
  } else if (name === 'end') {
    if (step === 12) input.tap('left');
    if (step === 28) input.tap('jump');
  }
}
