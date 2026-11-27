// Three stages, each longer and meaner: farmyard, barn & porch, kitchen.

export const STAGES = [
  {
    id: 'farmyard',
    name: 'FARMYARD',
    length: 190,
    speed: 12.2,
    farmer: 0.15,
    density: 0.55,
    fog: 0xe08848,
    ground: 0x6e552c,
  },
  {
    id: 'barn',
    name: 'BARN & PORCH',
    length: 220,
    speed: 13.6,
    farmer: 0.45,
    density: 0.75,
    fog: 0xc46a40,
    ground: 0x6a4630,
  },
  {
    id: 'kitchen',
    name: 'KITCHEN',
    length: 200,
    speed: 15.1,
    farmer: 0.8,
    density: 0.95,
    fog: 0xd8b8a0,
    ground: 0xc45a3a,
  },
];

export function stageAtDistance(distance) {
  let cursor = 0;
  for (let i = 0; i < STAGES.length; i += 1) {
    cursor += STAGES[i].length;
    if (distance < cursor) return { index: i, stage: STAGES[i], into: distance - (cursor - STAGES[i].length) };
  }
  const last = STAGES.length - 1;
  return { index: last, stage: STAGES[last], into: STAGES[last].length };
}

export function difficultyOf(info) {
  const local = info.into / info.stage.length;
  return info.stage.farmer + local * 0.35 + info.index * 0.15;
}

export function totalLength() {
  return STAGES.reduce((sum, stage) => sum + stage.length, 0);
}
