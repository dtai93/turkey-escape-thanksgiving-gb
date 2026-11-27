// Mutable run state. Screens, HUD and the simulation all read this object.

import { STAGE_LENGTH } from './config.js';
import { loadSave } from './save.js';

export const MODE_TITLE = 'title';
export const MODE_RUN = 'run';
export const MODE_PAUSE = 'pause';
export const MODE_END = 'end';

const STAGE_NAMES = ['FARMYARD', 'BARN & PORCH', 'KITCHEN'];

export function createState(seed) {
  const save = loadSave();
  return {
    seed,
    mode: MODE_TITLE,
    time: 0,
    distance: 0,
    score: 0,
    lives: 3,
    invuln: 0,
    stageIndex: 0,
    stageName: STAGE_NAMES[0],
    stageProgress: 0,
    stageLengths: STAGE_LENGTH.slice(),
    nearMisses: 0,
    kernels: 0,
    streak: 0,
    multiplier: 1,
    bestScore: save.bestScore,
    bestStage: save.bestStage,
    hats: save.hats,
    hat: save.hat,
    result: '',
    banner: '',
    bannerT: 0,
    farmerDist: 8,
    farmerState: 'CHASE',
    spotted: false,
    hidden: false,
    hideMeter: 0,
    decoys: 2,
    shake: 0,
    flash: 0,
    slow: 1,
    muted: save.muted,
    caughtPose: false,
    escapedPose: false,
  };
}

export function stageName(index) {
  return STAGE_NAMES[Math.max(0, Math.min(STAGE_NAMES.length - 1, index))];
}

export function setBanner(state, text, seconds = 1.1) {
  state.banner = text;
  state.bannerT = seconds;
}

export function resetRun(state) {
  state.mode = MODE_RUN;
  state.time = 0;
  state.distance = 0;
  state.score = 0;
  state.lives = 3;
  state.invuln = 0;
  state.stageIndex = 0;
  state.stageName = STAGE_NAMES[0];
  state.stageProgress = 0;
  state.nearMisses = 0;
  state.kernels = 0;
  state.streak = 0;
  state.multiplier = 1;
  state.result = '';
  state.banner = 'FARMYARD';
  state.bannerT = 1.6;
  state.farmerDist = 8.2;
  state.farmerState = 'CHASE';
  state.spotted = false;
  state.hidden = false;
  state.hideMeter = 0;
  state.decoys = 2;
  state.shake = 0;
  state.flash = 0;
  state.slow = 1;
  state.caughtPose = false;
  state.escapedPose = false;
}
