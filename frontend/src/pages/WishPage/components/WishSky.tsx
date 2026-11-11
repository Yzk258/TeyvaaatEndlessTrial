import type {Rarity} from '../../../objects/Rarity';
import {wishMeteorStagger,type WishAnimationPhase} from '../functions/wishAnimationPhase';
const rarityColors:Readonly<Record<Rarity,string>>={3:'#60a5fa',4:'#a78bfa',5:'#fbbf24'};
const meteorRarities=[3,4,5] as const;

function WishMeteors({rarities}:{rarities:readonly Rarity[]}){
 return <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
  <defs>{meteorRarities.map(rarity=><linearGradient key={rarity} id={'wish-tail-'+rarity} x1="0" y1="0" x2="1" y2="1">
   <stop stopColor="#9bafff" stopOpacity="0"/>
   <stop offset=".65" stopColor={rarityColors[rarity]} stopOpacity=".75"/>
   <stop offset="1" stopColor={rarityColors[rarity]}/>
  </linearGradient>)}</defs>
  {rarities.map((rarity,index)=>{
   const row=Math.floor(index/5),column=index%5-2;
   const position=rarities.length===1?undefined:'translate('+(column*78-row*48)+' '+(row*88-column*38-32)+')';
   const size=rarities.length===1||rarity===5?1:rarity===4?.83:.68;
   return <g key={index} transform={position}>
    <g className="animate-wish-meteor motion-reduce:animate-none" style={{animationDelay:index*wishMeteorStagger+'ms'}}>
     <g transform={'scale('+size+')'}>
      <path d="M -300 -200 L 0 0" stroke={'url(#wish-tail-'+rarity+')'} strokeWidth="10" strokeLinecap="round"/>
      <path d="M -200 -132 L 0 0" stroke="#dce2ff" strokeOpacity=".7" strokeWidth="3"/>
      <circle r="17" fill={rarityColors[rarity]} opacity=".32"/>
      <circle r="7" fill="#fff4dc"/>
      <path d="M -15 0 H 15 M 0 -15 V 15" stroke="#fff3d9" strokeWidth="2"/>
     </g>
    </g>
   </g>;
  })}
 </svg>;
}

export function WishSky({phase,rarities}:{phase:WishAnimationPhase;rarities:readonly Rarity[]}){
 const rarity=rarities.includes(5)?5:rarities.includes(4)?4:3;
 return <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
  <div className="absolute inset-0 bg-radial-[at_50%_40%] from-indigo-400/15 via-[#121b35] to-[#080f20]"/>
  <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full"><defs><radialGradient id="wish-nebula"><stop stopColor="#a9baf8" stopOpacity=".25"/><stop offset="1" stopColor="#5961b5" stopOpacity="0"/></radialGradient></defs><ellipse cx="600" cy="340" rx="450" ry="260" fill="url(#wish-nebula)"/>{Array.from({length:70},(_,i)=><g key={i} opacity={.25+(i%5)*.12}><circle cx={(i*173+53)%1200} cy={(i*97+31)%800} r={i%7===0?1.8:1} fill="#e5e5fc"/>{i%9===0&&<path d={'M '+((i*173+53)%1200-5)+' '+((i*97+31)%800)+' h 10 m -5 -5 v 10'} stroke="#d5d7f1" strokeWidth=".6"/>}</g>)}<g fill="none" stroke="#c4b8ef" strokeOpacity=".08"><circle cx="600" cy="340" r="140"/><circle cx="600" cy="340" r="210"/><ellipse cx="600" cy="340" rx="330" ry="95" transform="rotate(-20 600 340)"/></g></svg>
  {phase==='gathering'&&<div className="absolute inset-0 grid place-content-center"><div className="animate-wish-gather text-[120px] leading-none text-amber-50 motion-reduce:animate-none">✦</div></div>}
  {phase==='meteor'&&<WishMeteors rarities={rarities}/>}
  {phase==='reveal'&&<div className="absolute inset-0 grid place-content-center"><div className={'h-[500px] w-[500px] rounded-full bg-radial via-indigo-300/5 to-transparent '+(rarity===5?'from-amber-300/20':rarity===4?'from-violet-300/20':'from-sky-300/20')}/></div>}
 </div>;
}
