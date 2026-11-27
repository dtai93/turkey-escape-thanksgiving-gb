// Deterministic canvas textures. Built once, cached, and shared across the track.

import * as THREE from 'three';
import { makeRng } from './random.js';

const maps = new Map();
const mats = new Map();

function rngFor(name) {
  let h = 2166136261;
  const s = String(name);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return makeRng(h >>> 0 || 1);
}

function paint(name, draw) {
  if (maps.has(name)) return maps.get(name);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  draw(canvas.getContext('2d'), 256, rngFor(name));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.userData.shared = true;
  tex.needsUpdate = true;
  maps.set(name, tex);
  return tex;
}

function drawBarn(ctx, s, rng) {
  ctx.fillStyle = '#8e2a24';
  ctx.fillRect(0, 0, s, s);
  const plank = 26;
  for (let x = 0; x < s; x += plank) {
    const lift = (rng() * 28) | 0;
    ctx.fillStyle = `rgb(${132 + lift}, ${34 + ((rng() * 16) | 0)}, ${28 + ((rng() * 8) | 0)})`;
    ctx.fillRect(x + 2, 0, plank - 3, s);
    ctx.fillStyle = 'rgba(36, 10, 8, 0.7)';
    ctx.fillRect(x, 0, 2, s);
    for (let y = 18; y < s; y += 42) {
      ctx.fillStyle = 'rgba(40, 18, 12, 0.55)';
      ctx.beginPath();
      ctx.arc(x + 10, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = '#f4efe6';
  ctx.fillRect(0, 0, s, 10);
  ctx.fillRect(0, s - 10, s, 10);
  ctx.fillRect(0, 0, 8, s);
  ctx.fillRect(s - 8, 0, 8, s);
}

function drawGrass(ctx, s, rng) {
  ctx.fillStyle = '#5c6a30';
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 1100; i += 1) {
    const x = rng() * s;
    const y = rng() * s;
    ctx.strokeStyle = rng() > 0.45 ? '#8a9844' : '#3e4a22';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rng() - 0.5) * 4, y - (5 + rng() * 16));
    ctx.stroke();
  }
  const leaves = ['#c45028', '#e0a040', '#8c3028', '#d8c060', '#a33a22'];
  for (let i = 0; i < 48; i += 1) {
    ctx.save();
    ctx.translate(rng() * s, rng() * s);
    ctx.rotate(rng() * Math.PI);
    ctx.fillStyle = leaves[(rng() * leaves.length) | 0];
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawDirt(ctx, s, rng) {
  ctx.fillStyle = '#6a4e2a';
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 2200; i += 1) {
    const g = 60 + ((rng() * 55) | 0);
    ctx.fillStyle = `rgb(${g + 28}, ${g - 4}, ${32 + ((rng() * 18) | 0)})`;
    ctx.fillRect(rng() * s, rng() * s, 1 + ((rng() * 2) | 0), 1 + ((rng() * 2) | 0));
  }
  ctx.strokeStyle = 'rgba(48, 28, 12, 0.5)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 7; i += 1) {
    ctx.beginPath();
    const y0 = rng() * s;
    ctx.moveTo(0, y0);
    ctx.bezierCurveTo(s * 0.33, rng() * s, s * 0.66, rng() * s, s, y0 + (rng() - 0.5) * 20);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(36, 20, 10, 0.38)';
  for (let i = 0; i < 16; i += 1) {
    ctx.beginPath();
    ctx.ellipse(rng() * s, rng() * s, 5, 9, rng() * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWood(ctx, s, rng) {
  ctx.fillStyle = '#a87440';
  ctx.fillRect(0, 0, s, s);
  const plank = 36;
  for (let y = 0; y < s; y += plank) {
    const v = (rng() * 30) | 0;
    ctx.fillStyle = `rgb(${150 + v}, ${96 + ((rng() * 24) | 0)}, ${48})`;
    ctx.fillRect(0, y, s, plank - 3);
    ctx.fillStyle = 'rgba(48, 26, 12, 0.65)';
    ctx.fillRect(0, y + plank - 3, s, 3);
    ctx.strokeStyle = 'rgba(90, 48, 18, 0.4)';
    ctx.lineWidth = 1;
    for (let k = 0; k < 5; k += 1) {
      const gy = y + 6 + k * 6;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.quadraticCurveTo(s * 0.5, gy + (rng() - 0.5) * 8, s, gy + (rng() - 0.5) * 4);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(70, 36, 14, 0.5)';
    ctx.beginPath();
    ctx.ellipse(40 + rng() * (s - 80), y + 16, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHay(ctx, s, rng) {
  ctx.fillStyle = '#c48a28';
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 700; i += 1) {
    ctx.strokeStyle = rng() > 0.45 ? '#f2d48a' : '#8a5418';
    ctx.lineWidth = 1;
    const x = rng() * s;
    const y = rng() * s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8 + rng() * 22, y + (rng() - 0.5) * 4);
    ctx.stroke();
  }
}

function drawChecker(ctx, s) {
  const n = 2;
  const tile = s / n;
  ctx.fillStyle = '#5c382e';
  ctx.fillRect(0, 0, s, s);
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      const dark = (x + y) % 2 === 0;
      ctx.fillStyle = dark ? '#c44732' : '#f4ecdf';
      ctx.fillRect(x * tile + 3, y * tile + 3, tile - 6, tile - 6);
      ctx.fillStyle = dark ? 'rgba(255, 220, 180, 0.08)' : 'rgba(90, 50, 30, 0.08)';
      ctx.fillRect(x * tile + 10, y * tile + 10, tile * 0.35, tile * 0.15);
    }
  }
}

function drawCabinet(ctx, s, rng) {
  ctx.fillStyle = '#f1e6d2';
  ctx.fillRect(0, 0, s, s);
  for (let x = 0; x < s; x += 3) {
    ctx.strokeStyle = `rgba(140, 96, 52, ${0.06 + rng() * 0.16})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (rng() - 0.5) * 10, s);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(110, 74, 36, 0.45)';
  ctx.lineWidth = 8;
  ctx.strokeRect(22, 22, s - 44, s - 44);
  ctx.fillStyle = 'rgba(196, 160, 96, 0.9)';
  ctx.beginPath();
  ctx.arc(s * 0.5, s * 0.5, 7, 0, Math.PI * 2);
  ctx.fill();
}

const DRAW = {
  barn: drawBarn,
  grass: drawGrass,
  dirt: drawDirt,
  wood: drawWood,
  hay: drawHay,
  checker: drawChecker,
  cabinet: drawCabinet,
};

export function textured(name, repeatU, repeatV, tint, doubleSide) {
  const ru = repeatU || 1;
  const rv = repeatV || 1;
  const tintKey = tint == null ? 'white' : String(tint);
  const key = `${name}@${ru}x${rv}@${tintKey}@${doubleSide ? 1 : 0}`;
  const hit = mats.get(key);
  if (hit) return hit;
  const map = paint(name, DRAW[name]).clone();
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(ru, rv);
  map.anisotropy = 4;
  map.userData.shared = true;
  map.needsUpdate = true;
  const mat = new THREE.MeshLambertMaterial({
    map,
    color: tint == null ? 0xffffff : tint,
    side: doubleSide ? THREE.DoubleSide : THREE.FrontSide,
  });
  mat.userData.shared = true;
  mats.set(key, mat);
  return mat;
}
