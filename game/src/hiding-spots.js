// Hay, corn, barrels and cabinets. Hold E or H to crouch inside. Stay too long and Hank finds you.

const HIDE_RANGE = 1.45;
const FILL_TIME = 2.15;

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
  const can = Boolean(spot) && bird.wantHide && bird.grounded && bird.sliding <= 0 && bird.dashing <= 0;
  if (can) {
    const starting = !bird.hiding;
    bird.hiding = true;
    state.hidden = true;
    state.hideMeter = Math.min(1, state.hideMeter + dt / FILL_TIME);
    bird.x += (spot.x - bird.x) * Math.min(1, 9 * dt);
    bird.pose = 'hide';
    if (state.hideMeter >= 1) {
      bird.hiding = false;
      state.hidden = false;
      state.spotted = true;
      state.hideMeter = 0;
      return 'found';
    }
    return starting ? 'start' : 'hidden';
  }
  if (bird.hiding) {
    bird.hiding = false;
    state.hidden = false;
  }
  if (!bird.wantHide) state.hideMeter = Math.max(0, state.hideMeter - dt * 0.8);
  return '';
}
