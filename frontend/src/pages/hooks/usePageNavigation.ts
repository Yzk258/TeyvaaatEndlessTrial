import type {UserRole} from '../../objects/CurrentUser';
import {useEffect,useState} from 'react';

type PageId='overview'|'camp'|'characters'|'wishes'|'stages'|'weapons'|'archive'|'activities'|'account'|'admin';
const pages:readonly {readonly id:PageId;readonly href:string;readonly label:string}[]=[
  {id:'overview',href:'#/overview',label:'综合'},
  {id:'camp',href:'#/camp',label:'冒险营地'},
  {id:'stages',href:'#/stages',label:'关卡挑战'},
  {id:'characters',href:'#/characters',label:'角色培养'},
  {id:'weapons',href:'#/weapons',label:'武器培养'},
  {id:'archive',href:'#/archive',label:'图鉴'},
  {id:'wishes',href:'#/wishes',label:'祈愿'},
  {id:'activities',href:'#/activities',label:'活动'},
  {id:'account',href:'#/account',label:'我的账号'},
  {id:'admin',href:'#/admin',label:'管理员中心'}
];
function parsePage(hash:string):PageId {
  switch(hash){
    case '#/overview':return 'overview';
    case '#/account':return 'account';
    case '#/admin':return 'admin';
    case '#/archive':return 'archive';
    case '#/activities':return 'activities';
    case '#/weapons':return 'weapons';
    case '#/stages':return 'stages';
    case '#/characters':return 'characters';
    case '#/wishes':return 'wishes';
    default:return 'camp';
  }
}
export function usePageNavigation(role:UserRole='user'){
  const [current,setCurrent]=useState<PageId>(()=>parsePage(window.location.hash));
  useEffect(()=>{
    const update=()=>setCurrent(parsePage(window.location.hash));
    window.addEventListener('hashchange',update);
    return ()=>window.removeEventListener('hashchange',update);
  },[]);
  return {current,pages:pages.filter(p=>p.id!=='admin'||role==='admin'),title:pages.find(p=>p.id===current)!.label};
}
