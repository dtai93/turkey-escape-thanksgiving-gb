// Title and end cards over the live scene. Restart is a real button.

export function createScreens(onRestart) {
  const root = document.createElement('div');
  root.id = 'screens';
  root.style.cssText = 'position:fixed;inset:0;pointer-events:none;font-family:Arial,sans-serif;';
  document.body.appendChild(root);

  const title = document.createElement('div');
  title.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  title.innerHTML = [
    '<div style="position:absolute;top:16px;left:18px;background:rgba(32,14,8,0.78);border:4px solid #ffd7a0;border-radius:16px;padding:12px 16px 12px;color:#fff6e4;text-align:left">',
    '<div style="letter-spacing:4px;font-weight:800;font-size:20px;color:#ffb15e">CRANBERRY HOLLOW</div>',
    '<div style="font-weight:900;font-size:30px;line-height:1.02;margin:2px 0 4px;white-space:nowrap;text-shadow:0 3px 0 #5a2010">The Great Drumstick Dash</div>',
    '<div style="font-weight:800;font-size:22px;color:#ffe08a">PRESS SPACE TO RUN</div>',
    '</div>',
    '<div id="best-line" style="position:absolute;left:22px;bottom:36px;font-size:16px;font-weight:800;color:#fff6e4;text-shadow:0 2px 0 #3a1808"></div>',
    '<div id="hat-line" style="position:absolute;left:22px;bottom:16px;font-size:15px;font-weight:800;color:#ffb15e;text-shadow:0 2px 0 #3a1808"></div>',
    '<div style="position:absolute;right:18px;bottom:14px;font-size:14px;font-weight:800;color:#ffd7a0;text-shadow:0 2px 0 #3a1808">A D lanes · SPACE jump · S slide · SHIFT dash · E hide · Q decoy · P pause · M mute</div>',
  ].join('');
  root.appendChild(title);

  const end = document.createElement('div');
  end.style.cssText = 'position:absolute;inset:0;display:none;align-items:center;justify-content:flex-end;padding-right:28px;pointer-events:none;';
  end.innerHTML = [
    '<div style="background:rgba(28,12,8,0.62);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:4px solid #ffd7a0;border-radius:18px;padding:18px 26px;color:#fff6e4;text-align:center;width:390px;pointer-events:auto">',
    '<div id="end-title" style="font-weight:900;font-size:58px;text-shadow:0 4px 0 #5a2010">CAUGHT!</div>',
    '<div id="end-sub" style="font-weight:700;font-size:18px;color:#ffd7a0;margin-bottom:8px"></div>',
    '<div id="end-stats" style="font-size:22px;line-height:1.4;font-weight:800"></div>',
    '<button id="restart" type="button" style="margin-top:14px;font-weight:900;font-size:22px;padding:12px 18px;border-radius:12px;border:3px solid #ffd7a0;background:#a33228;color:#fff6e4;cursor:pointer">RUN AGAIN (R / ENTER)</button>',
    '</div>',
  ].join('');
  root.appendChild(end);
  end.querySelector('#restart').addEventListener('click', () => onRestart());

  function show(state) {
    const onTitle = state.mode === 'title';
    const onEnd = state.mode === 'end';
    title.style.display = onTitle ? 'flex' : 'none';
    end.style.display = onEnd ? 'flex' : 'none';
    if (onTitle) {
      const hats = (state.hats || []).filter((name) => name && name !== 'none');
      title.querySelector('#best-line').textContent = `BEST ${Math.floor(state.bestScore)}   ·   BEST STAGE ${state.bestStage || 0}`;
      title.querySelector('#hat-line').textContent = hats.length ? `HATS  ${hats.join(' · ').toUpperCase()}` : 'HATS  NONE YET — ESCAPE TO UNLOCK';
    }
    if (onEnd) {
      const won = state.result === 'escaped';
      end.querySelector('#end-title').textContent = won ? 'ESCAPED!' : 'CAUGHT!';
      end.querySelector('#end-title').style.color = won ? '#ffe08a' : '#ff6a4a';
      end.querySelector('#end-sub').textContent = won
        ? 'Tom Wattles made the woods.'
        : 'Farmer Hank got his dinner.';
      const hats = (state.hats || []).filter((name) => name && name !== 'none');
      end.querySelector('#end-stats').innerHTML = [
        `SCORE ${Math.floor(state.score)}`,
        `DIST ${Math.floor(state.distance)} m`,
        `STAGE ${state.stageIndex + 1}  ${state.stageName}`,
        `NEAR MISSES ${state.nearMisses}`,
        `BEST ${Math.floor(state.bestScore)}`,
        `HATS ${hats.length ? hats.join(' · ').toUpperCase() : 'NONE YET'}`,
      ].join('<br>');
    }
  }

  return { show };
}
