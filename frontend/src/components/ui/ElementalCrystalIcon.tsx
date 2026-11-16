import type {Element} from '../../objects/Element';
import type {CrystalRarity,ElementalCrystal} from '../../objects/ElementalCrystal';

const colors:Record<Element,string>={
 cryo:'#8cdff4',anemo:'#68dfc3',pyro:'#f78267',electro:'#c093fa',hydro:'#6caaff',dendro:'#9bd66c',geo:'#efb758'
};
const shapes:Record<CrystalRarity,string>={
 1:'polygon(20% 50%,35% 50%,35% 25%,65% 25%,65% 40%,80% 40%,80% 65%,65% 65%,65% 80%,35% 80%,35% 70%,20% 70%)',
 2:'polygon(15% 45%,30% 45%,30% 25%,65% 25%,65% 35%,85% 35%,85% 65%,70% 65%,70% 80%,35% 80%,35% 70%,15% 70%)',
 3:'polygon(10% 40%,25% 40%,25% 25%,40% 25%,40% 10%,65% 10%,65% 20%,80% 20%,80% 35%,90% 35%,90% 65%,75% 65%,75% 80%,55% 80%,55% 90%,30% 90%,30% 75%,10% 75%)',
 4:'polygon(5% 50%,20% 50%,20% 30%,35% 30%,35% 15%,45% 15%,45% 5%,65% 5%,65% 15%,75% 15%,75% 40%,95% 40%,95% 70%,75% 70%,75% 90%,55% 90%,55% 95%,25% 95%,25% 80%,5% 80%)',
 5:'polygon(5% 35%,20% 35%,20% 20%,35% 20%,35% 10%,45% 10%,45% 0,60% 0,60% 10%,75% 10%,75% 25%,90% 25%,90% 40%,100% 40%,100% 65%,85% 65%,85% 80%,70% 80%,70% 90%,55% 90%,55% 100%,40% 100%,40% 90%,25% 90%,25% 75%,10% 75%,10% 60%,0 60%,0 45%,5% 45%)'
};

export function ElementalCrystalIcon({crystal,size=32}:{crystal:ElementalCrystal;size?:number}){
 return <span aria-hidden="true" className="relative inline-block shrink-0"
  style={{width:size,height:size,color:colors[crystal.element]}}>
  <span className="absolute inset-0 bg-current" style={{clipPath:shapes[crystal.rarity]}}>
   <span className="absolute inset-0 bg-white/45" style={{clipPath:'polygon(0 0,80% 0,50% 38%,30% 60%,0 68%)'}}/>
   <span className="absolute inset-0 bg-[#10233a]/55" style={{clipPath:'polygon(100% 0,100% 100%,0 100%,0 85%,48% 62%,70% 40%)'}}/>
   <span className="absolute left-[39%] top-[32%] h-[12%] w-[17%] bg-white/75"/>
  </span>
 </span>;
}
