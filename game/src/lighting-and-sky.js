// Warm low autumn sun, long shadows, distance fog, and a painted sky gradient.

import * as THREE from 'three';
import { PALETTE } from './config.js';

function skyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#2a1c3c');
  g.addColorStop(0.42, '#8a3a48');
  g.addColorStop(0.72, '#e07038');
  g.addColorStop(1, '#ffc278');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createLighting(scene) {
  scene.fog = new THREE.Fog(PALETTE.fog, 28, 78);
  scene.background = new THREE.Color(PALETTE.skyHorizon);

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(90, 20, 12),
    new THREE.MeshBasicMaterial({ map: skyTexture(), side: THREE.BackSide, depthWrite: false, fog: false }),
  );
  scene.add(sky);

  const hemi = new THREE.HemisphereLight(0xffc48a, 0x5a3a22, 0.72);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffe0b0, 1.55);
  sun.position.set(-14, 18, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 50;
  sun.shadow.camera.left = -18;
  sun.shadow.camera.right = 18;
  sun.shadow.camera.top = 18;
  sun.shadow.camera.bottom = -18;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xff8844, 0.28);
  fill.position.set(8, 6, -4);
  scene.add(fill);

  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffe4b0, fog: false }),
  );
  scene.add(sunDisc);

  return {
    sky,
    sun,
    follow(x, z) {
      sky.position.set(x, 0, z);
      sun.position.set(x - 12, 16, z + 8);
      sun.target.position.set(x, 0, z - 6);
      sun.target.updateMatrixWorld();
      sunDisc.position.set(x + 18, 7.5, z - 48);
    },
  };
}
