export type UpgradeChoice='power'|'heal'|'range'|'attackSpeed'|'moveSpeed'|'maxHp'|'extraAttack';
export const upgradeChoices:readonly UpgradeChoice[]=['power','heal','range','attackSpeed','moveSpeed','maxHp','extraAttack'];
export const upgradeTitles:Readonly<Record<UpgradeChoice,string>>={power:'锐意',heal:'复苏',range:'远见',attackSpeed:'疾攻',moveSpeed:'轻步',maxHp:'坚韧',extraAttack:'连击'};
