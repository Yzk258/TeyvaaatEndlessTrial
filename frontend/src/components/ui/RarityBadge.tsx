import type {Rarity} from '../../objects/Rarity';
const colors:Readonly<Record<Rarity,string>>={3:'text-sky-300',4:'text-violet-300',5:'text-amber-300'};
export function RarityBadge({rarity}:{rarity:Rarity}){
 return <span aria-label={rarity+'星'} className={'inline-block text-sm tracking-[.15em] '+colors[rarity]}>{'★'.repeat(rarity)}</span>;
}
