// Farmer Hank: straw hat, plaid shirt, denim overalls, boots, net and lantern.

import * as THREE from 'three';
import { PALETTE } from './config.js';

function mat(color) {
  return new THREE.MeshLambertMaterial({ color });
}

function add(parent, geo, color, x, y, z) {
  const mesh = new THREE.Mesh(geo, mat(color));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createFarmer() {
  const group = new THREE.Group();
  group.name = 'farmer-hank';
  const rig = new THREE.Group();
  group.add(rig);

  function leg(side) {
    const hip = new THREE.Group();
    hip.position.set(0.18 * side, 0.95, 0);
    rig.add(hip);
    add(hip, new THREE.BoxGeometry(0.2, 0.48, 0.2), PALETTE.denim, 0, -0.22, 0);
    const shin = new THREE.Group();
    shin.position.set(0, -0.46, 0);
    hip.add(shin);
    add(shin, new THREE.BoxGeometry(0.18, 0.42, 0.18), PALETTE.denim, 0, -0.18, 0);
    add(shin, new THREE.BoxGeometry(0.22, 0.12, 0.36), PALETTE.boot, 0, -0.4, 0.06);
    return { hip, shin };
  }
  const legL = leg(-1);
  const legR = leg(1);

  add(rig, new THREE.BoxGeometry(0.72, 0.7, 0.4), PALETTE.denim, 0, 1.28, 0);
  add(rig, new THREE.BoxGeometry(0.16, 0.55, 0.08), PALETTE.denim, -0.16, 1.2, 0.18);
  add(rig, new THREE.BoxGeometry(0.16, 0.55, 0.08), PALETTE.denim, 0.16, 1.2, 0.18);
  const shirt = add(rig, new THREE.BoxGeometry(0.78, 0.48, 0.42), PALETTE.shirt, 0, 1.62, 0);
  add(shirt, new THREE.BoxGeometry(0.8, 0.06, 0.44), 0xf2efe4, 0, 0.08, 0);
  add(shirt, new THREE.BoxGeometry(0.8, 0.06, 0.44), 0x1e3a28, 0, -0.08, 0);

  function arm(side) {
    const shoulder = new THREE.Group();
    shoulder.position.set(0.46 * side, 1.72, 0);
    rig.add(shoulder);
    add(shoulder, new THREE.BoxGeometry(0.16, 0.42, 0.16), PALETTE.shirt, 0, -0.18, 0);
    const elbow = new THREE.Group();
    elbow.position.set(0, -0.4, 0);
    shoulder.add(elbow);
    add(elbow, new THREE.BoxGeometry(0.14, 0.38, 0.14), 0xf0c8a8, 0, -0.16, 0);
    return { shoulder, elbow };
  }
  const armL = arm(-1);
  const armR = arm(1);

  const net = new THREE.Group();
  armR.elbow.add(net);
  net.position.set(0, -0.36, 0.05);
  add(net, new THREE.CylinderGeometry(0.03, 0.03, 0.85, 5), 0x6a4a28, 0, 0.15, 0);
  const hoop = add(net, new THREE.TorusGeometry(0.28, 0.025, 6, 12), 0xc8b070, 0, 0.62, 0);
  hoop.rotation.x = Math.PI / 2;
  const bag = add(net, new THREE.ConeGeometry(0.26, 0.42, 8, 1, true), 0xd8c898, 0, 0.4, 0);
  bag.material.side = THREE.DoubleSide;
  bag.material.transparent = true;
  bag.material.opacity = 0.75;

  const lantern = new THREE.Group();
  armL.elbow.add(lantern);
  lantern.position.set(0, -0.42, 0.08);
  add(lantern, new THREE.BoxGeometry(0.16, 0.22, 0.16), 0x2a241c, 0, 0, 0);
  const glow = add(lantern, new THREE.BoxGeometry(0.1, 0.12, 0.1), PALETTE.lantern, 0, 0, 0);
  glow.material = new THREE.MeshBasicMaterial({ color: PALETTE.lantern });
  const light = new THREE.PointLight(0xffcc77, 0.9, 7, 2);
  light.position.set(0, 0, 0);
  lantern.add(light);

  add(rig, new THREE.SphereGeometry(0.22, 10, 8), 0xf0c8a8, 0, 2.12, 0);
  add(rig, new THREE.SphereGeometry(0.04, 6, 5), 0xf0c8a8, 0, 2.05, 0.18);
  add(rig, new THREE.BoxGeometry(0.16, 0.05, 0.04), 0x5a3318, -0.07, 2.16, 0.18);
  add(rig, new THREE.BoxGeometry(0.16, 0.05, 0.04), 0x5a3318, 0.07, 2.16, 0.18);

  const hat = new THREE.Group();
  hat.position.set(0, 2.32, 0);
  rig.add(hat);
  add(hat, new THREE.CylinderGeometry(0.2, 0.22, 0.16, 10), PALETTE.hat, 0, 0.06, 0);
  add(hat, new THREE.CylinderGeometry(0.4, 0.4, 0.04, 12), PALETTE.hat, 0, -0.02, 0);
  add(hat, new THREE.BoxGeometry(0.18, 0.03, 0.04), 0x8a5a28, 0, 0.1, 0.16);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.55, 12),
    new THREE.MeshBasicMaterial({ color: 0x24160e, transparent: true, opacity: 0.35 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.03;
  group.add(shadow);

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(1.15, 4.4, 14, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffcc66,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  cone.rotation.x = Math.PI / 2;
  cone.position.set(0, 1.35, -1.5);
  cone.visible = false;
  group.add(cone);

  const bubbleCanvas = document.createElement('canvas');
  bubbleCanvas.width = 512;
  bubbleCanvas.height = 128;
  const bubbleCtx = bubbleCanvas.getContext('2d');
  const bubbleTex = new THREE.CanvasTexture(bubbleCanvas);
  bubbleTex.colorSpace = THREE.SRGBColorSpace;
  const bubble = new THREE.Sprite(new THREE.SpriteMaterial({ map: bubbleTex, transparent: true, depthTest: false }));
  bubble.position.set(0.2, 3.25, 0);
  bubble.scale.set(2.8, 0.7, 1);
  bubble.visible = false;
  group.add(bubble);

  function paintBubble(text) {
    bubbleCtx.clearRect(0, 0, 512, 128);
    bubbleCtx.fillStyle = 'rgba(255, 246, 228, 0.95)';
    bubbleCtx.beginPath();
    bubbleCtx.rect(8, 8, 496, 112);
    bubbleCtx.fill();
    bubbleCtx.lineWidth = 8;
    bubbleCtx.strokeStyle = '#6a2a14';
    bubbleCtx.stroke();
    bubbleCtx.fillStyle = '#2a120c';
    bubbleCtx.font = text.length < 3 ? '900 78px Arial' : '700 36px Arial';
    bubbleCtx.textAlign = 'center';
    bubbleCtx.textBaseline = 'middle';
    bubbleCtx.fillText(text, 256, 66);
    bubbleTex.needsUpdate = true;
  }

  function update(phase, stateName, shout, sweep) {
    const swing = Math.sin(phase);
    legL.hip.rotation.x = swing * 0.7;
    legR.hip.rotation.x = -swing * 0.7;
    legL.shin.rotation.x = Math.max(0, -swing) * 0.6;
    legR.shin.rotation.x = Math.max(0, swing) * 0.6;
    armL.shoulder.rotation.x = -swing * 0.6;
    armL.shoulder.rotation.z = 0;
    armR.shoulder.rotation.x = swing * 0.6;
    rig.position.y = Math.abs(swing) * 0.04;
    rig.rotation.set(0.08, 0, 0);
    net.rotation.x = -0.4;
    cone.visible = stateName === 'SEARCH';
    if (stateName === 'LUNGE') {
      armR.shoulder.rotation.x = -1.7;
      net.rotation.x = 0.35;
      rig.rotation.x = 0.42;
    } else if (stateName === 'SEARCH') {
      const sweepAngle = Math.sin(sweep || phase) * 0.7;
      armL.shoulder.rotation.z = sweepAngle;
      armL.shoulder.rotation.x = -0.55;
      rig.rotation.y = sweepAngle * 0.45;
      cone.rotation.z = sweepAngle;
    } else if (stateName === 'CORNER') {
      rig.rotation.z = -0.18;
      rig.rotation.y = 0.35;
      armR.shoulder.rotation.x = -1.05;
    }
    const shortCue = shout === '?' || shout === '!';
    if (shortCue) {
      if (bubble.userData.last !== shout) {
        paintBubble(shout);
        bubble.userData.last = shout;
      }
      bubble.visible = true;
      bubble.scale.set(0.85, 0.85, 1);
    } else {
      bubble.visible = false;
    }
  }

  group.userData.update = update;
  group.userData.lantern = lantern;
  return group;
}
