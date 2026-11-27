// Chase camera sits well behind and above Tom. World forward is -Z, so the rig
// stays on +Z and looks down the lane. Tom lands in the lower-middle third;
// Hank, between the camera and the turkey, stays fully in frame.

import * as THREE from 'three';

export function createCameraRig(camera) {
  const look = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const shake = new THREE.Vector3();
  return {
    snap: true,
    update(bird, farmer, state, dt) {
      // Check: bird at origin → cam (0.55, 4.35, 10.6), look (-0.2, 1.15, -8.2).
      // View aims mostly -Z and a little down, so the tail does not fill the lens.
      desired.set(bird.x + 0.7, 3.55, bird.z + 9.2);
      look.set(bird.x, 1.05, bird.z - 7.5);
      if (state.shot === 'cover') {
        desired.set(bird.x + 2.55, 3.15, bird.z + 8.15);
        look.set(bird.x - 0.15, 0.95, bird.z - 6.6);
      } else if (state.shot === 'kitchen') {
        desired.set(bird.x + 0.2, 2.25, bird.z + 5.35);
        look.set(bird.x - 0.35, 0.82, bird.z - 4.8);
      } else if (state.mode === 'title') {
        desired.set(-1.6, 2.55, 1.4);
        look.set(0.1, 0.85, -9.4);
      } else if (state.caughtPose) {
        desired.set(bird.x - 3.6, 2.35, bird.z + 5.4);
        look.set(bird.x + 1.4, 1.05, bird.z - 1.2);
      } else if (state.escapedPose) {
        desired.set(bird.x - 3.2, 2.6, bird.z + 6.2);
        look.set(bird.x, 1.15, bird.z - 8);
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
