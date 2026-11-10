import {useCallback,useEffect,useRef,useState} from 'react';
import type {AdventureSettings} from '../../objects/AdventureSettings';
import type {RunStart,WishResult} from '../../objects/Profile';
import type {WishReveal} from '../WishPage/objects/WishReveal';
import {createSave,starterCharacter,type LocalSave} from '../../game/local/LocalSave';
import {addSave,downloadSave,importSave,listSaves,loadSave,updateSave} from '../../game/local/saveStore';
import {equipWeapon,exchangeFate,levelUp,performWish,selectCharacter,settleTrial,startTrial,trialReward} from '../../game/local/progression';

export function useAdventure(){
 const [saves,setSaves]=useState<readonly LocalSave[]>([]);
 const [save,setSave]=useState<LocalSave|null>(null);
 const [loading,setLoading]=useState(true);
 const [saveError,setSaveError]=useState('');
 const [pending,setPending]=useState(false);
 const [notice,setNotice]=useState('');
 const [run,setRun]=useState<RunStart|null>(null);
 const [result,setResult]=useState<WishResult|null>(null);
 const [weaponResult,setWeaponResult]=useState<WishResult|null>(null);
 const [wishReveal,setWishReveal]=useState<WishReveal|null>(null);
 const [exitMessage,setExitMessage]=useState<string|null>(null);
 const busy=useRef(false);

 const reloadSaves=useCallback(async()=>{
  setLoading(true);
  setSaveError('');
  try{setSaves(await listSaves());}
  catch(error){setSaveError(error instanceof Error?error.message:'无法读取本地存档');}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void reloadSaves();},[reloadSaves]);

 async function perform(work:()=>Promise<void>){
  if(busy.current)return;
  busy.current=true;
  setPending(true);
  setNotice('');
  try{await work();}
  catch(error){setNotice(error instanceof Error?error.message:'无法完成本次操作');}
  finally{busy.current=false;setPending(false);}
 }

 const onOpen=(id:string)=>perform(async()=>setSave(await loadSave(id)));
 const onCreate=(nickname:string)=>perform(async()=>setSave(await addSave(createSave(nickname))));
 const onImport=(file:File)=>perform(async()=>setSave(await importSave(file)));
 const onExport=()=>perform(async()=>{if(save)downloadSave(await loadSave(save.id));});
 const onReturn=()=>{
  if(busy.current||run)return false;
  setSave(null);
  setResult(null);
  setWeaponResult(null);
  setWishReveal(null);
  setExitMessage(null);
  setNotice('');
  void reloadSaves();
  return true;
 };

 function changeProgress(change:(current:LocalSave)=>LocalSave,message?:string){
  return perform(async()=>{
   if(!save)return;
   setSave(await updateSave(save.id,change));
   if(message)setNotice(message);
  });
 }

 const onSelect=(id:string)=>changeProgress(current=>selectCharacter(current,id));
 const onLevel=()=>{if(save)return changeProgress(current=>({...current,profile:levelUp(current.profile,'character',save.selected)}),'角色已提升一级');};
 const onLevelWeapon=(id:string)=>changeProgress(current=>({...current,profile:levelUp(current.profile,'weapon',id)}),'武器已升级，词条已提升');
 const onEquipWeapon=(characterId:string,weaponId:string|null)=>changeProgress(
  current=>({...current,profile:equipWeapon(current.profile,characterId,weaponId)}),
  weaponId?'武器已装备，下次开局生效':'武器已卸下'
 );
 const onExchangeFates=()=>changeProgress(current=>({...current,profile:exchangeFate(current.profile)}),'已用原石兑换 1 个纠缠之缘');
 const onCheckIn=()=>changeProgress(current=>current.checkIns<7?{...current,checkIns:current.checkIns+1}:current);
 const onResetCheckIns=()=>changeProgress(current=>({...current,checkIns:0}));

 function wish(banner:'character'|'weapon'){
  if(wishReveal)return;
  return perform(async()=>{
   if(!save)return;
   let outcome!:WishResult;
   const next=await updateSave(save.id,current=>{
    outcome=performWish(current.profile,banner);
    return {...current,profile:outcome.profile};
   });
   setSave(next);
   if(banner==='character')setResult(outcome);
   else setWeaponResult(outcome);
   setWishReveal({...outcome.reward,duplicate:outcome.duplicate,sequence:crypto.randomUUID()});
  });
 }

 function begin(trial:Parameters<typeof startTrial>[1]){
  return perform(async()=>{
   if(!save||run)return;
   const current=await loadSave(save.id);
   const next=startTrial({...current,selected:save.selected},trial);
   setSave(current);
   setRun(next);
  });
 }
 const onStart=(settings:AdventureSettings)=>begin({kind:'adventure',settings});
 const onStartStage=(stageId:string)=>begin({kind:'stage',stageId});
 const onAbandon=()=>{
  if(busy.current||!run?.stage)return;
  setRun(null);
  window.location.hash='#/stages';
  setExitMessage('已放弃本次试炼，未发放奖励');
 };
 const onSettle=(kills:number,ticks:number,withdrawing=false)=>perform(async()=>{
  if(!save||!run)return;
  const next=await updateSave(save.id,current=>settleTrial(current,run,kills,ticks));
  const reward=trialReward(run,kills,ticks);
  const gains='摩拉 +'+reward.mora+'，原石 +'+reward.primogems;
  const message=run.stage
   ?kills===run.stage.enemies?'关卡通关！'+gains:'挑战失败，本次未获得通关奖励'
   :'本次冒险已结算：'+gains;
  setSave(next);
  setRun(null);
  window.location.hash=run.stage?'#/stages':'#/camp';
  if(withdrawing)setExitMessage(message);
  else setNotice(message);
 });

 return {
  save,saves,loading,saveError,reloadSaves,onOpen,onCreate,onImport,onExport,onReturn,
  selected:save?.selected??starterCharacter,onSelect,pending,notice,run,
  result,weaponResult,onLevel,onLevelWeapon,onEquipWeapon,onExchangeFates,onCheckIn,onResetCheckIns,
  onWish:()=>wish('character'),onWeaponWish:()=>wish('weapon'),wishReveal,closeWishReveal:()=>setWishReveal(null),
  onStart,onStartStage,onSettle,onAbandon,exitMessage,closeExitMessage:()=>setExitMessage(null)
 };
}
