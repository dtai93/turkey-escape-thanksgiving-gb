// Lane overlaps against props and hazards. Jump clears low obstacles; slide clears the knife.

import * as THREE from 'three';

const wp = new THREE.Vector3();

function overlap(item, bird, reachX, reachZ) {
  item.getWorldPosition(wp);
  const dx = Math.abs(wp.x - bird.x);
  const dz = Math.abs(wp.z - bird.z);
  return dx < reachX && dz < reachZ;
}

export function gatherInteractive(root, out) {
  out.length = 0;
  root.traverse((obj) => {
    const u = obj.userData;
    if (!u) return;
    if (u.solid || u.pickup || u.slow || u.hazard || u.hide || u.alert) out.push(obj);
  });
}

export function resolveContacts(items, bird, height) {
  const result = { hit: null, pickup: 0, slow: false, hideSpot: null, alert: false, near: false };
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const u = item.userData;
    if (u.hide && overlap(item, bird, 1.35, 1.35)) {
      item.getWorldPosition(wp);
      result.hideSpot = { x: wp.x, z: wp.z };
      if (bird.wantHide || bird.hiding) continue;
    }
    if (u.pickup && !u.used && overlap(item, bird, 0.7, 0.75) && bird.y < 1.4) {
      u.used = true;
      item.visible = false;
      result.pickup += 1;
      continue;
    }
    if (u.alert && overlap(item, bird, 1.1, 1.3)) result.alert = true;
    if (u.slow && bird.grounded && overlap(item, bird, 0.8, 0.8)) result.slow = true;

    const dangerous = (u.solid && u.jumpOver) || (u.hazard && u.hot);
    if (!dangerous || u.used) continue;
    const close = overlap(item, bird, 0.78, 0.85);
    const almost = overlap(item, bird, 1.15, 1.15);
    const cleared = bird.y > (u.h || 0.8) - 0.05 || (u.kind === 'knife' && bird.sliding > 0) || bird.hiding;
    if (close && !cleared && !bird.hiding) {
      u.used = true;
      result.hit = u.kind || 'hit';
    } else if (almost && cleared && !u.missed && (u.solid || u.hot || u.warn)) {
      u.missed = true;
      result.near = true;
    }
  }
  return result;
}

export function worldZ(item) {
  item.getWorldPosition(wp);
  return wp.z;
}

export { THREE };
