import type {BattleState} from '../../../game/objects/BattleState';
import type {UpgradeChoice} from '../../../game/objects/UpgradeChoice';
import {applyUpgradeStats} from '../../../game/functions/battleUpgrades';
export function upgradePreview(state:BattleState,choice:UpgradeChoice):string {
 const next=applyUpgradeStats(state,choice);
 switch(choice){
  case 'power':return '攻击力 '+state.power+' → '+next.power;
  case 'heal':return '生命 '+state.hp+' → '+next.hp+' / '+next.maxHp;
  case 'range':return '攻击范围 '+state.attackRange+' → '+next.attackRange+(state.attackPattern.kind==='area'?'，范围伤害半径同步扩大':'');
  case 'attackSpeed':return '攻击间隔 '+(state.attackIntervalTicks/20).toFixed(2)+'秒 → '+(next.attackIntervalTicks/20).toFixed(2)+'秒';
  case 'moveSpeed':return '移动速度 '+state.moveSpeed+' → '+next.moveSpeed;
  case 'maxHp':return '生命上限 '+state.maxHp+' → '+next.maxHp+'，同时恢复25生命';
  case 'extraAttack':return '每轮攻击 '+(state.extraAttacks+1)+'次 → '+(next.extraAttacks+1)+'次，追加攻击间隔0.15秒';
 }
}
