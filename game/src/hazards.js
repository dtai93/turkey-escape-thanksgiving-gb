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
  const fire = mesh(new THREE.ConeGeometry(0.62, 1.05, 7), 0xff6a20, 0, 0.55, 0.95, g);
  fire.material = new THREE.MeshBasicMaterial({ color: 0xff6a20 });
  const glow = mesh(new THREE.SphereGeometry(0.4, 6, 5), 0xffd060, 0, 0.7, 1.05, g);
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
  g.scale.setScalar(1.28);
  return g;
}

export function makeKnife() {
  const g = new THREE.Group();
  const blade = new THREE.Group();
  g.add(blade);
  const steel = mesh(new THREE.BoxGeometry(2.55, 0.58, 0.08), 0xf4f7fb, 0.35, 0.95, 0, blade);
  steel.material = new THREE.MeshBasicMaterial({ color: 0xf7fbff });
  mesh(new THREE.BoxGeometry(2.3, 0.08, 0.1), 0xb7c0cc, 0.25, 1.22, 0, blade);
  const tip = mesh(new THREE.ConeGeometry(0.3, 0.72, 4), 0xf7fbff, 1.85, 0.95, 0, blade);
  tip.rotation.z = -Math.PI / 2;
  tip.material = new THREE.MeshBasicMaterial({ color: 0xf7fbff });
  const handle = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.72, 6), 0x6a3a28, -1.2, 0.95, 0, blade);
  handle.rotation.z = Math.PI / 2;
  mesh(new THREE.BoxGeometry(0.08, 0.28, 0.16), 0xe0b060, -0.82, 0.95, 0, blade);
  const warn = mesh(new THREE.BoxGeometry(3.1, 0.05, 2.4), 0xff2a2a, 0, 0.07, 0, g);
  warn.material = new THREE.MeshBasicMaterial({ color: 0xff2020, transparent: true, opacity: 0.0 });
  const flash = mesh(new THREE.BoxGeometry(2.5, 0.1, 0.12), 0xff3a2a, 0.3, 1.28, 0.08, blade);
  flash.material = new THREE.MeshBasicMaterial({ color: 0xff3030, transparent: true, opacity: 0.0, depthWrite: false });
  g.userData.kind = 'knife';
  g.userData.hazard = true;
  g.userData.h = 1.15;
  g.userData.tick = (t) => {
    const cycle = (t + (g.userData.phase || 0)) % 2.6;
    const telegraph = cycle > 1.35 && cycle <= 1.9;
    const slam = cycle > 1.9 && cycle < 2.35;
    const hot = telegraph || slam;
    const pulse = hot ? 0.62 + Math.sin(t * 30) * 0.22 : 0;
    warn.material.opacity = pulse * 0.85;
    flash.material.opacity = slam ? 0.95 : pulse * 0.2;
    blade.position.y = slam ? 0.05 : 2.15;
    blade.rotation.z = slam ? -0.18 : 0.55;
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

function phaseFor(time, cycle, target) {
  return (target - (time % cycle) + cycle) % cycle;
}

export function primeShotHazards(root, time, bird) {
  const found = { oven: null, knife: null, ovenD: 1e9, knifeD: 1e9 };
  const wp = new THREE.Vector3();
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    const kind = obj.userData && obj.userData.kind;
    if (kind !== 'oven' && kind !== 'knife') return;
    obj.getWorldPosition(wp);
    const ahead = bird.z - wp.z;
    if (ahead < -2 || ahead > 18) return;
    if (kind === 'oven' && ahead < found.ovenD) {
      found.oven = obj;
      found.ovenD = ahead;
    }
    if (kind === 'knife' && ahead < found.knifeD) {
      found.knife = obj;
      found.knifeD = ahead;
    }
  });
  const parentOf = (obj) => obj.parent;
  const drop = (obj, x, ahead) => {
    if (!obj || !obj.parent) return;
    const local = parentOf(obj).worldToLocal(new THREE.Vector3(x, 0, bird.z - ahead));
    obj.position.set(local.x, 0, local.z);
  };
  if (!found.oven || !found.knife) {
    root.traverse((obj) => {
      const kind = obj.userData && obj.userData.kind;
      if (!found.oven && kind === 'oven') found.oven = obj;
      if (!found.knife && kind === 'knife') found.knife = obj;
    });
  }
  drop(found.oven, -2.35, 2.4);
  drop(found.knife, 0.05, -1.15);
  if (found.oven) {
    found.oven.scale.setScalar(1.65);
    found.oven.rotation.y = 0.6;
  }
  if (found.knife) {
    found.knife.scale.setScalar(1.35);
    found.knife.rotation.y = 0.15;
    found.knife.position.y = -0.55;
  }
  if (found.oven) found.oven.userData.phase = phaseFor(time, 3.2, 2.55);
  if (found.knife) found.knife.userData.phase = phaseFor(time, 2.6, 2.12);
}
