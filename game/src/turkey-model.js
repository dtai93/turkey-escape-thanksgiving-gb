// Tom Wattles, built from shaded low-poly shapes.
// Poses live on an inner rig so the controller owns the world position.

import * as THREE from 'three';
import { PALETTE } from './config.js';

function lambert(color) {
  return new THREE.MeshLambertMaterial({ color });
}

function add(parent, geo, color, x, y, z) {
  const mesh = new THREE.Mesh(geo, lambert(color));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createTurkey() {
  const group = new THREE.Group();
  group.name = 'tom-wattles';
  const rig = new THREE.Group();
  group.add(rig);

  const body = add(rig, new THREE.SphereGeometry(0.62, 14, 10), PALETTE.turkey, 0, 0.78, 0);
  body.scale.set(1.15, 0.92, 1.35);
  const breast = add(rig, new THREE.SphereGeometry(0.42, 12, 8), PALETTE.turkeyLight, 0, 0.72, 0.38);
  breast.scale.set(0.95, 0.8, 0.7);

  const tail = new THREE.Group();
  tail.position.set(0, 0.95, -0.45);
  rig.add(tail);
  const featherGeo = new THREE.BoxGeometry(0.22, 0.95, 0.06);
  const tipGeo = new THREE.BoxGeometry(0.2, 0.34, 0.06);
  const bands = [PALETTE.turkey, 0x9a3e22, 0xb85a30, PALETTE.turkeyLight, 0x8a3818];
  for (let i = 0; i < 9; i += 1) {
    const feather = new THREE.Group();
    const angle = (i - 4) * 0.2;
    feather.rotation.z = angle;
    add(feather, featherGeo, bands[i % bands.length], 0, 0.36, 0);
    add(feather, tipGeo, PALETTE.cream, 0, 0.78, 0.01);
    tail.add(feather);
  }

  function wing(side) {
    const w = new THREE.Group();
    w.position.set(0.52 * side, 0.86, 0.05);
    const upper = add(w, new THREE.SphereGeometry(0.28, 8, 6), PALETTE.turkey, 0.1 * side, 0, 0);
    upper.scale.set(1.35, 0.42, 0.85);
    add(w, new THREE.BoxGeometry(0.4, 0.07, 0.2), PALETTE.cream, 0.36 * side, -0.04, 0.02);
    rig.add(w);
    return w;
  }
  const wingL = wing(-1);
  const wingR = wing(1);

  const neck = new THREE.Group();
  neck.position.set(0, 1.15, 0.48);
  rig.add(neck);
  add(neck, new THREE.CylinderGeometry(0.1, 0.14, 0.36, 8), PALETTE.head, 0, 0.12, 0.04);

  const head = new THREE.Group();
  head.position.set(0, 0.36, 0.06);
  neck.add(head);
  add(head, new THREE.SphereGeometry(0.2, 10, 8), PALETTE.head, 0, 0.04, 0.02);
  const beak = add(head, new THREE.ConeGeometry(0.07, 0.22, 6), PALETTE.beak, 0, -0.02, 0.2);
  beak.rotation.x = Math.PI / 2;
  const snood = add(head, new THREE.SphereGeometry(0.055, 6, 5), PALETTE.wattle, 0, 0.02, 0.12);
  snood.scale.set(0.7, 1.7, 0.7);
  add(head, new THREE.SphereGeometry(0.07, 6, 5), PALETTE.wattle, 0, -0.12, 0.08);
  const eyeL = add(head, new THREE.SphereGeometry(0.045, 6, 5), 0xf6f6f6, -0.08, 0.06, 0.14);
  const eyeR = add(head, new THREE.SphereGeometry(0.045, 6, 5), 0xf6f6f6, 0.08, 0.06, 0.14);
  add(eyeL, new THREE.SphereGeometry(0.022, 5, 4), 0x1a120c, 0, 0, 0.03);
  add(eyeR, new THREE.SphereGeometry(0.022, 5, 4), 0x1a120c, 0, 0, 0.03);

  function leg(side) {
    const hip = new THREE.Group();
    hip.position.set(0.18 * side, 0.42, 0.05);
    rig.add(hip);
    add(hip, new THREE.CylinderGeometry(0.055, 0.045, 0.28, 6), PALETTE.legs, 0, -0.12, 0);
    const shin = new THREE.Group();
    shin.position.set(0, -0.26, 0);
    hip.add(shin);
    add(shin, new THREE.CylinderGeometry(0.042, 0.036, 0.26, 6), PALETTE.legs, 0, -0.12, 0);
    add(shin, new THREE.BoxGeometry(0.16, 0.035, 0.28), PALETTE.legs, 0, -0.26, 0.06);
    return { hip, shin };
  }
  const legL = leg(-1);
  const legR = leg(1);

  const hatAnchor = new THREE.Group();
  hatAnchor.position.set(0, 0.2, 0);
  head.add(hatAnchor);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.72, 14),
    new THREE.MeshBasicMaterial({ color: 0x2a180c, transparent: true, opacity: 0.32 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.025;
  group.add(shadow);

  function setHat(name) {
    while (hatAnchor.children.length) hatAnchor.remove(hatAnchor.children[0]);
    if (name === 'straw') {
      add(hatAnchor, new THREE.CylinderGeometry(0.12, 0.14, 0.1, 8), PALETTE.hat, 0, 0.08, 0);
      add(hatAnchor, new THREE.CylinderGeometry(0.28, 0.28, 0.03, 10), PALETTE.hat, 0, 0.02, 0);
    } else if (name === 'pilot') {
      add(hatAnchor, new THREE.BoxGeometry(0.28, 0.1, 0.22), 0x5a3318, 0, 0.08, 0);
      add(hatAnchor, new THREE.BoxGeometry(0.16, 0.06, 0.18), 0xc9a05a, 0, 0.12, 0.12);
    } else if (name === 'cranberry') {
      add(hatAnchor, new THREE.SphereGeometry(0.11, 8, 6), 0x8e1c34, 0, 0.1, 0);
      add(hatAnchor, new THREE.SphereGeometry(0.045, 6, 5), 0xf2e2c4, 0, 0.18, 0.04);
    }
  }

  function update(phase, pose, hop) {
    const air = hop || 0;
    const running = pose === 'run' || pose === 'panic';
    const swing = running ? Math.sin(phase) : pose === 'idle' ? Math.sin(phase) * 0.25 : 0;
    const lift = running ? Math.abs(Math.sin(phase)) : 0;
    legL.hip.rotation.x = swing * 0.95;
    legR.hip.rotation.x = -swing * 0.95;
    legL.shin.rotation.x = Math.max(0, -swing) * 0.85;
    legR.shin.rotation.x = Math.max(0, swing) * 0.85;
    rig.position.y = running ? lift * 0.05 : 0;
    rig.rotation.set(0, Math.PI, 0);
    rig.scale.set(1, 1, 1);
    tail.rotation.x = -0.85 + Math.sin(phase * 0.5) * 0.05;
    tail.rotation.y = Math.sin(phase * 0.5) * 0.08;
    wingL.rotation.set(0, 0, 0.35);
    wingR.rotation.set(0, 0, -0.35);
    neck.rotation.x = 0.12;
    snood.position.y = 0.02 + Math.sin(phase * 2) * 0.015;

    if (pose === 'jump') {
      wingL.rotation.set(-0.9, 0.4, 1.45);
      wingR.rotation.set(-0.9, -0.4, -1.45);
      legL.hip.rotation.x = -1.25;
      legR.hip.rotation.x = -1.05;
      tail.rotation.x = -1.15;
      neck.rotation.x = -0.25;
      rig.position.y = 0.05;
    } else if (pose === 'slide') {
      rig.rotation.x = 1.15;
      rig.position.y = -0.35;
      wingL.rotation.z = 0.15;
      wingR.rotation.z = -0.15;
      legL.hip.rotation.x = 1.05;
      legR.hip.rotation.x = 1.05;
      tail.rotation.x = 0.35;
      neck.rotation.x = 0.55;
    } else if (pose === 'hide') {
      rig.scale.set(1.02, 0.58, 1.08);
      rig.position.y = -0.22;
      neck.rotation.x = 0.75;
      tail.rotation.x = 0.45;
      wingL.rotation.z = 0.08;
      wingR.rotation.z = -0.08;
    } else if (pose === 'panic') {
      const flap = Math.sin(phase * 3);
      wingL.rotation.z = 0.9 + flap * 0.45;
      wingR.rotation.z = -0.9 - flap * 0.45;
      tail.rotation.y = Math.sin(phase * 4) * 0.28;
    } else if (pose === 'idle') {
      neck.rotation.x = 0.22 + Math.sin(phase) * 0.08;
      tail.rotation.x = -0.22;
    }
    shadow.position.y = 0.03 - air;
    shadow.scale.setScalar(air > 0.4 ? 0.75 : 1);
  }

  group.userData.update = update;
  group.userData.setHat = setHat;
  return group;
}
