import { readFileSync } from 'node:fs';
const chars = JSON.parse(readFileSync('shared/characters.json', 'utf8'));
const appr = JSON.parse(readFileSync('shared/character-appearance.json', 'utf8'));
const ELEMENTS = ['cryo', 'anemo', 'pyro', 'electro', 'hydro', 'dendro', 'geo'];
const WEAPONS = ['claymore', 'sword', 'catalyst', 'bow', 'polearm'];
const STYLES = ['melee', 'ranged'];
const PATTERNS = ['projectile', 'meleeArc', 'area'];
const VISUALS = ['arrow', 'orb', 'slash', 'burst'];
const HEX = /^#[0-9a-fA-F]{6}$/;
const errs = [];
const ids = chars.map((c) => c.id);
if (new Set(ids).size !== ids.length) errs.push('角色 id 重复');
for (const c of chars) {
  if (!ELEMENTS.includes(c.element)) errs.push(c.id + ': element 非法 ' + c.element);
  if (!WEAPONS.includes(c.weapon)) errs.push(c.id + ': weapon 非法 ' + c.weapon);
  if (!STYLES.includes(c.attackStyle)) errs.push(c.id + ': attackStyle 非法');
  if (!PATTERNS.includes(c.attackPattern.kind)) errs.push(c.id + ': pattern 非法');
  if (!VISUALS.includes(c.attackVisual.style)) errs.push(c.id + ': visual 非法');
  if (!HEX.test(c.color)) errs.push(c.id + ': color 格式错 ' + c.color);
  if (!HEX.test(c.attackVisual.color)) errs.push(c.id + ': visual.color 格式错 ' + c.attackVisual.color);
  if (!(c.baseAttack > 0 && c.baseHp > 0 && c.attackGrowth >= 0 && c.hpGrowth >= 0 && c.attackRange > 0 && Number.isInteger(c.attackIntervalTicks) && c.attackIntervalTicks > 0 && c.maxLevel >= 1 && c.levelUpCost >= 0)) errs.push(c.id + ': 数值字段非法');
  if (c.attackPattern.kind === 'projectile') {
    if (!(c.attackPattern.speed > 0 && c.attackPattern.radius > 0 && Number.isInteger(c.attackPattern.pierce) && c.attackPattern.pierce >= 0)) errs.push(c.id + ': projectile 参数非法');
  } else if (c.attackPattern.kind === 'meleeArc') {
    if (!(c.attackPattern.angleDegrees > 0 && c.attackPattern.angleDegrees <= 360)) errs.push(c.id + ': meleeArc 角度非法');
  } else if (c.attackPattern.kind === 'area') {
    if (!(c.attackPattern.splashRadius > 0)) errs.push(c.id + ': area 半径非法');
  }
}
const aid = Object.keys(appr);
for (const c of chars) if (!appr[c.id]) errs.push(c.id + ': 缺外观');
for (const k of aid) if (!ids.includes(k)) errs.push(k + ': 外观无对应角色');
for (const [k, s] of Object.entries(appr)) {
  if (s.width !== 32 || s.height !== 44) errs.push(k + ': 尺寸非32x44');
  if (s.rows.length !== 44) errs.push(k + ': 行数' + s.rows.length);
  s.rows.forEach((r, i) => { if (r.length !== 32) errs.push(k + ' row' + i + ' 长度' + r.length); });
  for (const r of s.rows) for (const ch of r) if (ch !== '.' && !(ch in s.palette)) errs.push(k + ': 字符' + ch + '无调色');
}
console.log('角色数:', chars.length, ' 外观数:', aid.length);
console.log('元素分布:', ELEMENTS.map((e) => e + ':' + chars.filter((c) => c.element === e).length).join(' '));
console.log('武器分布:', WEAPONS.map((w) => w + ':' + chars.filter((c) => c.weapon === w).length).join(' '));
console.log('攻击模式:', PATTERNS.map((p) => p + ':' + chars.filter((c) => c.attackPattern.kind === p).length).join(' '));
if (errs.length) { console.log(errs.length + ' 个问题:'); errs.forEach((e) => console.log(' -', e)); process.exit(1); }
console.log('PASS: 角色配置与像素外观全部校验通过');
