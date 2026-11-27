// Hay, corn and cabinets the turkey can duck into. Hank loses the trail while the meter lasts.

const HIDE_RANGE = 1.35;
const MAX_HIDE = 1.7;

export function findHideSpot(spots, bird) {
  let best = null;
  let bestD = HIDE_RANGE;
  for (let i = 0; i < spots.length; i += 1) {
    const spot = spots[i];
    const dx = spot.x - bird.x;
    const dz = spot.z - bird.z;
    const d = Math.hypot(dx, dz);
    if (d < bestD) {
      bestD = d;
      best = spot;
    }
  }
  return best;
}

export function stepHide(state, bird, spot, dt) {
  const can = Boolean(spot) && bird.wantHide && bird.grounded && bird.sliding <= 0;
  if (can) {
    bird.hiding = true;
    state.hidden = true;
    state.hideMeter = Math.min(MAX_HIDE, state.hideMeter + dt);
    bird.x += (spot.x - bird.x) * Math.min(1, 8 * dt);
    if (state.hideMeter >= MAX_HIDE) {
      bird.hiding = false;
      state.hidden = false;
      state.spotted = true;
      state.hideMeter = 0;
      return 'found';
    }
    return 'hidden';
  }
  if (bird.hiding) {
    bird.hiding = false;
    state.hidden = false;
  }
  state.hideMeter = Math.max(0, state.hideMeter - dt * 1.5);
  return '';
}
