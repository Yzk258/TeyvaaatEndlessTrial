import {useId} from 'react';
import type {Character} from '../../../objects/Character';
import type {BattleState} from '../../../game/objects/BattleState';
import {CHUNK_SIZE} from '../../../game/functions/generateMap';
import {MapTerrain} from './MapTerrain';
import {AttackVisuals,EnemyAttackVisuals} from './AttackVisuals';
import {EnemySpriteLibrary} from '../../../components/ui/EnemySprite';
import {EnemyPortrait} from './EnemyPortrait';
import {BattleCharacter} from './BattleCharacter';
import {HitEffects,PlayerHitEffects} from './HitEffects';
import {LootParticles} from './LootParticles';
export function BattleScene({state:s,character,bounded,reducedMotion}:{state:BattleState;character:Character;bounded:boolean;reducedMotion:boolean}){
 const cameraX=bounded?0:s.x-450,cameraY=bounded?0:s.y-270;
 const spritePrefix=useId();
 const motionClass=reducedMotion?undefined:'transition-transform duration-[50ms] ease-linear';
 const margin=96;
 const isVisible=({x,y}:{x:number;y:number})=>x>=cameraX-margin&&x<=cameraX+900+margin&&y>=cameraY-margin&&y<=cameraY+540+margin;
 const visibleEnemies=s.enemies.filter(isVisible);
 const hitsByEnemy=Object.fromEntries(s.hits.map(hit=>[hit.enemyId,hit]));
 return <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 540" aria-label="试炼战场">
  <defs><EnemySpriteLibrary prefix={spritePrefix}/><filter id="battle-hit-flash" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="0" intercept="1"/><feFuncG type="linear" slope="0" intercept="1"/><feFuncB type="linear" slope="0" intercept="1"/></feComponentTransfer></filter></defs>
  <g transform={'translate('+(-cameraX)+' '+(-cameraY)+')'} className={motionClass}>
   <MapTerrain seed={s.worldSeed} adventure={!bounded} chunkX={bounded?0:Math.floor(s.x/CHUNK_SIZE)} chunkY={bounded?0:Math.floor(s.y/CHUNK_SIZE)} includeRuins={s.terrainRuins} screenOnly/>
   <g aria-hidden="true" pointerEvents="none" transform={'translate('+s.x+' '+s.y+')'} className={motionClass}><circle r={s.attackRange} fill="none" stroke={character.color} strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="8 7"/></g>
   <AttackVisuals visual={character.attackVisual} projectiles={s.projectiles} effects={s.effects} cue={s.attackCue} tick={s.tick} reducedMotion={reducedMotion}/>
   {visibleEnemies.map(enemy=><EnemyPortrait key={enemy.id} enemy={enemy} tick={s.tick} hit={hitsByEnemy[enemy.id]} spritePrefix={spritePrefix} reducedMotion={reducedMotion}/>)}
   <EnemyAttackVisuals projectiles={(s.enemyProjectiles??[]).filter(isVisible)}/>
   <BattleCharacter state={s} character={character} reducedMotion={reducedMotion}/>
   <LootParticles particles={s.loot} x={s.x} y={s.y} reducedMotion={reducedMotion}/>
   <HitEffects hits={s.hits} color={character.attackVisual.color} reducedMotion={reducedMotion}/>
   <PlayerHitEffects hits={s.playerHits??[]} tick={s.tick} reducedMotion={reducedMotion}/>
  </g>
 </svg>;
}
