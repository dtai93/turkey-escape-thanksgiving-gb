// Oven bursts and the carving knife. Each hazard ticks itself from world time.

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

export function makeOven() {
  const g = new THREE.Group();
  mesh(new THREE.BoxGeometry(1.7, 1.5, 1.15), 0xd8d4cc, 0, 0.75, 0, g);
  mesh(new THREE.BoxGeometry(1.5, 0.16, 1.05), 0x2a2a2a, 0, 1.52, 0, g);
  mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.28, 6), 0x222222, -0.4, 1.72, 0, g);
  const door = new THREE.Group();
  door.position.set(0, 0.72, 0.58);
  g.add(door);
  const doorMesh = mesh(new THREE.BoxGeometry(1.2, 0.95, 0.08), 0x2c2c2c, 0, 0, 0, door);
  mesh(new THREE.BoxGeometry(0.7, 0.28, 0.02), 0xffe08a, 0, 0.1, 0.05, door);
  mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.16, 6), 0xc0c0c0, 0.42, -0.2, 0.06, door);
  const fire = mesh(new THREE.ConeGeometry(0.45, 0.7, 7), 0xff6a20, 0, 0.35, 0.7, g);
  fire.material = new THREE.MeshBasicMaterial({ color: 0xff6a20 });
  const glow = mesh(new THREE.SphereGeometry(0.28, 6, 5), 0xffd060, 0, 0.55, 0.85, g);
  glow.material = new THREE.MeshBasicMaterial({ color: 0xffd060 });
  g.userData.kind = 'oven';
  g.userData.hazard = true;
  g.userData.laneSpan = 1;
  g.userData.h = 0.9;
  g.userData.tick = (t) => {
    const cycle = (t + (g.userData.phase || 0)) % 3.2;
    const open = cycle > 2.15 && cycle < 3.05;
    const warn = cycle > 1.7 && cycle <= 2.15;
    door.rotation.x = open ? -1.15 : warn ? -0.25 : 0;
    fire.visible = open;
    glow.visible = open || warn;
    fire.scale.y = open ? 0.7 + Math.sin(t * 18) * 0.25 : 0.2;
    doorMesh.material.color.setHex(warn ? 0xff5530 : 0x2c2c2c);
    g.userData.hot = open;
    g.userData.warn = warn;
  };
  return g;
}

export function makeKnife() {
  const g = new THREE.Group();
  const blade = new THREE.Group();
  g.add(blade);
  const steel = mesh(new THREE.BoxGeometry(0.18, 1.35, 2.3), 0xd8dee8, 0, 0.7, 0, blade);
  steel.material = new THREE.MeshLambertMaterial({ color: 0xe8eef6 });
  mesh(new THREE.BoxGeometry(0.22, 0.16, 0.55), 0x6a3a28, 0, 0.15, -1.15, blade);
  const warn = mesh(new THREE.BoxGeometry(2.1, 0.04, 2.4), 0xff2a2a, 0, 0.05, 0, g);
  warn.material = new THREE.MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0.0 });
  g.userData.kind = 'knife';
  g.userData.hazard = true;
  g.userData.h = 1.2;
  g.userData.tick = (t) => {
    const cycle = (t + (g.userData.phase || 0)) % 2.6;
    const telegraph = cycle > 1.35 && cycle <= 1.9;
    const slam = cycle > 1.9 && cycle < 2.35;
    warn.material.opacity = telegraph ? 0.45 + Math.sin(t * 30) * 0.2 : 0;
    blade.position.y = slam ? 0.05 : 2.4;
    blade.rotation.z = slam ? 0 : 0.15;
    g.userData.hot = slam;
    g.userData.warn = telegraph;
  };
  return g;
}

export function tickHazards(root, time) {
  root.traverse((obj) => {
    if (obj.userData && obj.userData.tick) obj.userData.tick(time);
  });
}
