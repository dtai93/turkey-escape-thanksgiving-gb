// Low chase camera: Tom sits in the lower middle, the lane runs away, Hank stays in frame behind.

import * as THREE from 'three';

export function createCameraRig(camera) {
  const look = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const shake = new THREE.Vector3();
  return {
    snap: true,
    update(bird, farmer, state, dt) {
      const gap = farmer.z - bird.z;
      const back = Math.max(6.5, Math.min(7.7, gap + 3.7));
      desired.set(bird.x + 2.15, 3.05, bird.z + back);
      look.set(bird.x - 0.15, 1.15 + bird.y * 0.25, bird.z - 5.2);
      if (state.caughtPose) {
        desired.set(bird.x + 1.6, 2.3, bird.z + 3.2);
        look.set(bird.x, 0.9, bird.z);
      } else if (state.escapedPose) {
        desired.set(bird.x - 2.2, 2.6, bird.z + 4.5);
        look.set(bird.x, 1.1, bird.z - 6);
      }
      if (this.snap) {
        camera.position.copy(desired);
        this.snap = false;
      } else {
        const k = 1 - Math.exp(-6 * dt);
        camera.position.lerp(desired, k);
      }
      if (state.shake > 0) {
        shake.set((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake, 0);
        camera.position.add(shake);
      }
      camera.lookAt(look);
    },
  };
}
