// Bold in-run HUD. Labels stay readable when the contact sheet shrinks the cover.

export function createHud(canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function panel(x, y, w, h) {
    ctx.fillStyle = 'rgba(28, 14, 8, 0.78)';
    ctx.strokeStyle = 'rgba(255, 214, 150, 0.85)';
    ctx.lineWidth = 3;
    roundRect(x, y, w, h, 12);
    ctx.fill();
    ctx.stroke();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function feather(x, y, alive) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = alive ? '#f3e0bc' : 'rgba(80, 60, 40, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 18, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = alive ? '#8a4520' : '#3a2a1c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(0, -16);
    ctx.stroke();
    ctx.restore();
  }

  function draw(state) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    if (state.mode === 'title') return;

    panel(16, 16, 250, 92);
    ctx.fillStyle = '#ffd7a0';
    ctx.font = '700 16px Arial, sans-serif';
    ctx.fillText('SCORE', 32, 40);
    ctx.fillStyle = '#fff6e4';
    ctx.font = '900 36px Arial Black, Arial, sans-serif';
    ctx.fillText(String(Math.floor(state.score)), 32, 80);

    panel(16, 118, 250, 64);
    ctx.fillStyle = '#ffd7a0';
    ctx.font = '700 16px Arial, sans-serif';
    ctx.fillText('DIST', 32, 142);
    ctx.fillStyle = '#fff6e4';
    ctx.font = '900 28px Arial Black, Arial, sans-serif';
    ctx.fillText(`${Math.floor(state.distance)} m`, 100, 146);

    const stageW = Math.min(420, w * 0.36);
    panel((w - stageW) / 2, 16, stageW, 78);
    ctx.fillStyle = '#fff6e4';
    ctx.font = '900 26px Arial Black, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`STAGE  ${state.stageName}`, w / 2, 48);
    ctx.textAlign = 'left';
    const barX = (w - stageW) / 2 + 18;
    const barW = stageW - 36;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(barX, 60, barW, 16);
    ctx.fillStyle = '#e07020';
    ctx.fillRect(barX, 60, barW * state.stageProgress, 16);
    ctx.strokeStyle = '#ffd7a0';
    ctx.strokeRect(barX, 60, barW, 16);

    panel(w - 280, 16, 264, 120);
    ctx.fillStyle = '#ffd7a0';
    ctx.font = '700 16px Arial, sans-serif';
    ctx.fillText('LIVES', w - 260, 40);
    for (let i = 0; i < 3; i += 1) feather(w - 160 + i * 36, 36, i < state.lives);
    const danger = state.farmerDist < 3.2;
    ctx.fillStyle = danger ? '#ffb0a0' : '#ffd7a0';
    ctx.font = '700 16px Arial, sans-serif';
    ctx.fillText('FARMER', w - 260, 78);
    ctx.fillStyle = danger ? '#ff5a3a' : '#fff6e4';
    ctx.font = '900 28px Arial Black, Arial, sans-serif';
    ctx.fillText(`${state.farmerDist.toFixed(1)} m`, w - 150, 82);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(w - 260, 98, 220, 14);
    const gauge = Math.max(0, Math.min(1, 1 - state.farmerDist / 12));
    ctx.fillStyle = danger ? '#ff3a2a' : '#f0a030';
    ctx.fillRect(w - 260, 98, 220 * gauge, 14);

    if (state.bannerT > 0 && state.banner) {
      ctx.textAlign = 'center';
      ctx.font = '900 54px Arial Black, Arial, sans-serif';
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#2a120c';
      ctx.fillStyle = state.banner === 'OUCH!' ? '#ff5a3a' : state.banner === 'HIDDEN' ? '#9ad0ff' : '#ffe08a';
      ctx.strokeText(state.banner, w / 2, h * 0.28);
      ctx.fillText(state.banner, w / 2, h * 0.28);
      ctx.textAlign = 'left';
    }

    if (state.mode === 'pause') {
      ctx.fillStyle = 'rgba(20, 10, 6, 0.45)';
      ctx.fillRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff6e4';
      ctx.font = '900 64px Arial Black, Arial, sans-serif';
      ctx.fillText('PAUSED', w / 2, h / 2);
      ctx.font = '700 22px Arial, sans-serif';
      ctx.fillText('PRESS P TO RUN', w / 2, h / 2 + 40);
      ctx.textAlign = 'left';
    }
  }

  resize();
  return { resize, draw };
}
