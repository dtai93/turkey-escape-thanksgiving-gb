// Scrolling lane segments. Each one is dressed for the stage it belongs to, then recycled ahead.

import * as THREE from 'three';
import { LANES, PALETTE, WORLD } from './config.js';
import { makeRng, range, chance } from './random.js';
import { stageAtDistance, totalLength } from './stages.js';
import { makeHayBale, makeHayTuft, makeLeafPile, makePumpkin, makeCornStalk, makeFenceRun, makeBarn, makeCoop, makeMud, makeKernel } from './farmyard-props.js';
import { textured } from './textures.js';
import { makeStall, makeBarrel, makeLadder, makeHangingLantern, makeChicken, makePorch } from './barn-props.js';
import { makeCounter, makeCabinet, makePieTins, makeRoastingPan, makeGravyBoat, makeRollingPin, kitchenFloor } from './kitchen-props.js';
import { makeOven, makeKnife } from './hazards.js';
import { gatherInteractive } from './collisions.js';

const LEN = WORLD.segmentLength;

function mat(color) {
  return new THREE.MeshLambertMaterial({ color });
}

function box(parent, w, h, d, color, x, y, z, material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material || mat(color));
  m.position.set(x, y, z);
  m.receiveShadow = true;
  m.castShadow = h > 0.2;
  parent.add(m);
  return m;
}

function empty(group) {
  const dump = group.children.splice(0, group.children.length);
  for (let i = 0; i < dump.length; i += 1) {
    dump[i].traverse((obj) => {
      if (obj.geometry && !obj.geometry.userData.shared) obj.geometry.dispose();
      const material = obj.material;
      const list = Array.isArray(material) ? material : (material ? [material] : []);
      list.forEach((m) => {
        if (m && !m.userData.shared) m.dispose();
      });
    });
  }
}

function place(group, obj, x, z) {
  obj.position.set(x, 0, z);
  group.add(obj);
  return obj;
}

function dressFarmyard(group, index, rng) {
  box(group, 16, 0.25, LEN, PALETTE.ground, 0, -0.12, -LEN / 2, textured('dirt', 8, 10));
  box(group, 5, 0.08, LEN, PALETTE.grass, -6.2, 0.02, -LEN / 2, textured('grass', 3, 8));
  box(group, 5, 0.08, LEN, PALETTE.grass, 6.2, 0.02, -LEN / 2, textured('grass', 3, 8));
  for (let i = 0; i < LANES.length; i += 1) {
    box(group, 1.7, 0.04, LEN, i === 1 ? 0x7a6234 : 0x745c30, LANES[i], 0.045, -LEN / 2, textured('dirt', 2, 12, 0xd8c090));
  }
  const fenceL = makeFenceRun(LEN - 1);
  fenceL.position.set(-4.6, 0, -0.5);
  group.add(fenceL);
  const fenceR = makeFenceRun(LEN - 1);
  fenceR.position.set(4.6, 0, -0.5);
  group.add(fenceR);

  const lane = index === 0 ? 1 : index % 3;
  place(group, makeHayBale(), LANES[lane], index === 0 ? -6.15 : -8);
  if (index % 2 === 0) place(group, makePumpkin(), LANES[(lane + 1) % 3], -14);
  place(group, makeMud(), LANES[(lane + 2) % 3], -5);
  place(group, makeKernel(), LANES[(lane + 1) % 3], -11);
  place(group, makeKernel(), LANES[lane], -17);

  for (let k = 0; k < 4; k += 1) {
    place(group, makeCornStalk(), -5.4, -2 - k * 4.2);
    place(group, makeCornStalk(), 5.5, -3 - k * 4.2);
  }
  if (index % 3 === 0) {
    const barn = makeBarn();
    barn.position.set(8.2, 0, -10);
    barn.rotation.y = -0.4;
    group.add(barn);
  }
  if (index % 3 === 1) {
    const coop = makeCoop();
    coop.position.set(-6.6, 0, -12);
    group.add(coop);
  }
  if (chance(rng, 0.6)) place(group, makePumpkin(), 3.6, -range(rng, 2, 16));
  for (let s = 0; s < 3; s += 1) {
    place(group, makeLeafPile(), -3.9, -2.4 - s * 6);
    place(group, makeLeafPile(), 3.95, -4.2 - s * 5.5);
  }
  place(group, makeHayTuft(), -4.15, -8);
  place(group, makeHayTuft(), 4.2, -14);
  place(group, makePumpkin(), index % 2 === 0 ? -3.75 : 3.8, -17.5);
}

