import { copyFile, cp, mkdir } from 'node:fs/promises';

const site = new URL('./', import.meta.url);
const output = new URL('dist/', site);
const files = {
  'index.html': 'index.html',
  'style.css': 'style.css',
  'gallery.js': 'gallery.js',
  'mark.svg': 'mark.svg',
  'assets/sky-gate.png': '../frontend/public/backgrounds/sky-gate-pixel-v2.png',
  'assets/hu-tao.png': '../frontend/public/characters/pixel/hu-tao-battle-chibi.png',
};

await mkdir(new URL('assets/', output), { recursive: true });
await Promise.all([
  cp(new URL('../frontend/dist/', site), new URL('game/', output), {recursive:true}),
  cp(new URL('previews/', site), new URL('previews/', output), {recursive:true}),
  ...Object.entries(files).map(([target, source]) =>
    copyFile(new URL(source, site), new URL(target, output)),
  ),
]);
console.log('宣传页与单机游戏已生成到 site/dist/');
