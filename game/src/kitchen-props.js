// Kitchen dressing: counters, cabinets, pie tins, a roasting pan, a gravy boat.

import * as THREE from 'three';

function mat(color) {
  return new THREE.MeshLambertMaterial({ color });
}

function mesh(geo, color, x, y, z, parent) {
  const m = new THREE.Mesh(geo, mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

export function makeCounter(length) {
  const g = new THREE.Group();
  mesh(new THREE.BoxGeometry(1.3, 0.9, length), 0xf4efe4, 0, 0.45, -length / 2, g);
  mesh(new THREE.BoxGeometry(1.35, 0.08, length), 0xd8d0c4, 0, 0.92, -length / 2, g);
  for (let z = 0.4; z < length; z += 0.9) {
    mesh(new THREE.BoxGeometry(1.05, 0.55, 0.7), 0x8e2c32, 0, 0.4, -z, g);
  }
  g.userData.kind = 'counter';
  return g;
}

export function makeCabinet() {
  const g = new THREE.Group();
  mesh(new THREE.BoxGeometry(1.2, 1.5, 0.7), 0xf7f1e6, 0, 1.7, 0, g);
  mesh(new THREE.BoxGeometry(0.5, 1.2, 0.06), 0xe8dcc8, -0.28, 1.65, 0.34, g);
  mesh(new THREE.BoxGeometry(0.5, 1.2, 0.06), 0xe8dcc8, 0.28, 1.65, 0.34, g);
  mesh(new THREE.SphereGeometry(0.04, 6, 5), 0xc4a060, -0.08, 1.65, 0.38, g);
  mesh(new THREE.SphereGeometry(0.04, 6, 5), 0xc4a060, 0.08, 1.65, 0.38, g);
  g.userData.kind = 'cabinet';
  g.userData.hide = true;
  return g;
}

export function makePieTins() {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i += 1) {
    const tin = mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.08, 10), 0xd0d4dc, 0, 0.2 + i * 0.1, 0, g);
    tin.material = new THREE.MeshLambertMaterial({ color: 0xd8dce4 });
  }
  g.userData.kind = 'pies';
  g.userData.solid = true;
  g.userData.jumpOver = true;
  g.userData.h = 0.6;
  return g;
}

export function makeRoastingPan() {
  const g = new THREE.Group();
  mesh(new THREE.BoxGeometry(1.3, 0.16, 0.8), 0xc8ccd4, 0, 0.12, 0, g);
  mesh(new THREE.SphereGeometry(0.28, 8, 6), 0x8a3a22, 0, 0.28, 0, g).scale.set(1.4, 0.6, 0.9);
  g.userData.kind = 'pan';
  g.userData.solid = true;
  g.userData.jumpOver = true;
  g.userData.h = 0.45;
  return g;
}

export function makeGravyBoat() {
  const g = new THREE.Group();
  mesh(new THREE.SphereGeometry(0.22, 8, 6), 0xf4f0e8, 0, 0.22, 0, g).scale.set(1.3, 0.7, 0.8);
  mesh(new THREE.BoxGeometry(0.16, 0.06, 0.2), 0xf4f0e8, 0.28, 0.28, 0, g);
  const slick = mesh(new THREE.CircleGeometry(0.9, 12), 0xc4a060, 0, 0.03, 0.2, g);
  slick.rotation.x = -Math.PI / 2;
  slick.material = new THREE.MeshLambertMaterial({ color: 0xd4a24a, transparent: true, opacity: 0.85 });
  g.userData.kind = 'gravy';
  g.userData.slow = true;
  g.userData.h = 0.2;
  return g;
}

export function makeRollingPin() {
  const g = new THREE.Group();
  const pin = mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.1, 8), 0xe8d2a8, 0, 0.16, 0, g);
  pin.rotation.z = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 6), 0xc49a58, 0.6, 0.16, 0, g).rotation.z = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 6), 0xc49a58, -0.6, 0.16, 0, g).rotation.z = Math.PI / 2;
  g.userData.kind = 'pin';
  g.userData.solid = true;
  g.userData.jumpOver = true;
  g.userData.h = 0.35;
  return g;
}

export function kitchenFloor() {
  const g = new THREE.Group();
  const size = 1.15;
  for (let x = -2; x <= 2; x += 1) {
    for (let z = 0; z < 16; z += 1) {
      const dark = (x + z) % 2 === 0;
      const tile = mesh(
        new THREE.BoxGeometry(size, 0.04, size),
        dark ? 0xf4efe6 : 0xc45a3a,
        x * size,
        0.02,
        -z * size - size / 2,
        g,
      );
      tile.receiveShadow = true;
    }
  }
  return g;
}
