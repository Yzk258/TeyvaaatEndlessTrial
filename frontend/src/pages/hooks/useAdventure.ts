import {useCallback,useEffect,useRef,useState} from 'react';
import type {AdventureSettings} from '../../objects/AdventureSettings';
import type {RunStart} from '../../objects/Profile';
import type {ArtifactSlot} from '../../objects/Artifact';
import {equipArtifact,levelUpArtifact} from '../../game/local/artifactProgression';
import {rewardCurrencyLabels} from '../../objects/TrialReward';
import type {WishBanner,WishCount,WishPulls} from '../../objects/WishReward';
import type {WishReveal} from '../WishPage/objects/WishReveal';
import {createSave,starterCharacter,type LocalSave} from '../../game/local/LocalSave';
import {addSave,downloadSave,importSave,listSaves,loadSave,updateSave} from '../../game/local/saveStore';
import {equipWeapon,levelUp,requestWishes,selectCharacter,setCharacterFavorite,settleTrial,startTrial,trialRewards} from '../../game/local/progression';

type WishExchange={banner:WishBanner;count:WishCount;missingFates:number;primogemCost:number};
type Notice={readonly text:string;readonly kind:'status'|'error'|'opening'};

export function useAdventure(){
 const [saves,setSaves]=useState<readonly LocalSave[]>([]);
 const [save,setSave]=useState<LocalSave|null>(null);
 const [loading,setLoading]=useState(true);
 const [saveError,setSaveError]=useState('');
 const [pending,setPending]=useState(false);
 const [notice,setNotice]=useState<Notice|null>(null);
 const [run,setRun]=useState<RunStart|null>(null);
 const [result,setResult]=useState<WishPulls|null>(null);
 const [weaponResult,setWeaponResult]=useState<WishPulls|null>(null);
 const [wishReveal,setWishReveal]=useState<WishReveal|null>(null);
 const [wishExchange,setWishExchange]=useState<WishExchange|null>(null);
 const [exitMessage,setExitMessage]=useState<string|null>(null);
 const busy=useRef(false);

 useEffect(()=>{
  if(!notice||notice.kind==='opening')return;
  const timer=window.setTimeout(()=>setNotice(current=>current===notice?null:current),notice.kind==='error'?5000:3000);
  return ()=>window.clearTimeout(timer);
 },[notice]);

 const reloadSaves=useCallback(async()=>{
  setLoading(true);
  setSaveError('');
  try{setSaves(await listSaves());}
  catch(error){setSaveError(error instanceof Error?error.message:'无法读取本地存档');}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{void reloadSaves();},[reloadSaves]);

 async function perform(work:()=>Promise<void>,errorKind:'error'|'opening'='error'){
  if(busy.current)return;
  busy.current=true;
  setPending(true);
  setNotice(null);
  try{await work();}
  catch(error){setNotice({text:error instanceof Error?error.message:'无法完成本次操作',kind:errorKind});}
  finally{busy.current=false;setPending(false);}
 }

 const onOpen=(id:string)=>perform(async()=>setSave(await loadSave(id)),'opening');
 const onCreate=(nickname:string)=>perform(async()=>setSave(await addSave(createSave(nickname))),'opening');
 const onImport=(file:File)=>perform(async()=>setSave(await importSave(file)),'opening');
 const onExport=()=>perform(async()=>{if(save)downloadSave(await loadSave(save.id));});
 const onReturn=()=>{
  if(busy.current||run)return false;
  setSave(null);
  setResult(null);
  setWeaponResult(null);
  setWishReveal(null);
  setWishExchange(null);
  setExitMessage(null);
  setNotice(null);
  void reloadSaves();
  return true;
 };

 function changeProgress(change:(current:LocalSave)=>LocalSave,success?:string){
  return perform(async()=>{
   if(!save)return;
   setSave(await updateSave(save.id,change));
   if(success)setNotice({text:success,kind:'status'});
  });
 }

 const onSelect=(id:string)=>changeProgress(current=>selectCharacter(current,id));
 const onFavorite=(id:string,favorite:boolean)=>changeProgress(current=>setCharacterFavorite(current,id,favorite));
 const onLevel=()=>{if(save)return changeProgress(current=>({...current,profile:levelUp(current.profile,'character',save.selected)}),'角色已提升一级');};
 const onLevelWeapon=(weaponInstanceId:string)=>changeProgress(current=>({...current,profile:levelUp(current.profile,'weapon',weaponInstanceId)}),'武器已升级，词条已提升');
 const onLevelArtifact=(id:string)=>changeProgress(current=>({...current,profile:levelUpArtifact(current.profile,id)}),'圣遗物已强化');
 const onEquipArtifact=(characterId:string,slot:ArtifactSlot,id:string|null)=>changeProgress(
  current=>({...current,profile:equipArtifact(current.profile,characterId,slot,id)}),id?'圣遗物已装备':'圣遗物已卸下');
 const onEquipWeapon=(characterId:string,weaponInstanceId:string|null)=>changeProgress(
  current=>({...current,profile:equipWeapon(current.profile,characterId,weaponInstanceId)}),
  weaponInstanceId?'武器已装备，下次开局生效':'武器已卸下'
 );
 const onCheckIn=()=>changeProgress(current=>current.checkIns<7?{...current,checkIns:current.checkIns+1}:current);
 const onResetCheckIns=()=>changeProgress(current=>({...current,checkIns:0}));

 function onWish(banner:WishBanner,count:WishCount,approvedCost=0){
  if(wishReveal)return;
  return perform(async()=>{
   if(!save)return;
   setWishExchange(null);
   let outcome!:ReturnType<typeof requestWishes>;
   const next=await updateSave(save.id,current=>{
    outcome=requestWishes(current.profile,banner,count,approvedCost);
    return outcome.kind==='drawn'?{...current,profile:outcome.profile}:current;
   });
   setSave(next);
   if(outcome.kind==='exchange'){
    setWishExchange({banner,count,missingFates:outcome.missingFates,primogemCost:outcome.primogemCost});
    return;
   }
   const {pulls}=outcome;
   if(banner==='character')setResult(pulls);
   else setWeaponResult(pulls);
   setWishReveal({pulls,sequence:crypto.randomUUID()});
  });
 }
 const confirmWishExchange=()=>{
  if(wishExchange)void onWish(wishExchange.banner,wishExchange.count,wishExchange.primogemCost);
 };

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
 const onSettle=(kills:number,ticks:number,withdrawing=false,artifactDrops:readonly string[]=[])=>perform(async()=>{
  if(!save||!run)return;
  const next=await updateSave(save.id,current=>settleTrial(current,run,kills,ticks,artifactDrops));
  const gains=trialRewards(run,kills,ticks).map(reward=>`${rewardCurrencyLabels[reward.currency]} +${reward.amount}`).join('，');
  const message=run.stage
   ?kills===run.stage.enemies?'关卡通关！'+gains:'挑战失败，本次未获得通关奖励'
   :'本次冒险已结算：'+gains+(artifactDrops.length?`，圣遗物 +${artifactDrops.length}`:'');
  setSave(next);
  setRun(null);
  window.location.hash=run.stage?'#/stages':'#/camp';
  if(withdrawing)setExitMessage(message);
  else setNotice({text:message,kind:'status'});
 });

 return {
  save,saves,loading,saveError,reloadSaves,onOpen,onCreate,onImport,onExport,onReturn,
  selected:save?.selected??starterCharacter,onSelect,onFavorite,pending,run,
  openingNotice:notice?.kind==='opening'?notice.text:'',toast:notice?.kind==='opening'?null:notice,
  result,weaponResult,onLevel,onLevelWeapon,onEquipWeapon,onLevelArtifact,onEquipArtifact,onCheckIn,onResetCheckIns,
  onWish,wishReveal,closeWishReveal:()=>setWishReveal(null),wishExchange,confirmWishExchange,cancelWishExchange:()=>setWishExchange(null),
  onStart,onStartStage,onSettle,onAbandon,exitMessage,closeExitMessage:()=>setExitMessage(null)
 };
}
