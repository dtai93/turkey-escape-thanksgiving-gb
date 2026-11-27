// Boot, fixed timestep, and the chase. Shot queries run a fixed burst, then freeze.

import * as THREE from 'three';
import { STEP, FARMER, TURKEY } from './config.js';
import { createInput } from './input.js';
import { createState, MODE_TITLE, MODE_RUN, MODE_PAUSE, MODE_END, setBanner, resetRun, stageName } from './game-state.js';
import { createTurkey } from './turkey-model.js';
import { createTurkeyController, resetTurkey, stepTurkey } from './turkey-controller.js';
import { createFarmer } from './farmer-model.js';
import { createFarmerAi, resetFarmer, stepFarmer } from './farmer-ai.js';
import { createLighting } from './lighting-and-sky.js';
import { createTrack } from './track-builder.js';
import { tickHazards } from './hazards.js';
import { resolveContacts } from './collisions.js';
import { stepHide } from './hiding-spots.js';
import { addDistance, addKernel, addNearMiss, applyHit } from './scoring.js';
import { stageAtDistance, difficultyOf, totalLength } from './stages.js';
import { createCameraRig } from './camera-rig.js';
import { createParticles } from './particles.js';
import { createHud } from './hud.js';
import { createScreens } from './screens.js';
import { createAudio } from './audio.js';
import { recordRun, writeSave } from './save.js';
import { makeRng } from './random.js';
import { readQuery, shotSteps, prepareShot, autopilot } from './shots.js';

const query = readQuery();
const view = document.getElementById('view');
const hudCanvas = document.getElementById('hud');