function dressBarn(group, index, rng) {
  box(group, 14, 0.25, LEN, 0x6a4630, 0, -0.12, -LEN / 2, textured('dirt', 6, 8, 0x7a5840));
  box(group, 8, 0.08, LEN, 0xc4a06a, 0, -0.02, -LEN / 2, textured('wood', 4, 10));
  for (let i = 0; i < LANES.length; i += 1) {
    box(group, 1.55, 0.04, LEN, 0xb8905a, LANES[i], 0.06, -LEN / 2, textured('wood', 1, 8, 0xe4c898));
  }
  const porch = makePorch();
  porch.position.set(0, 0, -LEN / 2);
  group.add(porch);
  place(group, makeStall(), -3.8, -4);
  place(group, makeStall(), 3.8, -12);
  place(group, makeBarrel(), LANES[index % 3], -8);
  place(group, makeBarrel(), LANES[(index + 1) % 3], -15);
  const ladder = makeLadder();
  ladder.position.set(-4.4, 0, -9);
  group.add(ladder);
  const lantern = makeHangingLantern();
  lantern.position.set(LANES[1], 0, -6);
  group.add(lantern);
  place(group, makeChicken(), LANES[(index + 2) % 3], -11);
  place(group, makeKernel(), LANES[(index + 1) % 3], -3);
  if (chance(rng, 0.5)) place(group, makeBarrel(), LANES[(index + 2) % 3], -18);
}

function dressKitchen(group, index, rng) {
  box(group, 12, 0.2, LEN, 0x8a4038, 0, -0.12, -LEN / 2);
  const floor = kitchenFloor();
  floor.position.z = 0;
  group.add(floor);
  const left = makeCounter(LEN);
  left.position.set(-3.5, 0, 0);
  group.add(left);
  const right = makeCounter(LEN);
  right.position.set(3.5, 0, 0);
  group.add(right);
  box(group, 0.4, 3.4, LEN, 0xf4ead8, -5.4, 1.7, -LEN / 2, textured('cabinet', 1, 6, 0xf7f1e4));
  box(group, 0.4, 3.4, LEN, 0xf4ead8, 5.4, 1.7, -LEN / 2, textured('cabinet', 1, 6, 0xf7f1e4));
  box(group, 11.2, 0.16, LEN, 0xe4d4bc, 0, 3.35, -LEN / 2);
  box(group, 0.08, 0.85, 1.6, 0xffc878, -5.15, 2.15, -7);
  box(group, 0.08, 0.85, 1.6, 0xffc878, 5.15, 2.15, -16);
  box(group, 1.1, 0.7, 0.08, 0x8e2c32, -5.15, 2.55, -12);
  place(group, makeCabinet(), -3.5, -3);
  place(group, makeCabinet(), 3.5, -14);
  const oven = makeOven();
  oven.userData.phase = (index % 3) * 0.7;
  place(group, oven, LANES[index % 3], -8);
  const knife = makeKnife();
  knife.userData.phase = (index % 4) * 0.4;
  place(group, knife, LANES[(index + 1) % 3], -15);
  place(group, makePieTins(), LANES[(index + 2) % 3], -5);
  place(group, makeRoastingPan(), LANES[(index + 1) % 3], -11);
  place(group, makeGravyBoat(), LANES[index % 3], -18);
  if (chance(rng, 0.7)) place(group, makeRollingPin(), LANES[(index + 2) % 3], -2);
  place(group, makeKernel(), LANES[(index + 2) % 3], -12);
}

function dressWoods(group) {
  box(group, 16, 0.25, LEN, 0x3e5a28, 0, -0.12, -LEN / 2, textured('grass', 6, 8, 0x6a7038));
  for (let i = 0; i < 6; i += 1) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 1.4, 6), mat(0x5a3a22));
    trunk.position.y = 0.7;
    tree.add(trunk);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.4, 7), mat(i % 2 ? 0xc45020 : 0xd4882a));
    crown.position.y = 2.2;
    tree.add(crown);
    tree.position.set(i < 3 ? -4.5 - (i % 3) : 4.2 + (i % 3), 0, -3 - i * 2.6);
    group.add(tree);
  }
}

function dress(group, index, seed) {
  empty(group);
  const rng = makeRng((seed + index * 97) >>> 0);
  const info = stageAtDistance(index * LEN + 2);
  if (index * LEN >= totalLength()) {
    dressWoods(group);
    return info;
  }
  if (info.stage.id === 'kitchen') dressKitchen(group, index, rng);
  else if (info.stage.id === 'barn') dressBarn(group, index, rng);
  else dressFarmyard(group, index, rng);
  return info;
}

export function createTrack(scene, seed) {
  const root = new THREE.Group();
  root.name = 'track';
  scene.add(root);
  const segments = [];
  let cursor = 0;
  for (let i = 0; i < WORLD.segments; i += 1) {
    const group = new THREE.Group();
    root.add(group);
    const seg = { group, index: i, startZ: -i * LEN };
    group.position.z = seg.startZ;
    dress(group, i, seed);
    segments.push(seg);
    cursor = i + 1;
  }
  const interactive = [];

  function recycle(distance) {
    const birdZ = -distance;
    for (let guard = 0; guard < 40; guard += 1) {
      let moved = false;
      for (let i = 0; i < segments.length; i += 1) {
        const seg = segments[i];
        if (seg.startZ <= birdZ + 30) continue;
        let furthest = 0;
        for (let k = 0; k < segments.length; k += 1) furthest = Math.min(furthest, segments[k].startZ);
        seg.index = cursor;
        cursor += 1;
        seg.startZ = furthest - LEN;
        seg.group.position.z = seg.startZ;
        dress(seg.group, seg.index, seed);
        moved = true;
      }
      if (!moved) break;
    }
    gatherInteractive(root, interactive);
  }

  gatherInteractive(root, interactive);
  return { root, segments, interactive, recycle, length: LEN };
}
