// Cranberry Hollow entry packer. Node's standard library only.
// Copies game/ and screenshots/ next to this file into MAKEFUN_OUTPUT_DIR
// (or /output) and writes dossier.json with the vendored make.fun helper.
// The same tree always produces the same dossier bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(destination, { recursive: true });
cpSync(join(root, 'game'), join(destination, 'game'), { recursive: true });

const shotsOut = join(destination, 'screenshots');
mkdirSync(shotsOut, { recursive: true });
const shotsIn = join(root, 'screenshots');
if (existsSync(shotsIn)) {
  cpSync(shotsIn, shotsOut, { recursive: true });
}

const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

writeFileSync(join(destination, 'dossier.json'), buildDossier(destination, caps));
