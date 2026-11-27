// Moves Tom along three lanes: side-step, jump, slide, dash, and a hide request.

import { LANES, TURKEY } from './config.js';

export function createTurkeyController() {
  return {
    lane: 1,
    x: 0,
    y: 0,
    vy: 0,
    z: 0,
    phase: 0,
    pose: 'idle',
    sliding: 0,
    dashing: 0,
    dashCd: 0,
    grounded: true,
    wantHide: false,
    hiding: false,
    speed: TURKEY.runSpeed,
  };
}

export function resetTurkey(bird) {
  bird.lane = 1;
  bird.x = LANES[1];
  bird.y = 0;
  bird.vy = 0;
  bird.z = 0;
  bird.phase = 0;
  bird.pose = 'idle';
  bird.sliding = 0;
  bird.dashing = 0;
  bird.dashCd = 0;
  bird.grounded = true;
  bird.wantHide = false;
  bird.hiding = false;
  bird.speed = TURKEY.runSpeed;
}

export function stepTurkey(bird, input, dt, running) {
  bird.dashCd = Math.max(0, bird.dashCd - dt);
  if (!running) {
    bird.pose = 'idle';
    bird.phase += dt * 2;
    return;
  }

  if (input.pressed.left) bird.lane = Math.max(0, bird.lane - 1);
  if (input.pressed.right) bird.lane = Math.min(LANES.length - 1, bird.lane + 1);

  const target = LANES[bird.lane];
  bird.x += (target - bird.x) * Math.min(1, TURKEY.sideLerp * dt);

  if (input.pressed.dash && bird.dashCd <= 0 && bird.dashing <= 0 && !bird.hiding) {
    bird.dashing = TURKEY.dashTime;
    bird.dashCd = TURKEY.dashCooldown;
  }
  bird.dashing = Math.max(0, bird.dashing - dt);
  bird.speed = bird.dashing > 0 ? TURKEY.dashSpeed : TURKEY.runSpeed;

  const jumpPressed = input.pressed.jump || input.pressed.up;
  if (jumpPressed && bird.grounded && bird.sliding <= 0 && !bird.hiding) {
    bird.vy = TURKEY.jumpV;
    bird.grounded = false;
  }

  const slidePressed = input.pressed.down && !input.pressed.up;
  if (slidePressed && bird.grounded && bird.sliding <= 0 && !bird.hiding) {
    bird.sliding = TURKEY.slideTime;
  }
  bird.sliding = Math.max(0, bird.sliding - dt);

  bird.wantHide = Boolean(input.held.hide || input.pressed.hide);

  bird.vy -= TURKEY.gravity * dt;
  bird.y += bird.vy * dt;
  if (bird.y <= 0) {
    bird.y = 0;
    bird.vy = 0;
    bird.grounded = true;
  }

  const pace = bird.dashing > 0 ? 16 : 11;
  bird.phase += dt * pace;

  if (bird.hiding) bird.pose = 'hide';
  else if (!bird.grounded) bird.pose = 'jump';
  else if (bird.sliding > 0) bird.pose = 'slide';
  else bird.pose = 'run';
}

export function turkeyHeight(bird) {
  if (bird.hiding) return 0.55;
  if (bird.sliding > 0) return TURKEY.slideHeight;
  return TURKEY.height;
}
