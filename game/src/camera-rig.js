// Low chase camera: Tom sits in the lower middle, the lane runs away, Hank stays in frame behind.

import * as THREE from 'three';

export function createCameraRig(camera) {
  const look = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const shake = new THREE.Vector3();
  return {
    snap: true,
    update(bird, farmer, state, dt) {
      desired.set(bird.x - 0.25, 2.35, bird.z + 5.85);
      look.set(bird.x + 0.1, 0.62, bird.z - 2.15);
      if (state.shot === 'cover') {
        desired.set(bird.x + 0.15, 2.55, bird.z + 6.15);
        look.set(bird.x - 0.1, 0.42, bird.z - 2.4);
      } else if (state.shot === 'kitchen') {
        desired.set(bird.x + 0.35, 2.45, bird.z + 5.7);
        look.set(bird.x - 0.15, 0.72, bird.z - 2.5);
      } else if (state.mode === 'title') {
        desired.set(-0.7, 1.9, -1.6);
        look.set(0.15, 0.7, -8.2);
      } else if (state.caughtPose) {
        desired.set(bird.x - 2.5, 1.72, bird.z + 3.5);
        look.set(bird.x + 2.1, 0.95, bird.z - 0.6);
      } else if (state.escapedPose) {
        desired.set(bird.x - 2.4, 1.9, bird.z + 4.4);
        look.set(bird.x, 1.0, bird.z - 6);
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