const renderer = new THREE.WebGLRenderer({ canvas: view, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 180);
const lighting = createLighting(scene);
const particles = createParticles(scene);
const turkey = createTurkey();
const farmerMesh = createFarmer();
scene.add(turkey);
scene.add(farmerMesh);

const state = createState(query.seed);
const bird = createTurkeyController();
const farmer = createFarmerAi();
const input = createInput();
const track = createTrack(scene, query.seed || 1);
const rig = createCameraRig(camera);
const hud = createHud(hudCanvas);
const audio = createAudio();
const rng = makeRng(query.seed || 1);
audio.setMuted(state.muted);
turkey.userData.setHat(state.hat);

const screens = createScreens(() => beginRun());

function layout() {
  camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  hud.resize();
}
window.addEventListener('resize', layout);

function finish(result) {
  state.mode = MODE_END;
  state.result = result;
  state.caughtPose = result === 'caught';
  state.escapedPose = result === 'escaped';
  state.banner = '';
  state.bannerT = 0;
  recordRun(state);
  if (result === 'escaped') audio.fanfare();
  else audio.sting();
}

function beginRun() {
  resetTurkey(bird);
  resetFarmer(farmer);
  resetRun(state);
  turkey.userData.setHat(state.hat);
  rig.snap = true;
  track.recycle(0);
  audio.unlock();
}

function syncWorld(dt) {
  turkey.position.set(bird.x, bird.y, bird.z);
  turkey.userData.update(bird.phase, state.mode === MODE_TITLE ? 'idle' : bird.pose, bird.y);
  farmerMesh.position.set(farmer.x, 0, farmer.z);
  farmerMesh.userData.update(farmer.phase, farmer.state);
  if (state.caughtPose) {
    farmerMesh.position.z = bird.z + 1.15;
    farmerMesh.position.x = bird.x + 0.15;
    turkey.userData.update(bird.phase, 'panic', bird.y);
  }
  lighting.follow(bird.x, bird.z);
  rig.update(bird, farmer, state, dt);
  if (state.flash > 0) {
    renderer.setClearColor(0xff6a4a, 1);
  }
}

function simulate(dt) {
  state.time += dt;
  state.bannerT = Math.max(0, state.bannerT - dt);
  state.invuln = Math.max(0, state.invuln - dt);
  state.shake = Math.max(0, state.shake - dt);
  state.flash = Math.max(0, state.flash - dt);
  state.slow = Math.max(0, state.slow - dt);

  if (input.pressed.mute) {
    state.muted = !state.muted;
    audio.setMuted(state.muted);
    writeSave(state);
  }

  if (state.mode === MODE_TITLE) {
    stepTurkey(bird, input, dt, false);
    bird.z = 0;
    farmer.z = bird.z + state.farmerDist;
    farmer.x += (bird.x + 1.4 - farmer.x) * Math.min(1, 3 * dt);
    farmer.phase += dt * 6;
    farmer.state = 'CHASE';
    if (input.pressed.jump || input.pressed.up) beginRun();
    track.recycle(0);
    tickHazards(track.root, state.time);
    particles.ambient({ x: bird.x, z: bird.z }, rng);
    particles.tick(dt);
    return;
  }

  if (state.mode === MODE_END) {
    bird.phase += dt * 8;
    farmer.phase += dt * 8;
    particles.tick(dt);
    return;
  }

  if (input.pressed.pause) {
    state.mode = state.mode === MODE_PAUSE ? MODE_RUN : MODE_PAUSE;
  }
  if (state.mode === MODE_PAUSE) return;

  if (input.pressed.restart) {
    beginRun();
    return;
  }

  const info = stageAtDistance(state.distance);
  if (info.index !== state.stageIndex) {
    state.stageIndex = info.index;
    state.stageName = stageName(info.index);
    setBanner(state, state.stageName, 1.4);
    audio.shout();
  }
  state.stageProgress = Math.max(0, Math.min(1, info.into / info.stage.length));
  const difficulty = difficultyOf(info);

  stepTurkey(bird, input, dt, true);
  if (input.pressed.decoy && state.decoys > 0 && !bird.hiding) {
    state.decoys -= 1;
    state.farmerDist = Math.min(14, state.farmerDist + 2.8);
    farmer.state = 'SEARCH';
    farmer.stateT = 0;
    setBanner(state, 'HIDDEN', 0.8);
    particles.puffFeathers(bird.x, 1.2, bird.z + 1.4);
    audio.gobble();
  }

  let forward = bird.dashing > 0 ? TURKEY.dashSpeed : info.stage.speed;
  track.recycle(state.distance);
  tickHazards(track.root, state.time);
  const contacts = resolveContacts(track.interactive, bird, 0);
  const hide = stepHide(state, bird, contacts.hideSpot, dt);
  if (hide === 'found') {
    setBanner(state, 'SPOTTED!', 0.9);
    audio.shout();
    state.farmerDist = Math.max(2.2, state.farmerDist - 1.2);
  }
  if (contacts.slow && !bird.hiding) forward *= 0.62;
  if (state.slow > 0) forward *= 0.78;

  const metres = forward * dt;
  bird.z -= metres;
  addDistance(state, metres);

  stepFarmer(farmer, bird, state, dt, difficulty);

  if (contacts.pickup) {
    addKernel(state);
    audio.gobble();
  }
  if (contacts.near && state.invuln <= 0) {
    addNearMiss(state);
    audio.whoosh();
    particles.puffFeathers(bird.x, 1.1 + bird.y, bird.z);
  }
  if (contacts.alert && !bird.hiding) {
    state.farmerDist = Math.max(1.4, state.farmerDist - 0.7 * dt);
    if (state.bannerT <= 0) setBanner(state, 'SPOTTED!', 0.6);
  }
  if (contacts.hit && state.invuln <= 0 && !bird.hiding) {
    applyHit(state);
    audio.thud();
    particles.puffFeathers(bird.x, 1, bird.z);
    bird.hiding = false;
    if (state.lives <= 0) finish('caught');
  }

  const sameLane = Math.abs(farmer.x - bird.x) < FARMER.catchLane;
  if (state.mode === MODE_RUN && state.farmerDist < FARMER.catchGap && sameLane && !bird.hiding && state.invuln <= 0) {
    applyHit(state);
    audio.thud();
    audio.shout();
    particles.puffFeathers(bird.x, 1, bird.z);
    if (state.lives <= 0) finish('caught');
  }

  if (state.mode === MODE_RUN && state.distance >= totalLength()) finish('escaped');

  particles.ambient(bird, rng);
  if (info.stage.id === 'kitchen' && rng() < 0.12) particles.puffFire(bird.x + 1.2, 0.5, bird.z - 5);
  particles.tick(dt);
  audio.tick(dt, true);
  if (farmer.state === 'LUNGE' && state.bannerT <= 0) setBanner(state, 'FARMER CLOSING IN', 0.6);
}

let shotLeft = query.name ? shotSteps(query.name) : 0;
if (query.name) prepareShot(query.name, state, bird, farmer);

let acc = 0;
let last = performance.now();
let simSteps = 0;

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (query.name) {
    renderer.render(scene, camera);
    hud.draw(state);
    screens.show(state);
    return;
  }
  acc += dt;
  let guard = 0;
  while (acc >= STEP && guard < 5) {
    input.pump();
    simulate(STEP);
    acc -= STEP;
    guard += 1;
  }
  syncWorld(STEP);
  renderer.render(scene, camera);
  hud.draw(state);
  screens.show(state);
  requestAnimationFrame(frame);
}

if (query.name) {
  while (shotLeft > 0) {
    input.pump();
    autopilot(query.name, simSteps, input);
    simulate(STEP);
    simSteps += 1;
    shotLeft -= 1;
  }
  if (query.name === 'end' && state.mode !== MODE_END) finish('caught');
  if (query.name === 'escaped' && state.mode !== MODE_END) finish('escaped');
  if (query.name === 'cover') {
    state.banner = 'NEAR MISS!';
    state.bannerT = 2;
    if (farmer.state !== 'LUNGE') farmer.state = 'LUNGE';
  }
  syncWorld(STEP);
  renderer.render(scene, camera);
  hud.draw(state);
  screens.show(state);
  requestAnimationFrame(frame);
} else {
  track.recycle(0);
  syncWorld(STEP);
  requestAnimationFrame(frame);
}
