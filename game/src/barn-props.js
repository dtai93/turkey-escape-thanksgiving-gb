// Barn and porch dressing: stalls, lanterns, barrels, a ladder, a chicken.

import * as THREE from 'three';
import { PALETTE } from './config.js';
import { textured } from './textures.js';

function mat(color) {
  return new THREE.MeshLambertMaterial({ color });
}

function mesh(geo, color, x, y, z, parent, material) {
  const m = new THREE.Mesh(geo, material || mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

export function makeStall() {
  const g = new THREE.Group();
  const post = textured('wood', 1, 2, 0x8a5a32);
  const board = textured('wood', 2, 1);
  mesh(new THREE.BoxGeometry(0.12, 1.6, 1.6), 0x7a4e2c, -0.7, 0.8, 0, g, post);
  mesh(new THREE.BoxGeometry(0.12, 1.6, 1.6), 0x7a4e2c, 0.7, 0.8, 0, g, post);
  mesh(new THREE.BoxGeometry(1.5, 0.7, 0.1), 0xc4925a, 0, 0.45, 0.75, g, board);
  mesh(new THREE.BoxGeometry(1.4, 0.08, 1.4), 0xd8b56a, 0, 0.08, 0, g, textured('wood', 2, 2, 0xe0c090));
  g.userData.kind = 'stall';
  return g;
}

export function makeBarrel() {
  const g = new THREE.Group();
  const body = mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.85, 12),
    0x8a4e28,
    0, 0.42, 0, g,
    textured('wood', 2, 1, 0x9a5828),
  );
  body.userData.roll = true;
  mesh(new THREE.TorusGeometry(0.39, 0.035, 6, 12), 0x5a3218, 0, 0.62, 0, g).rotation.x = Math.PI / 2;
  mesh(new THREE.TorusGeometry(0.39, 0.035, 6, 12), 0x5a3218, 0, 0.22, 0, g).rotation.x = Math.PI / 2;
  g.userData.kind = 'barrel';
  g.userData.solid = true;
  g.userData.jumpOver = true;
  g.userData.hide = true;
  g.userData.h = 0.85;
  g.userData.tick = (t) => {
    const last = g.userData.lastT == null ? t : g.userData.lastT;
    const dt = Math.min(0.05, Math.max(0, t - last));
    g.userData.lastT = t;
    g.position.z += 1.6 * dt;
    body.rotation.x += dt * 5;
  };
  return g;
}

export function makeLadder() {
  const g = new THREE.Group();
  const rail = textured('wood', 1, 3);
  const rung = textured('wood', 2, 1, 0xe0c090);
  mesh(new THREE.BoxGeometry(0.08, 2.2, 0.08), 0xc49a58, -0.28, 1.1, 0, g, rail);
  mesh(new THREE.BoxGeometry(0.08, 2.2, 0.08), 0xc49a58, 0.28, 1.1, 0, g, rail);
  for (let i = 0; i < 5; i += 1) {
    mesh(new THREE.BoxGeometry(0.64, 0.06, 0.06), 0xd8b56a, 0, 0.3 + i * 0.4, 0, g, rung);
  }
  g.rotation.x = 0.15;
  g.userData.kind = 'ladder';
  return g;
}

export function makeHangingLantern() {
  const g = new THREE.Group();
  mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4), 0x3a3028, 0, 2.4, 0, g);
  mesh(new THREE.BoxGeometry(0.22, 0.28, 0.22), 0x2a241c, 0, 1.85, 0, g);
  const glow = mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), PALETTE.lantern, 0, 1.85, 0, g);
  glow.material = new THREE.MeshBasicMaterial({ color: PALETTE.lantern });
  g.userData.kind = 'lantern';
  g.userData.tick = (t) => {
    g.rotation.z = Math.sin(t * 2.1) * 0.28;
  };
  return g;
}

export function makeChicken() {
  const g = new THREE.Group();
  mesh(new THREE.SphereGeometry(0.18, 8, 6), 0xf4f0e4, 0, 0.28, 0, g);
  mesh(new THREE.SphereGeometry(0.1, 6, 5), 0xf4f0e4, 0, 0.4, 0.14, g);
  const beak = mesh(new THREE.ConeGeometry(0.04, 0.1, 4), 0xe09030, 0, 0.38, 0.24, g);
  beak.rotation.x = Math.PI / 2;
  mesh(new THREE.BoxGeometry(0.16, 0.03, 0.1), 0xe8e0d0, 0.12, 0.32, 0, g);
  mesh(new THREE.ConeGeometry(0.08, 0.12, 4), 0xc43028, 0, 0.48, 0.02, g);
  g.userData.kind = 'chicken';
  g.userData.alert = true;
  return g;
}

export function makePorch() {
  const g = new THREE.Group();
  const deck = textured('wood', 4, 3);
  const post = textured('wood', 1, 3, 0x8a5a32);
  mesh(new THREE.BoxGeometry(7, 0.15, 4), 0xc4a06a, 0, 0.2, 0, g, deck);
  mesh(new THREE.BoxGeometry(0.15, 2.2, 0.15), 0x8a5a32, -3.2, 1.3, 1.6, g, post);
  mesh(new THREE.BoxGeometry(0.15, 2.2, 0.15), 0x8a5a32, 3.2, 1.3, 1.6, g, post);
  mesh(new THREE.BoxGeometry(6.6, 0.12, 0.16), 0x6a3a28, 0, 2.4, 1.6, g, textured('wood', 4, 1, 0x6a3a28));
  g.userData.kind = 'porch';
  return g;
}
