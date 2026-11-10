import type {AdventureSettings} from '../../objects/AdventureSettings';
import type {WishReveal} from '../WishPage/objects/WishReveal';
import {PerformWeaponWishMessage} from '../../apis/wishes/PerformWeaponWishMessage';
import {LevelUpWeaponMessage} from '../../apis/weapons/LevelUpWeaponMessage';
import {EquipWeaponMessage} from '../../apis/weapons/EquipWeaponMessage';
import {weapons,type WeaponWishResult} from '../../objects/Weapon';
import {useEffect,useState} from 'react';
import {characters,type CharacterId} from '../../objects/Character';
import type {Profile,RunStart,WishResult} from '../../objects/Profile';
import {GetCurrentUserMessage} from '../../apis/identity/GetCurrentUserMessage';
import {LoginMessage} from '../../apis/identity/LoginMessage';
import {RegisterMessage} from '../../apis/identity/RegisterMessage';
import {BindAccountMessage} from '../../apis/identity/BindAccountMessage';
import {LogoutMessage} from '../../apis/identity/LogoutMessage';
import type {CurrentUser,AuthSession} from '../../objects/CurrentUser';
import {APIError} from '../../system/api/APIError';
import {GetProfileMessage} from '../../apis/economy/GetProfileMessage';
import {ExchangeFatesMessage} from '../../apis/economy/ExchangeFatesMessage';
import {LevelUpCharacterMessage} from '../../apis/characters/LevelUpCharacterMessage';
import {PerformWishMessage} from '../../apis/wishes/PerformWishMessage';
import {StartRunMessage} from '../../apis/runs/StartRunMessage';
import {AbandonRunMessage} from '../../apis/runs/AbandonRunMessage';
import {SubmitRunResultMessage} from '../../apis/runs/SubmitRunResultMessage';
type PageState={readonly status:'unauthenticated';readonly message?:string}|{readonly status:'loading'}|{readonly status:'error';readonly message:string}|{readonly status:'ready';readonly profile:Profile};
const defaultCharacter:CharacterId='amber';
const selectionKey=(userId:string)=>'teyvat-selected-character:'+userId;

function restoreSelection(userId:string,profile:Profile):CharacterId{
 const saved=localStorage.getItem(selectionKey(userId));
 const owned=characters.filter(character=>profile.characters.some(entry=>entry.id===character.id));
 return owned.find(character=>character.id===saved)?.id
  ??owned.find(character=>character.id===defaultCharacter)?.id
  ??owned[0]?.id
  ??defaultCharacter;
}

