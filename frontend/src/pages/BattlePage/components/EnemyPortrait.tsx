import appearance from '../../../../../shared/enemy-appearance.json';
import {memo} from 'react';
import type {Enemy} from '../../../game/objects/BattleState';
import type {HitEffect} from '../../../game/objects/HitEffect';
import {enemyDefinitions} from '../../../game/objects/Enemy';
import {enemyWindupTicks} from '../../../game/functions/enemyAttacks';

const sprites=Object.entries(appearance.sprites).map(([kind,variant])=>{
 const sheet=appearance.sheets[variant.sheet];
 const width=sheet.width/sheet.columns,height=sheet.height/sheet.rows;
 const x=variant.cell%sheet.columns*width,y=Math.floor(variant.cell/sheet.columns)*height;
 return {id:kind,sheet,viewBox:[x,y,width,height].join(' ')};
});
export const EnemySpriteLibrary=memo(function EnemySpriteLibrary({prefix}:{prefix:string}){
 return <>{sprites.map(({id,sheet,viewBox})=><symbol key={id} id={prefix+'-'+id}
  viewBox={viewBox} overflow="hidden"><image href={sheet.src} width={sheet.width} height={sheet.height} imageRendering="pixelated"/></symbol>)}</>;
});
export function EnemyPortrait({enemy,tick,hit,spritePrefix,reducedMotion=false}:{enemy:Enemy;tick:number;hit?:HitEffect;spritePrefix:string;reducedMotion?:boolean}){
 const {name,size}=appearance.sprites[enemy.kind];
 const {attack}=enemyDefinitions[enemy.kind];
 const age=enemy.attackCue?tick-enemy.attackCue.tick:Infinity;
 const winding=age<0&&age>=-enemyWindupTicks;
 const striking=age>=0&&age<6;
 const phase=winding?'windup':striking?'strike':undefined;
 const angle=enemy.attackCue?.angle??0;
 const charge=winding?(enemyWindupTicks+age+1)/enemyWindupTicks:0;
 const impact=striking?1-age/6:0;
 const heavy=enemy.kind==='boss'||enemy.kind==='elite';
 const shift=attack.kind==='ranged'?-3*charge-5*impact:-4*charge+(heavy?11:7)*impact;
 const tilt=Math.cos(angle)*(attack.kind==='ranged'?-5*impact:8*impact-5*charge);
 const squash=enemy.kind==='slime'?0.13*(charge-impact):0.045*charge;
 const attackTransform=phase&&!reducedMotion?
  'translate('+Math.cos(angle)*shift+' '+Math.sin(angle)*shift+') rotate('+tilt+') scale('+(1+squash)+' '+(1-squash)+')':undefined;
 const bob=enemy.kind==='slime'&&!reducedMotion?Math.floor(Math.sin((tick+enemy.id)/4)*2):0;
 const kick=hit&&!reducedMotion?Math.sin((10-hit.life)*Math.PI/6)*Math.max(0,hit.life-4)/2:0;
 const elite=enemy.kind==='elite';
 const reach=attack.kind==='contact'?attack.reach:size*.44;
 const color=enemy.kind==='slime'?'#9ceaf7':attack.kind==='ranged'&&attack.projectile==='fireball'?'#ff9661':'#ffc775';
 return <g role="img" aria-label={elite?'精英 '+name:name} data-enemy-attack={phase} transform={'translate('+enemy.x+' '+enemy.y+')'}
  className={reducedMotion?undefined:'transition-transform duration-[50ms] ease-linear'}>
  <ellipse cy={size*.35} rx={size*.33} ry="4" fill="#10241f" opacity=".3"/>
  <use href={'#'+spritePrefix+'-'+enemy.kind} x={-size/2+Math.cos(hit?.angle??0)*kick}
   y={-size*.6+bob+Math.sin(hit?.angle??0)*kick} width={size} height={size} transform={attackTransform}
   filter={hit&&hit.life>=8?'url(#battle-hit-flash)':undefined}/>
  {phase&&<g aria-hidden="true" pointerEvents="none" transform={'rotate('+(angle*180/Math.PI)+')'} opacity={winding?.45+.35*charge:impact}>
   {winding?<path d={'M '+(reach-5)+' 0 L '+reach+' -5 '+(reach+5)+' 0 '+reach+' 5 Z'} fill="none" stroke={color} strokeWidth="2"/>
    :attack.kind==='contact'?<path d={'M '+(reach*.54)+' '+(-reach*.61)+' Q '+(reach*1.14)+' '+(-reach*.25)+' '+(reach*.72)+' '+(reach*.58)}
      fill="none" stroke={color} strokeWidth={heavy?5:3} strokeLinecap="round"/>
    :<path d={'M '+(reach-7)+' 0 H '+(reach+7)+' M '+reach+' -7 V 7 M '+(reach-4)+' -4 l 8 8'} fill="none" stroke={color} strokeWidth="2"/>}
  </g>}
  {elite&&<text y={-size*.6-5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffd77d" stroke="#38281a" strokeWidth="3" paintOrder="stroke">精英</text>}
 </g>;
}
