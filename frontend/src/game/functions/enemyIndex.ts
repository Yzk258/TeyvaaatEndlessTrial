import {enemyDefinitions,type Enemy} from '../objects/Enemy';

const cellSize=128;
type EnemyIndex={readonly cells:ReadonlyMap<string,readonly number[]>;readonly maxRadius:number};

export function indexEnemies(enemies:readonly Enemy[]):EnemyIndex {
 const cells=new Map<string,number[]>();
 let maxRadius=0;
 enemies.forEach((enemy,index)=>{
  if(enemy.hp<=0)return;
  const key=Math.floor(enemy.x/cellSize)+':'+Math.floor(enemy.y/cellSize);
  const cell=cells.get(key);
  if(cell)cell.push(index);
  else cells.set(key,[index]);
  maxRadius=Math.max(maxRadius,enemyDefinitions[enemy.kind].radius);
 });
 return {cells,maxRadius};
}

export function enemiesAlong(index:EnemyIndex,x:number,y:number,endX:number,endY:number,radius:number):readonly number[] {
 const padding=radius+index.maxRadius;
 const minX=Math.floor((Math.min(x,endX)-padding)/cellSize);
 const maxX=Math.floor((Math.max(x,endX)+padding)/cellSize);
 const minY=Math.floor((Math.min(y,endY)-padding)/cellSize);
 const maxY=Math.floor((Math.max(y,endY)+padding)/cellSize);
 const candidates:number[]=[];
 for(let cellY=minY;cellY<=maxY;cellY++){
  for(let cellX=minX;cellX<=maxX;cellX++){
   const cell=index.cells.get(cellX+':'+cellY);
   if(cell)candidates.push(...cell);
  }
 }
 return candidates;
}
