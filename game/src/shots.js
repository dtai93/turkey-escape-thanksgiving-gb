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
  if (name === 'cover') return 40;
  if (name === 'kitchen') return 90;
  if (name === 'title') return 24;
  if (name === 'end') return 36;
  if (name === 'escaped') return 20;
  return 0;
}

export function prepareShot(name, state, bird, farmer) {
  if (!name) return;
  resetTurkey(bird);
  resetFarmer(farmer);
  if (name === 'title') {
    state.mode = 'title';
    state.farmerDist = 5.5;
    farmer.z = 5.5;
    return;
  }
  resetRun(state);
  if (name === 'kitchen') {
    const skip = STAGES[0].length + STAGES[1].length + 12;
    state.distance = skip;
    bird.z = -skip;
    state.stageIndex = 2;
    state.stageName = 'KITCHEN';
    state.stageProgress = 12 / STAGES[2].length;
    state.score = 1480;
    state.farmerDist = 4.2;
    state.banner = 'KITCHEN';
    state.bannerT = 1.2;
  } else if (name === 'end') {
    state.distance = 96;
    bird.z = -96;
    state.score = 860;
    state.lives = 1;
    state.farmerDist = 2.4;
    state.nearMisses = 4;
  } else if (name === 'escaped') {
    const skip = STAGES[0].length + STAGES[1].length + STAGES[2].length - 4;
    state.distance = skip;
    bird.z = -skip;
    state.stageIndex = 2;
    state.stageName = 'KITCHEN';
    state.score = 2400;
    state.farmerDist = 6;
    state.nearMisses = 9;
  } else {
    state.farmerDist = 3.55;
    state.score = 120;
    state.banner = '';
    state.bannerT = 0;
  }
}

export function autopilot(name, step, input) {
  if (name === 'cover') {
    if (step === 16) input.tap('jump');
  } else if (name === 'kitchen') {
    if (step === 20 || step === 55) input.tap('jump');
    if (step === 34) input.tap('left');
    if (step === 70) input.tap('down');
  } else if (name === 'end') {
    if (step === 8) input.tap('left');
  } else if (name === 'title') {
    /* idle on the yard */
  }
}