export function useAdventure(){
 const [page,setPage]=useState<PageState>({status:'loading'}),[selected,setSelected]=useState<CharacterId>(defaultCharacter),[pending,setPending]=useState(false),[notice,setNotice]=useState(''),[run,setRun]=useState<RunStart|null>(null),[result,setResult]=useState<WishResult|null>(null);
 const [requests,setRequests]=useState<Readonly<Record<string,string>>>(()=>({wish:crypto.randomUUID(),weaponWish:crypto.randomUUID(),...Object.fromEntries(weapons.map(w=>['weapon:'+w.id,crypto.randomUUID()])),start:crypto.randomUUID(),...Object.fromEntries(characters.map(c=>['character:'+c.id,crypto.randomUUID()])),exchangeFates:crypto.randomUUID()}));
 const [wishReveal,setWishReveal]=useState<WishReveal|null>(null);
 const closeWishReveal=()=>setWishReveal(null);
 const renew=(key:string)=>setRequests(r=>({...r,[key]:crypto.randomUUID()}));
 const [authRevision,setAuthRevision]=useState(0);
 const [currentUser,setCurrentUser]=useState<CurrentUser|null>(null);
 const onSelect=(id:CharacterId)=>{
  if(!currentUser||page.status!=='ready'||!page.profile.characters.some(character=>character.id===id))return;
  setSelected(id);
  try {
   localStorage.setItem(selectionKey(currentUser.id),id);
  } catch {
   setNotice('出战角色已切换，但浏览器未能记住本次选择');
  }
 };
 const clearSession=()=>{localStorage.removeItem('teyvat-token');setCurrentUser(null);setRun(null);setResult(null);setWeaponResult(null);setWishReveal(null);setExitMessage(null);setNotice('');setPage({status:'unauthenticated'});setSelected(defaultCharacter);};
 const load=()=>{
  const token=localStorage.getItem('teyvat-token');
  if(!token){setCurrentUser(null);setSelected(defaultCharacter);setPage({status:'unauthenticated'});return Promise.resolve();}
  return Promise.all([new GetCurrentUserMessage().send(),new GetProfileMessage().send()]).then(([user,profile])=>{
   if(localStorage.getItem('teyvat-token')!==token)return;
   setSelected(restoreSelection(user.id,profile));
   setCurrentUser(user);
   setPage({status:'ready',profile});
  }).catch(error=>{
   if(localStorage.getItem('teyvat-token')!==token)return;
   if(error instanceof APIError&&error.status===401){clearSession();setPage({status:'unauthenticated',message:'登录已过期，请重新登录'});}
   else setPage({status:'error',message:'无法连接服务器，请确认后端和数据库已启动后重试'});
  });
 };
 useEffect(()=>{load();},[]);
 const perform=(op:()=>Promise<unknown>)=>{if(pending)return;setPending(true);setNotice('');op().catch(error=>{if(error instanceof APIError&&error.status===401){clearSession();setNotice('登录已过期，请重新登录');}else setNotice(error.message);}).finally(()=>setPending(false));};
 const acceptSession=(session:AuthSession,loginEvent=true)=>{if(loginEvent)setAuthRevision(v=>v+1);localStorage.setItem('teyvat-token',session.token);setCurrentUser(session.user);setRun(null);setResult(null);setWeaponResult(null);setWishReveal(null);setExitMessage(null);setPage({status:'loading'});return load();};
 const onLogin=(username:string,password:string)=>perform(()=>new LoginMessage(username,password).send().then(response=>{if(response.status!=='authenticated')throw new Error(response.message);return acceptSession(response.session);}));
 const onRegister=(username:string,password:string,nickname:string)=>perform(()=>new RegisterMessage(username,password,nickname).send().then(acceptSession));
 const onBind=(username:string,password:string,nickname:string)=>perform(()=>new BindAccountMessage(username,password,nickname).send().then(session=>acceptSession(session,false)));
 const onLogout=()=>perform(()=>new LogoutMessage().send().then(clearSession));
 const onLevel=()=>perform(()=>new LevelUpCharacterMessage(selected,requests['character:'+selected]).send().then(profile=>{setPage({status:'ready',profile});setNotice('角色已提升一级');renew('character:'+selected);}));
 const onWish=()=>{if(wishReveal)return;perform(()=>new PerformWishMessage(requests.wish).send().then(r=>{renew('wish');setWishReveal({...r.reward,duplicate:r.duplicate,sequence:requests.wish});setResult(r);setPage({status:'ready',profile:r.profile});}));};
 const onExchangeFates=()=>perform(()=>new ExchangeFatesMessage(1,requests.exchangeFates).send().then(profile=>{renew('exchangeFates');setPage({status:'ready',profile});setNotice('已用原石兑换 1 个纠缠之缘');}));
 const [weaponResult,setWeaponResult]=useState<WeaponWishResult|null>(null);
 const onWeaponWish=()=>{if(wishReveal)return;perform(()=>new PerformWeaponWishMessage(requests.weaponWish).send().then(r=>{renew('weaponWish');setWishReveal({...r.reward,duplicate:r.duplicate,sequence:requests.weaponWish});setWeaponResult(r);setPage({status:'ready',profile:r.profile});}));};
 const onLevelWeapon=(id:string)=>perform(()=>new LevelUpWeaponMessage(id,requests['weapon:'+id]).send().then(profile=>{renew('weapon:'+id);setPage({status:'ready',profile});setNotice('武器已升级，词条已提升');}));
 const onEquipWeapon=(characterId:string,weaponId:string|null)=>perform(()=>new EquipWeaponMessage(characterId,weaponId).send().then(profile=>{setPage({status:'ready',profile});setNotice(weaponId?'武器已装备，下次开局生效':'武器已卸下');}));
 const [exitMessage,setExitMessage]=useState<string|null>(null);
 const closeExitMessage=()=>setExitMessage(null);
 const [stageRequests,setStageRequests]=useState<Readonly<Record<string,string>>>({});
 const onStartStage=(id:string)=>perform(()=>{const requestId=stageRequests[id]??crypto.randomUUID();setStageRequests(r=>({...r,[id]:requestId}));return new StartRunMessage(selected,requestId,id).send().then(r=>{setStageRequests(keys=>({...keys,[id]:crypto.randomUUID()}));setRun(r);});});
 const [adventureRequests,setAdventureRequests]=useState<Readonly<Record<string,string>>>({});
 const onStart=(settings:AdventureSettings)=>perform(()=>{const key=selected+':'+JSON.stringify(settings),requestId=adventureRequests[key]??crypto.randomUUID();setAdventureRequests(r=>({...r,[key]:requestId}));return new StartRunMessage(selected,requestId,null,settings).send().then(r=>{setAdventureRequests(keys=>({...keys,[key]:crypto.randomUUID()}));setRun(r);});});
 const onAbandon=()=>perform(()=>run?new AbandonRunMessage(run.runId).send().then(profile=>{const destination=run.stage?'#/stages':'#/camp';setPage({status:'ready',profile});setRun(null);window.location.hash=destination;setExitMessage('已放弃本次试炼，未发放奖励');}):Promise.resolve());
 const onSettle=(kills:number,ticks:number,withdrawing=false)=>perform(()=>run?new SubmitRunResultMessage(run.runId,kills,ticks).send().then(profile=>{
  const previous=page.status==='ready'?page.profile:null;
  const message=run.stage?(kills===run.stage.enemies?'关卡通关！摩拉 +'+run.stage.mora+'，原石 +'+run.stage.primogems:'挑战失败，本次未获得通关奖励'):
   '本次冒险已结算：摩拉 +'+(profile.mora-(previous?.mora??profile.mora))+'，原石 +'+(profile.primogems-(previous?.primogems??profile.primogems));
  setPage({status:'ready',profile});setRun(null);window.location.hash=run.stage?'#/stages':'#/camp';
  if(withdrawing){setExitMessage(message);}else setNotice(message);
 }):Promise.resolve());
 return {authRevision,currentUser,onLogin,onRegister,onBind,onLogout,retry:load,wishReveal,closeWishReveal,weaponResult,onWeaponWish,onLevelWeapon,onEquipWeapon,exitMessage,closeExitMessage,page,selected,onSelect,pending,notice,run,result,onLevel,onWish,onStart,onStartStage,onSettle,onAbandon,onExchangeFates};
}
