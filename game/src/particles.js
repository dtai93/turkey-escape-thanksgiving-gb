// Feathers, autumn leaves, and short-lived puffs. A small pool, no allocations per burst.

import * as THREE from 'three';
import { PALETTE } from './config.js';

function makePool(scene, count, color, size, leaf) {
  const geo = leaf
    ? new THREE.PlaneGeometry(size, size * 0.6)
    : new THREE.SphereGeometry(size, 5, 4);
  const mat = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  scene.add(mesh);
  const items = [];
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i += 1) {
    items.push({ life: 0, x: 0, y: -10, z: 0, vx: 0, vy: 0, vz: 0, spin: 0, rot: Math.random() * 6 });
  }
  return {
    items,
    burst(x, y, z, n, spread) {
      let left = n;
      for (let i = 0; i < items.length && left > 0; i += 1) {
        const p = items[i];
        if (p.life > 0) continue;
        p.life = 0.8 + Math.random() * 0.6;
        p.x = x;
        p.y = y;
        p.z = z;
        p.vx = (Math.random() - 0.5) * spread;
        p.vy = Math.random() * spread;
        p.vz = (Math.random() - 0.5) * spread;
        p.spin = Math.random() * 6;
        left -= 1;
      }
    },
    tick(dt, windZ) {
      for (let i = 0; i < items.length; i += 1) {
        const p = items[i];
        dummy.position.set(0, -20, 0);
        dummy.scale.set(0.001, 0.001, 0.001);
        if (p.life > 0) {
          p.life -= dt;
          p.vy -= 2.2 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += (p.vz + windZ) * dt;
          p.rot += p.spin * dt;
          if (p.y < 0.05) {
            p.y = 0.05;
            p.vy *= -0.2;
          }
          dummy.position.set(p.x, p.y, p.z);
          dummy.rotation.set(p.rot, p.rot * 0.7, 0);
          dummy.scale.setScalar(1);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

export function createParticles(scene) {
  const feathers = makePool(scene, 40, PALETTE.cream, 0.09, true);
  const leaves = makePool(scene, 36, PALETTE.leaf, 0.16, true);
  const leaves2 = makePool(scene, 24, 0xe0a030, 0.14, true);
  const fire = makePool(scene, 16, 0xff6a20, 0.12, false);
  const corn = makePool(scene, 28, 0xf0c030, 0.07, false);
  const dust = makePool(scene, 32, 0xc4a06a, 0.1, true);
  return {
    feathers,
    leaves,
    fire,
    ambient(bird, rng) {
      if (rng() < 0.4) {
        leaves.burst(bird.x + (rng() - 0.5) * 10, 4 + rng() * 3, bird.z - rng() * 16, 1, 0.4);
      }
      if (rng() < 0.25) {
        leaves2.burst(bird.x + (rng() - 0.5) * 8, 3.5, bird.z - 4 - rng() * 10, 1, 0.3);
      }
    },
    puffFeathers(x, y, z) {
      feathers.burst(x, y, z, 10, 3.5);
    },
    puffFire(x, y, z) {
      fire.burst(x, y, z, 6, 2);
    },
    puffCorn(x, y, z) {
      corn.burst(x, y, z, 14, 4.2);
    },
    puffDust(x, y, z) {
      dust.burst(x, y, z, 16, 3.2);
    },
    puffLeaves(x, y, z) {
      leaves.burst(x, y, z, 8, 2.4);
      leaves2.burst(x - 0.6, y - 0.4, z + 0.4, 6, 2);
    },
    tick(dt) {
      feathers.tick(dt, 0);
      leaves.tick(dt, -1.5);
      leaves2.tick(dt, -1.2);
      fire.tick(dt, 0.4);
      corn.tick(dt, -0.4);
      dust.tick(dt, 0.2);
    },
  };
}
