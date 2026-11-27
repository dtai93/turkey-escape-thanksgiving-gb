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
  const enamel = 0x9c2f2a;
  const cream = 0xf4e6cf;
  const iron = 0x241c18;
  const brass = 0xd4b15a;
  for (const [x, z] of [[-0.68, -0.42], [0.68, -0.42], [-0.68, 0.42], [0.68, 0.42]]) {
    mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 6), iron, x, 0.08, z, g);
  }
  mesh(new THREE.BoxGeometry(1.72, 1.16, 1.12), enamel, 0, 0.78, 0, g);
  mesh(new THREE.BoxGeometry(1.8, 0.07, 1.2), cream, 0, 1.36, 0, g);
  mesh(new THREE.BoxGeometry(1.8, 0.07, 1.2), iron, 0, 0.24, 0, g);
  mesh(new THREE.BoxGeometry(1.6, 0.08, 1.02), 0x1a1a1a, 0, 1.44, 0, g);
  const grateGeo = new THREE.TorusGeometry(0.15, 0.018, 6, 12);
  for (const [x, z] of [[-0.4, -0.2], [0.4, -0.2], [-0.4, 0.2], [0.4, 0.2]]) {
    const ring = mesh(grateGeo, 0x3c3c3c, x, 1.5, z, g);
    ring.rotation.x = Math.PI / 2;
  }
  const pot = mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.2, 8), 0xd8d4ce, 0.4, 1.64, -0.18, g);
  pot.scale.set(1, 1, 1);
  mesh(new THREE.TorusGeometry(0.1, 0.016, 5, 8), brass, 0.4, 1.72, -0.02, g);
  mesh(new THREE.BoxGeometry(1.7, 0.5, 0.08), cream, 0, 1.74, -0.5, g);
  for (let i = 0; i < 4; i += 1) {
    mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 8), brass, -0.54 + i * 0.36, 1.72, -0.44, g);
  }
  mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.34, 6), iron, -0.62, 1.96, -0.28, g);
  mesh(new THREE.BoxGeometry(1.18, 0.84, 0.62), 0x140e0c, 0, 0.78, 0.1, g);
  mesh(new THREE.BoxGeometry(1.02, 0.025, 0.5), 0x8d949c, 0, 0.58, 0.16, g);
  mesh(new THREE.BoxGeometry(1.02, 0.025, 0.48), 0x8d949c, 0, 0.96, 0.14, g);
  const roast = mesh(new THREE.SphereGeometry(0.24, 8, 6), 0x8a3d18, 0, 0.74, 0.2, g);
  roast.scale.set(1.4, 0.65, 1);
  const glowMat = new THREE.MeshLambertMaterial({ color: 0x4a1c0c, emissive: new THREE.Color(0xff7a20), emissiveIntensity: 0.35 });
  const glow = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.7, 0.04), glowMat);
  glow.position.set(0, 0.78, 0.44);
  g.add(glow);
  const door = new THREE.Group();
  door.position.set(0, 0.36, 0.58);
  g.add(door);
  const doorMesh = mesh(new THREE.BoxGeometry(1.32, 0.92, 0.07), cream, 0, 0.46, 0, door);
  mesh(new THREE.BoxGeometry(1.08, 0.7, 0.03), iron, 0, 0.5, 0.04, door);
  const glassMat = new THREE.MeshLambertMaterial({
    color: 0x2a140c,
    emissive: new THREE.Color(0xff7a20),
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.78,
  });
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.52, 0.02), glassMat);
  glass.position.set(0, 0.54, 0.06);
  door.add(glass);
  mesh(new THREE.BoxGeometry(0.7, 0.055, 0.055), brass, 0, 0.14, 0.07, door);
  const flames = new THREE.Group();
  flames.position.set(0, 0.72, 0.78);
  g.add(flames);
  const flameMat = new THREE.MeshLambertMaterial({ color: 0xff5a18, emissive: new THREE.Color(0xff6a20), emissiveIntensity: 1 });
  const flameGeo = new THREE.ConeGeometry(0.11, 0.36, 6);
  const flameList = [];
  for (const [x, y, z] of [[-0.28, 0, 0], [0, 0.06, 0.08], [0.24, -0.02, 0.02], [-0.06, 0.14, 0.1]]) {
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(x, y, z);
    flames.add(flame);
    flameList.push(flame);
  }
  const light = new THREE.PointLight(0xff7a20, 0, 7, 2);
  light.position.set(0, 0.78, 0.9);
  g.add(light);
  g.userData.kind = 'oven';
  g.userData.hazard = true;
  g.userData.laneSpan = 1;
  g.userData.h = 0.9;
  g.userData.tick = (t) => {
    const cycle = (t + (g.userData.phase || 0)) % 3.2;
    const open = cycle > 2.15 && cycle < 3.05;
    const warn = cycle > 1.7 && cycle <= 2.15;
    door.rotation.x = open ? -1.25 : warn ? -0.28 : 0;
    flames.visible = open;
    roast.visible = true;
    glowMat.emissiveIntensity = open ? 1.2 : warn ? 0.7 : 0.18;
    glassMat.emissiveIntensity = open ? 0.95 : warn ? 0.5 : 0.08;
    light.intensity = open ? 5 : warn ? 1.4 : 0.12;
    if (open) {
      flameList.forEach((flame, i) => {
        flame.scale.y = 0.75 + Math.sin(t * 18 + i) * 0.32;
      });
    }
    doorMesh.material.color.setHex(warn ? 0xff8866 : cream);
    g.userData.hot = open;
    g.userData.warn = warn;
  };
  g.scale.setScalar(1.28);
  return g;
}

function carvingBladeGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(1.7, 0.05);
  shape.lineTo(2.15, 0.2);
  shape.lineTo(1.55, 0.46);
  shape.lineTo(0, 0.4);
  shape.lineTo(0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 1,
    curveSegments: 1,
  });
  geo.translate(0, 0, -0.02);
  return geo;
}

const CARVING_BLADE = carvingBladeGeometry();
const STEEL = new THREE.MeshStandardMaterial({ color: 0xf4f7fb, metalness: 0.72, roughness: 0.28 });

export function makeKnife() {
  const g = new THREE.Group();
  const blade = new THREE.Group();
  g.add(blade);
  const steel = new THREE.Mesh(CARVING_BLADE, STEEL);
  steel.position.set(-0.35, 0.58, 0);
  steel.castShadow = true;
  steel.receiveShadow = true;
  blade.add(steel);
  mesh(new THREE.BoxGeometry(1.55, 0.02, 0.012), 0xffffff, 0.45, 0.66, 0.028, blade);
  mesh(new THREE.BoxGeometry(0.12, 0.32, 0.1), 0xc9a15a, -0.4, 0.8, 0, blade);
  mesh(new THREE.BoxGeometry(0.58, 0.16, 0.1), 0x4a2414, -0.78, 0.78, 0, blade);
  for (const x of [-0.62, -0.78, -0.94]) {
    const rivet = mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.12, 6), 0xe6c56a, x, 0.78, 0, blade);
    rivet.rotation.x = Math.PI / 2;
  }
  const warn = mesh(new THREE.BoxGeometry(1.7, 0.03, 0.7), 0xff2a2a, 0.4, 0.03, 0, g);
  warn.material = new THREE.MeshBasicMaterial({ color: 0xff2020, transparent: true, opacity: 0.0 });
  g.userData.kind = 'knife';
  g.userData.hazard = true;
  g.userData.h = 1.05;
  g.userData.tick = (t) => {
    const cycle = (t + (g.userData.phase || 0)) % 2.6;
    const telegraph = cycle > 1.35 && cycle <= 1.9;
    const slam = cycle > 1.9 && cycle < 2.35;
    const pulse = (telegraph || slam) ? 0.55 + Math.sin(t * 30) * 0.2 : 0;
    warn.material.opacity = telegraph ? pulse * 0.9 : slam ? 0.25 : 0;
    blade.position.y = slam ? 0.02 : 1.55;
    blade.rotation.z = slam ? -0.04 : 0.62;
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
  drop(found.knife, 1.25, -1.15);
  if (found.oven) {
    found.oven.scale.setScalar(1.42);
    found.oven.rotation.y = 0.15;
  }
  if (found.knife) {
    found.knife.scale.setScalar(0.92);
    found.knife.rotation.set(0.45, 0.55, 0.72);
    found.knife.position.y = 0.04;
  }
  if (found.oven) found.oven.userData.phase = phaseFor(time, 3.2, 2.55);
  if (found.knife) found.knife.userData.phase = phaseFor(time, 2.6, 2.08);
}
