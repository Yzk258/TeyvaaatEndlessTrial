import {useCallback,useEffect,useState} from 'react';

export type PageId='overview'|'camp'|'characters'|'wishes'|'stages'|'weapons'|'archive'|'activities';
type NavigationPage={readonly id:PageId;readonly href:string;readonly label:string};
export type NavigationGroup={readonly id:'adventure';readonly label:string;readonly children:readonly NavigationPage[]};
const entries:readonly (NavigationPage|NavigationGroup)[]=[
  {id:'overview',href:'#/overview',label:'综合'},
  {id:'adventure',label:'冒险',children:[
    {id:'camp',href:'#/camp',label:'冒险营地'},
    {id:'stages',href:'#/stages',label:'关卡挑战'}
  ]},
  {id:'characters',href:'#/characters',label:'角色培养'},
  {id:'weapons',href:'#/weapons',label:'武器培养'},
  {id:'archive',href:'#/archive',label:'图鉴'},
  {id:'wishes',href:'#/wishes',label:'祈愿'},
  {id:'activities',href:'#/activities',label:'活动'}
];
const pages=entries.flatMap(entry=>'children' in entry?entry.children:[entry]);
function parsePage(hash:string):PageId {
  switch(hash){
    case '#/overview':return 'overview';
    case '#/camp':return 'camp';
    case '#/archive':return 'archive';
    case '#/activities':return 'activities';
    case '#/weapons':return 'weapons';
    case '#/stages':return 'stages';
    case '#/characters':return 'characters';
    case '#/wishes':return 'wishes';
    default:return 'overview';
  }
}
export function usePageNavigation(){
  const [current,setCurrent]=useState<PageId>(()=>parsePage(window.location.hash));
  useEffect(()=>{
    const update=()=>setCurrent(parsePage(window.location.hash));
    window.addEventListener('hashchange',update);
    return ()=>window.removeEventListener('hashchange',update);
  },[]);
  const replacePage=useCallback((page:PageId)=>{
    const href=pages.find(p=>p.id===page)!.href;
    if(window.location.hash!==href)window.history.replaceState(window.history.state,'',href);
    setCurrent(page);
  },[]);
  return {current,replacePage,entries,title:pages.find(p=>p.id===current)!.label};
}
