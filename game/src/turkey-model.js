// Tom Wattles, built from shaded low-poly shapes.
// Poses live on an inner rig so the controller owns the world position.

import * as THREE from 'three';
import { PALETTE } from './config.js';

function lambert(color) {
  return new THREE.MeshLambertMaterial({ color });
}

function featherMaterial(color, offsetFactor) {
  return new THREE.MeshLambertMaterial({
    color,
    polygonOffset: offsetFactor !== 0,
    polygonOffsetFactor: offsetFactor,
    polygonOffsetUnits: offsetFactor,
  });
}

function featherShape(halfW, height) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(halfW * 0.4, height * 0.04, halfW * 1.05, height * 0.22, halfW * 0.92, height * 0.58);
  s.bezierCurveTo(halfW * 0.78, height * 0.9, halfW * 0.3, height * 1.02, 0, height);
  s.bezierCurveTo(-halfW * 0.3, height * 1.02, -halfW * 0.78, height * 0.9, -halfW * 0.92, height * 0.58);
  s.bezierCurveTo(-halfW * 1.05, height * 0.22, -halfW * 0.4, height * 0.04, 0, 0);
  return s;
}

function featherGeo(halfW, height) {
  const geo = new THREE.ExtrudeGeometry(featherShape(halfW, height), {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.007,
    bevelSegments: 1,
    curveSegments: 5,
  });
  geo.translate(0, 0, -0.0075);
  return geo;
}

const TAIL_BASE_GEO = featherGeo(0.34, 1.08);
const TAIL_MID_GEO = featherGeo(0.3, 0.7);
const TAIL_TIP_GEO = featherGeo(0.26, 0.46);
const TAIL_BASE_MAT = featherMaterial(0x6a3018, 1);
const TAIL_MID_MAT = featherMaterial(0xc4622a, -1);
const TAIL_TIP_MAT = featherMaterial(0xfff3d4, -3);

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

  const body = add(rig, new THREE.SphereGeometry(0.58, 14, 10), PALETTE.turkey, 0, 0.78, 0.05);
  body.scale.set(1.2, 0.95, 1.02);
  const breast = add(rig, new THREE.SphereGeometry(0.42, 12, 8), PALETTE.turkeyLight, 0, 0.72, 0.38);
  breast.scale.set(0.95, 0.8, 0.7);

  const tail = new THREE.Group();
  tail.position.set(0, 0.92, -0.78);
  tail.scale.set(1.15, 1.2, 1);
  rig.add(tail);
  for (let i = 0; i < 11; i += 1) {
    const feather = new THREE.Group();
    const fromCenter = i - 5;
    const edge = Math.abs(fromCenter) / 5;
    feather.rotation.z = fromCenter * 0.168;
    feather.rotation.x = fromCenter * 0.008;
    feather.rotation.y = (i % 2 === 0 ? 0.02 : -0.02);
    // Chase cam sees tail-local -Z. Centre feather sits closest; edges step back.
    feather.position.z = -0.07 + edge * 0.24;
    feather.scale.set(1 - edge * 0.04, 1 - edge * 0.1, 1);
    const base = new THREE.Mesh(TAIL_BASE_GEO, TAIL_BASE_MAT);
    base.castShadow = true;
    base.receiveShadow = true;
    feather.add(base);
    const mid = new THREE.Mesh(TAIL_MID_GEO, TAIL_MID_MAT);
    mid.position.set(0, 0.5, -0.032);
    mid.castShadow = true;
    feather.add(mid);
    const tip = new THREE.Mesh(TAIL_TIP_GEO, TAIL_TIP_MAT);
    tip.position.set(0, 0.98, -0.062);
    tip.castShadow = true;
    feather.add(tip);
    tail.add(feather);
  }

  function wing(side) {
    const w = new THREE.Group();
    w.position.set(0.72 * side, 0.9, 0.02);
    const upper = add(w, new THREE.SphereGeometry(0.28, 8, 6), PALETTE.turkey, 0.16 * side, 0, 0);
    upper.scale.set(1.9, 0.5, 1.05);
    add(w, new THREE.BoxGeometry(0.62, 0.08, 0.22), PALETTE.cream, 0.52 * side, -0.02, 0.02);
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
    tail.rotation.x = -0.28 + Math.sin(phase * 0.5) * 0.04;
    tail.rotation.y = Math.sin(phase * 0.5) * 0.06;
    wingL.rotation.set(0.15, 0.2, 0.7);
    wingR.rotation.set(0.15, -0.2, -0.7);
    neck.rotation.x = -0.15;
    snood.position.y = 0.02 + Math.sin(phase * 2) * 0.015;

    if (pose === 'jump') {
      wingL.rotation.set(0.1, 0.1, 1.15);
      wingR.rotation.set(0.1, -0.1, -1.15);
      legL.hip.rotation.x = -0.35;
      legR.hip.rotation.x = 0.55;
      tail.rotation.x = -0.08;
      neck.rotation.x = -0.7;
      rig.position.y = 0.08;
    } else if (pose === 'slide') {
      rig.rotation.x = 0.72;
      rig.position.y = -0.22;
      wingL.rotation.z = 0.2;
      wingR.rotation.z = -0.2;
      legL.hip.rotation.x = 0.9;
      legR.hip.rotation.x = 0.9;
      tail.rotation.x = -0.05;
      neck.rotation.x = 0.35;
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
      neck.rotation.x = -0.05 + Math.sin(phase) * 0.08;
      tail.rotation.x = -0.12;
      wingL.rotation.z = 0.45;
      wingR.rotation.z = -0.45;
    }
    shadow.position.y = 0.03 - air;
    shadow.scale.setScalar(air > 0.4 ? 0.75 : 1);
  }

  group.scale.setScalar(1.16);
  group.userData.update = update;
  group.userData.setHat = setHat;
  return group;
}
