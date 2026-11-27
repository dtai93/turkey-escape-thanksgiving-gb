// Tiny WebAudio blips: gobble, steps, shouts, oven, knife, fanfare. No samples.

export function createAudio() {
  let ctx = null;
  let master = null;
  let muted = false;
  let loopOn = false;

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.25;
    master.connect(ctx.destination);
  }

  function tone(freq, dur, type, gain, slide) {
    if (!ctx || muted) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), ctx.currentTime + dur);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(g);
    g.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  }

  function noise(dur, gain, freq) {
    if (!ctx || muted) return;
    const length = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    src.start();
  }

  let stepAcc = 0;
  let musicT = 0;

  return {
    unlock() {
      ensure();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    },
    setMuted(flag) {
      muted = flag;
      if (master) master.gain.value = flag ? 0 : 0.25;
    },
    gobble() { tone(220, 0.18, 'sawtooth', 0.2, 0.6); tone(140, 0.22, 'square', 0.08, 0.7); },
    shout() { noise(0.25, 0.18, 900); tone(180, 0.2, 'square', 0.08, 1.4); },
    oven() { noise(0.35, 0.2, 400); },
    knife() { tone(880, 0.12, 'sawtooth', 0.12, 2.2); },
    thud() { tone(90, 0.2, 'sine', 0.3, 0.4); },
    whoosh() { noise(0.18, 0.15, 1400); },
    fanfare() {
      tone(523, 0.2, 'triangle', 0.15, 1);
      setTimeout(() => tone(659, 0.2, 'triangle', 0.15, 1), 140);
      setTimeout(() => tone(784, 0.4, 'triangle', 0.16, 1), 280);
    },
    sting() { tone(196, 0.4, 'sawtooth', 0.16, 0.5); tone(98, 0.5, 'square', 0.1, 0.4); },
    tick(dt, running) {
      if (!ctx || muted || !running) return;
      stepAcc += dt;
      if (stepAcc > 0.28) {
        stepAcc = 0;
        noise(0.05, 0.06, 180);
      }
      musicT += dt;
      if (!loopOn) {
        loopOn = true;
      }
      if (musicT > 0.5) {
        musicT = 0;
        const notes = [392, 440, 494, 440, 349, 392];
        const n = notes[(Math.random() * notes.length) | 0];
        tone(n, 0.18, 'triangle', 0.04, 1);
      }
    },
  };
}
