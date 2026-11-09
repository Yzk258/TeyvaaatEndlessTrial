export type WishAnimationPhase='gathering'|'meteor'|'reveal';
export type WishAnimationAction={readonly kind:'advance'}|{readonly kind:'skip'};
export function wishAnimationPhase(phase:WishAnimationPhase,action:WishAnimationAction):WishAnimationPhase {
 if(action.kind==='skip')return 'reveal';
 switch(phase){
  case 'gathering':return 'meteor';
  case 'meteor':return 'reveal';
  case 'reveal':return 'reveal';
 }
}
