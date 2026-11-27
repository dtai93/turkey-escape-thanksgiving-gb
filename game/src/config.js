// Shared numbers for Cranberry Hollow. One place so every system agrees.

export const STEP = 1 / 60;

export const LANES = [-2.35, 0, 2.35];
export const LANE_COUNT = 3;

export const WORLD = {
  segmentLength: 20,
  segments: 8,
  laneHalf: 1.05,
};

export const TURKEY = {
  runSpeed: 12.5,
  dashSpeed: 19.5,
  dashTime: 0.38,
  dashCooldown: 1.15,
  sideLerp: 14,
  jumpV: 9.6,
  gravity: 26,
  slideTime: 0.55,
  height: 1.35,
  slideHeight: 0.55,
  radius: 0.48,
};

export const FARMER = {
  baseGap: 7.6,
  minGap: 1.2,
  catchGap: 1.05,
  lungeGap: 3.5,
  catchLane: 0.9,
};

export const STAGE_LENGTH = [190, 220, 200];

export const PALETTE = {
  skyTop: 0x3c2848,
  skyHorizon: 0xffb15e,
  fog: 0xe08848,
  ground: 0x6e552c,
  grass: 0x6d7a36,
  dirt: 0x8a6236,
  barn: 0xa33228,
  hay: 0xd4a03c,
  pumpkin: 0xe06818,
  corn: 0xf0d060,
  leaf: 0xc44818,
  turkey: 0x8c4822,
  turkeyLight: 0xc47840,
  cream: 0xf3e0bc,
  wattle: 0xc42028,
  head: 0xd5e4ee,
  beak: 0xe8a030,
  legs: 0xe07828,
  hat: 0xe6c56a,
  shirt: 0xb4322c,
  denim: 0x3a5278,
  boot: 0x3e2a1c,
  lantern: 0xffcc66,
};
