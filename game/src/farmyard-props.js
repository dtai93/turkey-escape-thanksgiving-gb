// Farmyard dressing: fences, hay, pumpkins, corn, a red barn and a coop.

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

export function makeHayBale() {
  const g = new THREE.Group();
  const bale = mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 1.15, 12),
    PALETTE.hay,
    0, 0.55, 0, g,
    textured('hay', 2, 1),
  );
  bale.rotation.z = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(0.57, 0.57, 0.08, 12), 0xc48a28, 0.35, 0.55, 0, g).rotation.z = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(0.57, 0.57, 0.08, 12), 0xc48a28, -0.35, 0.55, 0, g).rotation.z = Math.PI / 2;
  g.userData.kind = 'hay';
  g.userData.solid = true;
  g.userData.jumpOver = true;
  g.userData.hide = true;
  g.userData.h = 1.05;
  return g;
}

export function makeHayTuft() {
  const g = new THREE.Group();
  const hay = textured('hay', 1, 2);
  for (let i = 0; i < 5; i += 1) {
    const blade = mesh(new THREE.BoxGeometry(0.05, 0.32, 0.1), PALETTE.hay, (i - 2) * 0.07, 0.16, 0, g, hay);
    blade.rotation.z = (i - 2) * 0.28;
    blade.castShadow = false;
  }
  g.userData.kind = 'tuft';
  return g;
}

export function makeLeafPile() {
  const g = new THREE.Group();
  const colors = [0xc45028, 0xe0a040, 0x8c3028, 0xd8c060];
  for (let i = 0; i < 6; i += 1) {
    const leaf = mesh(new THREE.CircleGeometry(0.11, 6), colors[i % 4], (i - 2.5) * 0.09, 0.035, ((i % 3) - 1) * 0.07, g);
    leaf.rotation.x = -Math.PI / 2;
    leaf.rotation.z = i * 0.7;
    leaf.castShadow = false;
  }
  g.userData.kind = 'leaves';
  return g;
}

export function makePumpkin() {
  const g = new THREE.Group();
  const body = mesh(new THREE.SphereGeometry(0.38, 10, 8), PALETTE.pumpkin, 0, 0.32, 0, g);
  body.scale.set(1.05, 0.85, 1);
  mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.18, 5), 0x3e6a28, 0, 0.68, 0, g);
  mesh(new THREE.BoxGeometry(0.22, 0.04, 0.1), 0x4a7a30, 0.08, 0.72, 0, g).rotation.z = 0.5;
  g.userData.kind = 'pumpkin';
  g.userData.solid = true;
  g.userData.jumpOver = true;
  g.userData.h = 0.7;
  return g;
}

export function makeCornStalk() {
  const g = new THREE.Group();
  mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.7, 5), 0x6a8a32, 0, 0.85, 0, g);
  mesh(new THREE.ConeGeometry(0.28, 0.7, 5), 0x7ea038, 0.12, 1.35, 0, g).rotation.z = -0.4;
  mesh(new THREE.ConeGeometry(0.24, 0.6, 5), 0x8aaa40, -0.12, 1.2, 0.05, g).rotation.z = 0.5;
  mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.28, 6), PALETTE.corn, 0.05, 0.7, 0.08, g);
  g.userData.kind = 'corn';
  g.userData.hide = true;
  g.userData.solid = false;
  return g;
}

export function makeFenceRun(length) {
  const g = new THREE.Group();
  const posts = Math.max(2, Math.round(length / 2));
  const wood = textured('wood', 1, 2);
  const rail = textured('wood', 1, 6);
  for (let i = 0; i < posts; i += 1) {
    const z = - (i / (posts - 1)) * length;
    mesh(new THREE.BoxGeometry(0.1, 1.05, 0.1), 0x8a5a32, 0, 0.52, z, g, wood);
  }
  mesh(new THREE.BoxGeometry(0.06, 0.08, length), 0xc4925a, 0, 0.78, -length / 2, g, rail);
  mesh(new THREE.BoxGeometry(0.06, 0.08, length), 0xc4925a, 0, 0.38, -length / 2, g, rail);
  return g;
}

export function makeBarn() {
  const g = new THREE.Group();
  const planks = textured('barn', 3, 2);
  mesh(new THREE.BoxGeometry(6.2, 3.4, 4.4), PALETTE.barn, 0, 1.7, 0, g, planks);
  const roofL = mesh(new THREE.BoxGeometry(3.6, 0.18, 4.8), 0x6a2a24, -1.15, 3.7, 0, g);
  roofL.rotation.z = 0.45;
  const roofR = mesh(new THREE.BoxGeometry(3.6, 0.18, 4.8), 0x6a2a24, 1.15, 3.7, 0, g);
  roofR.rotation.z = -0.45;
  mesh(new THREE.BoxGeometry(1.4, 2.1, 0.12), 0xf2efe6, 0, 1.05, 2.22, g);
  mesh(new THREE.BoxGeometry(0.08, 2.1, 0.14), 0x4a3024, 0, 1.05, 2.26, g);
  mesh(new THREE.BoxGeometry(0.7, 0.7, 0.1), 0xf4e2a8, -1.6, 2.1, 2.22, g);
  mesh(new THREE.BoxGeometry(0.7, 0.7, 0.1), 0xf4e2a8, 1.6, 2.1, 2.22, g);
  mesh(new THREE.BoxGeometry(0.9, 0.7, 0.1), 0xf2efe6, 0, 2.7, 2.16, g);
  g.userData.kind = 'barn';
  return g;
}

export function makeCoop() {
  const g = new THREE.Group();
  const wood = textured('wood', 2, 1, 0xf0d8a8);
  mesh(new THREE.BoxGeometry(1.8, 1.3, 1.5), 0xe8d2a4, 0, 0.65, 0, g, wood);
  const roof = mesh(new THREE.BoxGeometry(2.1, 0.12, 1.7), PALETTE.barn, 0, 1.4, 0, g, textured('barn', 2, 1));
  roof.rotation.z = 0.05;
  mesh(new THREE.BoxGeometry(0.4, 0.55, 0.08), 0x6a3a28, 0, 0.35, 0.76, g);
  mesh(new THREE.BoxGeometry(0.16, 0.7, 0.16), 0x8a5a32, 0.7, 1.5, 0, g, textured('wood', 1, 2));
  g.userData.kind = 'coop';
  return g;
}

export function makeMud() {
  const g = new THREE.Group();
  const puddle = mesh(
    new THREE.CircleGeometry(0.85, 14),
    0x4a3824,
    0, 0.04, 0, g,
    textured('dirt', 1, 1, 0x4a3424),
  );
  puddle.rotation.x = -Math.PI / 2;
  g.userData.kind = 'mud';
  g.userData.slow = true;
  g.userData.h = 0.2;
  return g;
}

export function makeKernel() {
  const g = new THREE.Group();
  const k = mesh(new THREE.SphereGeometry(0.12, 6, 5), PALETTE.corn, 0, 0.45, 0, g);
  k.scale.set(1, 1.3, 0.8);
  g.userData.kind = 'kernel';
  g.userData.pickup = true;
  return g;
}
