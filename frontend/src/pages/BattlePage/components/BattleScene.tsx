import type {Character} from '../../../objects/Character';
import type {BattleState} from '../../../game/objects/BattleState';
import {CHUNK_SIZE} from '../../../game/functions/generateMap';
import {MapTerrain} from './MapTerrain';
import {AttackVisuals} from './AttackVisuals';
import {EnemyPortrait} from './EnemyPortrait';
import {BattleCharacter} from './BattleCharacter';
import {HitEffects} from './HitEffects';
import {LootParticles} from './LootParticles';
export function BattleScene({state:s,character,bounded,reducedMotion}:{state:BattleState;character:Character;bounded:boolean;reducedMotion:boolean}){
 const cameraX=bounded?0:s.x-450,cameraY=bounded?0:s.y-270;
 const hitsByEnemy=Object.fromEntries(s.hits.map(hit=>[hit.enemyId,hit]));
 return <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 540" aria-label="试炼战场">
  <defs><filter id="battle-hit-flash" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="0" intercept="1"/><feFuncG type="linear" slope="0" intercept="1"/><feFuncB type="linear" slope="0" intercept="1"/></feComponentTransfer></filter></defs>
  <g transform={'translate('+(-cameraX)+' '+(-cameraY)+')'}>
   <MapTerrain seed={s.worldSeed} adventure={!bounded} chunkX={bounded?0:Math.floor(s.x/CHUNK_SIZE)} chunkY={bounded?0:Math.floor(s.y/CHUNK_SIZE)}/>
   <g aria-hidden="true" pointerEvents="none"><circle cx={s.x} cy={s.y} r={s.attackRange} fill="none" stroke={character.color} strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="8 7"/></g>
   <AttackVisuals visual={character.attackVisual} projectiles={s.projectiles} effects={s.effects} cue={s.attackCue} tick={s.tick} reducedMotion={reducedMotion}/>
   {s.enemies.map(enemy=><EnemyPortrait key={enemy.id} enemy={enemy} tick={s.tick} hit={hitsByEnemy[enemy.id]} reducedMotion={reducedMotion}/>)}
   <BattleCharacter state={s} character={character} reducedMotion={reducedMotion}/>
   <LootParticles particles={s.loot} x={s.x} y={s.y} reducedMotion={reducedMotion}/>
   <HitEffects hits={s.hits} color={character.attackVisual.color} reducedMotion={reducedMotion}/>
  </g>
 </svg>;
}
