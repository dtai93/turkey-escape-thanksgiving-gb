import * as THREE from 'three';

const canvas = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xc47a3a, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xc47a3a, 18, 70);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 3.2, 7);
camera.lookAt(0, 0.8, -6);

const sun = new THREE.DirectionalLight(0xffd2a0, 1.6);
sun.position.set(-8, 12, 6);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffe0c0, 0.45));
scene.add(new THREE.HemisphereLight(0xffb060, 0x5a3a20, 0.5));

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 80),
  new THREE.MeshLambertMaterial({ color: 0x8a6a32 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.z = -30;
scene.add(ground);

const body = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 16, 12),
  new THREE.MeshLambertMaterial({ color: 0x8a4a22 }),
);
body.scale.set(1.1, 0.85, 1.3);
body.position.set(0, 0.85, 0);
scene.add(body);

function frame() {
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
