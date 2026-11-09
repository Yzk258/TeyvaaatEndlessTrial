import {allCharacterFilters,regionLabels,type CharacterFilter} from '../../objects/CharacterFilter';
import {elementLabels} from '../../objects/Element';

const selectClass='rounded-xl border border-white/15 bg-[#182a31] px-4 py-2.5 text-sm';

export function CharacterFilterControls({value,onChange}:{value:CharacterFilter;onChange:(filter:CharacterFilter)=>void}){
 return <div className="flex flex-wrap items-center gap-3" aria-label="角色筛选">
  <select aria-label="国家或地区" className={selectClass} value={value.region}
   onChange={event=>onChange({...value,region:event.target.value as CharacterFilter['region']})}>
   <option value="all">全部地区</option>
   {Object.entries(regionLabels).map(([id,label])=><option key={id} value={id}>{label}</option>)}
  </select>
  <select aria-label="元素属性" className={selectClass} value={value.element}
   onChange={event=>onChange({...value,element:event.target.value as CharacterFilter['element']})}>
   <option value="all">全部元素</option>
   {Object.entries(elementLabels).map(([id,label])=><option key={id} value={id}>{label}</option>)}
  </select>
  {(value.region!=='all'||value.element!=='all')&&<button type="button" className="text-sm text-amber-100"
   onClick={()=>onChange(allCharacterFilters)}>清除筛选</button>}
 </div>;
}
