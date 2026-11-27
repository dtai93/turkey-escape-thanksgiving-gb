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
  mesh(new THREE.BoxGeometry(1.7, 1.5, 1.15), 0x3a342f, 0, 0.75, 0, g);
  mesh(new THREE.BoxGeometry(1.55, 0.1, 1.08), 0xe7d7c0, 0, 1.28, 0, g);
  mesh(new THREE.BoxGeometry(1.5, 0.16, 1.05), 0x1c1c1c, 0, 1.52, 0, g);
  mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.42, 6), 0x222222, -0.45, 1.82, -0.15, g);
  mesh(new THREE.BoxGeometry(1.15, 0.9, 0.08), 0x1a1a1a, 0, 0.72, 0.5, g);
  const door = new THREE.Group();
  door.position.set(0, 0.28, 0.58);
  g.add(door);
  const doorMesh = mesh(new THREE.BoxGeometry(1.22, 0.98, 0.08), 0x3a3a3a, 0, 0.46, 0, door);
  mesh(new THREE.BoxGeometry(0.72, 0.22, 0.02), 0xffe08a, 0, 0.7, 0.05, door);
  mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 6), 0xc0c0c0, 0.42, 0.22, 0.07, door);
  const roast = mesh(new THREE.SphereGeometry(0.28, 8, 6), 0x8a3d18, 0, 0.55, 0.72, g);
  roast.scale.set(1.3, 0.75, 1);
  const fire = mesh(new THREE.ConeGeometry(0.55, 0.9, 7), 0xff6a20, 0.15, 0.7, 0.95, g);
  fire.material = new THREE.MeshBasicMaterial({ color: 0xff6a20 });
  const glow = mesh(new THREE.SphereGeometry(0.46, 6, 5), 0xffd060, 0, 0.72, 1.05, g);
  glow.material = new THREE.MeshBasicMaterial({ color: 0xffd060 });
  g.userData.kind = 'oven';
  g.userData.hazard = true;
  g.userData.laneSpan = 1;
  g.userData.h = 0.9;
  g.userData.tick = (t) => {
    const cycle = (t + (g.userData.phase || 0)) % 3.2;
    const open = cycle > 2.15 && cycle < 3.05;
    const warn = cycle > 1.7 && cycle <= 2.15;
    door.rotation.x = open ? -1.25 : warn ? -0.28 : 0;
    fire.visible = open;
    glow.visible = open || warn;
    roast.visible = open || warn;
    fire.scale.y = open ? 0.75 + Math.sin(t * 18) * 0.22 : 0.2;
    doorMesh.material.color.setHex(warn ? 0xff5530 : 0x3a3a3a);
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
  const steel = mesh(new THREE.BoxGeometry(2.05, 0.42, 0.08), 0xf4f7fb, 0.42, 0.95, 0, blade);
  steel.material = new THREE.MeshBasicMaterial({ color: 0xf4f7fb });
  mesh(new THREE.BoxGeometry(1.9, 0.06, 0.09), 0x8b949e, 0.36, 1.12, 0, blade);
  const edge = mesh(new THREE.BoxGeometry(1.95, 0.045, 0.09), 0xff241c, 0.4, 0.78, 0.02, blade);
  edge.material = new THREE.MeshBasicMaterial({ color: 0xff241c });
  const tip = mesh(new THREE.ConeGeometry(0.28, 0.78, 4), 0xf7fbff, 1.78, 0.95, 0, blade);
  tip.rotation.z = -Math.PI / 2;
  tip.scale.set(1, 1, 0.42);
  tip.material = new THREE.MeshBasicMaterial({ color: 0xf7fbff });
  const handle = mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.72, 6), 0x6a341c, -0.86, 0.95, 0, blade);
  handle.rotation.z = Math.PI / 2;
  mesh(new THREE.BoxGeometry(0.1, 0.18, 0.22), 0xe8c56a, -0.48, 0.95, 0, blade);
  mesh(new THREE.SphereGeometry(0.045, 6, 5), 0xf2d48a, -1.02, 1.02, 0.07, blade);
  mesh(new THREE.SphereGeometry(0.045, 6, 5), 0xf2d48a, -0.72, 1.02, 0.07, blade);
  const warn = mesh(new THREE.BoxGeometry(2.5, 0.045, 1.35), 0xff2a2a, 0.25, 0.05, 0, g);
  warn.material = new THREE.MeshBasicMaterial({ color: 0xff2020, transparent: true, opacity: 0.0 });
  g.userData.kind = 'knife';
  g.userData.hazard = true;
  g.userData.h = 1.05;
  g.userData.tick = (t) => {
    const cycle = (t + (g.userData.phase || 0)) % 2.6;
    const telegraph = cycle > 1.35 && cycle <= 1.9;
    const slam = cycle > 1.9 && cycle < 2.35;
    const hot = telegraph || slam;
    const pulse = hot ? 0.55 + Math.sin(t * 30) * 0.2 : 0;
    warn.material.opacity = pulse * 0.9;
    blade.position.y = slam ? 0.02 : 1.55;
    blade.rotation.z = slam ? -0.04 : 0.62;
    edge.material.color.setHex(slam ? 0xff180e : 0xff5544);
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
    if (ahead < -2 || ahead > 22) return;
    if (kind === 'oven' && ahead < found.ovenD) {
      found.oven = obj;
      found.ovenD = ahead;
    }
    if (kind === 'knife' && ahead < found.knifeD) {
      found.knife = obj;
      found.knifeD = ahead;
    }
  });
  const drop = (obj, x, ahead) => {
    if (!obj || !obj.parent) return;
    const local = obj.parent.worldToLocal(new THREE.Vector3(x, 0, bird.z - ahead));
    obj.position.set(local.x, 0, local.z);
  };
  if (!found.oven || !found.knife) {
    root.traverse((obj) => {
      const kind = obj.userData && obj.userData.kind;
      if (!found.oven && kind === 'oven') found.oven = obj;
      if (!found.knife && kind === 'knife') found.knife = obj;
    });
  }
  drop(found.oven, -2.35, 2.15);
  drop(found.knife, 0.28, -1.15);
  if (found.oven) {
    found.oven.scale.setScalar(1.45);
    found.oven.rotation.y = 0.55;
  }
  if (found.knife) {
    found.knife.scale.setScalar(1.2);
    found.knife.rotation.set(0.12, 0.62, -0.18);
    found.knife.position.y = -0.22;
  }
  if (found.oven) found.oven.userData.phase = phaseFor(time, 3.2, 2.55);
  if (found.knife) found.knife.userData.phase = phaseFor(time, 2.6, 2.12);
}
