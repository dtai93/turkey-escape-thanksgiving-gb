// Best score, best stage and unlocked hats. localStorage when the browser allows it.

const KEY = 'cranberry-hollow-save-v1';

const EMPTY = {
  bestScore: 0,
  bestStage: 0,
  hats: ['none'],
  hat: 'none',
  muted: false,
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, hats: EMPTY.hats.slice() };
    const data = JSON.parse(raw);
    return {
      bestScore: Number(data.bestScore) || 0,
      bestStage: Number(data.bestStage) || 0,
      hats: Array.isArray(data.hats) && data.hats.length ? data.hats : ['none'],
      hat: data.hat || 'none',
      muted: Boolean(data.muted),
    };
  } catch {
    return { ...EMPTY, hats: EMPTY.hats.slice() };
  }
}

export function writeSave(state) {
  const payload = {
    bestScore: state.bestScore,
    bestStage: state.bestStage,
    hats: state.hats,
    hat: state.hat,
    muted: state.muted,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* private mode or a file:// origin can refuse storage */
  }
}

export function recordRun(state) {
  if (state.score > state.bestScore) state.bestScore = Math.floor(state.score);
  if (state.stageIndex + 1 > state.bestStage) state.bestStage = state.stageIndex + 1;
  if (state.result === 'escaped' && state.hats.indexOf('straw') < 0) state.hats.push('straw');
  if (state.nearMisses >= 8 && state.hats.indexOf('pilot') < 0) state.hats.push('pilot');
  if (state.score >= 2500 && state.hats.indexOf('cranberry') < 0) state.hats.push('cranberry');
  writeSave(state);
}
