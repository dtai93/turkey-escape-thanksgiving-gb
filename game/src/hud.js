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
    if (state.mode === 'title' || state.mode === 'end') return;

    panel(12, 10, 168, 58);
    ctx.fillStyle = '#ffd7a0';
    ctx.font = '700 13px Arial, sans-serif';
    ctx.fillText('SCORE', 24, 28);
    ctx.fillStyle = '#fff6e4';
    ctx.font = '900 28px Arial Black, Arial, sans-serif';
    ctx.fillText(String(Math.floor(state.score)), 24, 56);

    panel(188, 10, 150, 58);
    ctx.fillStyle = '#ffd7a0';
    ctx.font = '700 13px Arial, sans-serif';
    ctx.fillText('DIST', 202, 28);
    ctx.fillStyle = '#fff6e4';
    ctx.font = '900 26px Arial Black, Arial, sans-serif';
    ctx.fillText(`${Math.floor(state.distance)} m`, 202, 56);

    const stageW = Math.min(340, w * 0.28);
    panel((w - stageW) / 2, 10, stageW, 58);
    ctx.fillStyle = '#fff6e4';
    ctx.font = '900 20px Arial Black, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`STAGE ${state.stageIndex + 1}  ${state.stageName}`, w / 2, 34);
    ctx.textAlign = 'left';
    const barX = (w - stageW) / 2 + 14;
    const barW = stageW - 28;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(barX, 44, barW, 12);
    ctx.fillStyle = '#e07020';
    ctx.fillRect(barX, 44, barW * state.stageProgress, 12);
    ctx.strokeStyle = '#ffd7a0';
    ctx.strokeRect(barX, 44, barW, 12);

    panel(w - 292, 10, 280, 58);
    ctx.fillStyle = '#ffd7a0';
    ctx.font = '700 13px Arial, sans-serif';
    ctx.fillText('LIVES', w - 278, 28);
    for (let i = 0; i < 3; i += 1) feather(w - 214 + i * 28, 26, i < state.lives);
    const danger = state.farmerDist < 3.2;
    ctx.fillStyle = danger ? '#ffb0a0' : '#ffd7a0';
    ctx.font = '700 13px Arial, sans-serif';
    ctx.fillText('FARMER', w - 278, 52);
    ctx.fillStyle = danger ? '#ff5a3a' : '#fff6e4';
    ctx.font = '900 20px Arial Black, Arial, sans-serif';
    ctx.fillText(`${state.farmerDist.toFixed(1)} m`, w - 200, 54);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(w - 112, 42, 86, 10);
    const gauge = Math.max(0, Math.min(1, 1 - state.farmerDist / 12));
    ctx.fillStyle = danger ? '#ff3a2a' : '#f0a030';
    ctx.fillRect(w - 112, 42, 86 * gauge, 10);

    ctx.fillStyle = 'rgba(20,10,6,0.55)';
    ctx.fillRect(12, 74, 120, 8);
    ctx.fillStyle = state.stamina < 0.42 ? '#ff5a3a' : '#7dcf6a';
    ctx.fillRect(12, 74, 120 * Math.max(0, Math.min(1, state.stamina)), 8);
    ctx.fillStyle = '#ffd7a0';
    ctx.font = '700 12px Arial, sans-serif';
    ctx.fillText(`DECOY ${state.decoys}`, 140, 82);

    if (state.hidden || state.hideMeter > 0.02) {
      panel(12, 88, 210, 36);
      ctx.fillStyle = '#9ad0ff';
      ctx.font = '700 13px Arial, sans-serif';
      ctx.fillText('HIDDEN', 24, 112);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(90, 102, 116, 10);
      ctx.fillStyle = state.hideMeter > 0.75 ? '#ff5a3a' : '#7ec8ff';
      ctx.fillRect(90, 102, 116 * Math.max(0, Math.min(1, state.hideMeter)), 10);
    }

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255, 70, 40, ${Math.min(0.45, state.flash)})`;
      ctx.fillRect(0, 0, w, h);
    }

    if (state.bannerT > 0 && state.banner) {
      ctx.textAlign = 'center';
      ctx.font = '900 64px Arial Black, Arial, sans-serif';
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#2a120c';
      const bannerColor = state.banner === 'OUCH!' || state.banner === 'SPOTTED!' || state.banner === 'CORNERED!'
        ? '#ff5a3a'
        : state.banner === 'HIDDEN'
          ? '#9ad0ff'
          : '#ffe08a';
      ctx.fillStyle = bannerColor;
      ctx.strokeText(state.banner, w / 2, h * 0.2);
      ctx.fillText(state.banner, w / 2, h * 0.2);
      ctx.textAlign = 'left';
    }

    if (state.shoutT > 0 && state.shout) {
      ctx.textAlign = 'center';
      ctx.font = '900 32px Arial Black, Arial, sans-serif';
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#2a120c';
      ctx.fillStyle = '#fff6e4';
      ctx.strokeText(state.shout, w * 0.72, h * 0.3);
      ctx.fillText(state.shout, w * 0.72, h * 0.3);
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
      ctx.font = '700 18px Arial, sans-serif';
      ctx.fillText('A D lanes · SPACE jump · S slide · SHIFT dash · E hide · Q decoy · M mute', w / 2, h / 2 + 78);
      ctx.textAlign = 'left';
    }
  }

  resize();
  return { resize, draw };
}
