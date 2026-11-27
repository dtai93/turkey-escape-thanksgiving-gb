// Keyboard edges. Held keys stay true; just-pressed flags clear each frame.

const CODES = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyW: 'up',
  KeyS: 'down',
  Space: 'jump',
  ShiftLeft: 'dash',
  ShiftRight: 'dash',
  KeyE: 'hide',
  KeyH: 'hide',
  KeyQ: 'decoy',
  KeyP: 'pause',
  KeyM: 'mute',
  KeyR: 'restart',
  Enter: 'restart',
};

export function createInput() {
  const held = {};
  const pressed = {};
  const pressedQueue = {};

  function down(event) {
    const name = CODES[event.code];
    if (!name) return;
    event.preventDefault();
    if (!held[name]) pressedQueue[name] = true;
    held[name] = true;
  }

  function up(event) {
    const name = CODES[event.code];
    if (!name) return;
    held[name] = false;
  }

  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', () => {
    for (const key of Object.keys(held)) held[key] = false;
  });

  return {
    held,
    pressed,
    // Call once per simulation step. Autopilot may set pressed before this.
    pump() {
      for (const key of Object.keys(pressed)) pressed[key] = false;
      for (const key of Object.keys(pressedQueue)) {
        if (pressedQueue[key]) pressed[key] = true;
        pressedQueue[key] = false;
      }
    },
    tap(name) {
      pressed[name] = true;
    },
    clear() {
      for (const key of Object.keys(held)) held[key] = false;
      for (const key of Object.keys(pressed)) pressed[key] = false;
    },
  };
}
