// Low chase camera: Tom sits in the lower middle, the lane runs away, Hank stays in frame behind.

import * as THREE from 'three';

export function createCameraRig(camera) {
  const look = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const shake = new THREE.Vector3();
  return {
    snap: true,
    update(bird, farmer, state, dt) {
      desired.set(bird.x + 0.4, 3.2, bird.z + 7.35);
      look.set(bird.x, 0.9, bird.z - 8.2);
      if (state.shot === 'kitchen') {
        desired.set(bird.x, 3.55, bird.z + 5.15);
        look.set(bird.x, 0.65, bird.z - 9.5);
      } else if (state.mode === 'title') {
        desired.set(-1.1, 2.25, 4.9);
        look.set(0.55, 0.85, -2.8);
      } else if (state.caughtPose) {
        desired.set(bird.x + 3.5, 2.25, bird.z + 4.5);
        look.set(bird.x + 0.1, 1.0, bird.z + 0.2);
      } else if (state.escapedPose) {
        desired.set(bird.x - 2.6, 2.15, bird.z + 4.8);
        look.set(bird.x, 1.05, bird.z - 7);
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
