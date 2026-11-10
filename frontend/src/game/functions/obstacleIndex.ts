import type {WorldBounds,WorldObstacle} from '../objects/WorldObstacle';

type ObstacleNode={readonly bounds:WorldBounds}&(
 {readonly kind:'leaf';readonly items:readonly WorldObstacle[]}|
 {readonly kind:'branch';readonly left:ObstacleNode;readonly right:ObstacleNode}
);
export type ObstacleIndex={
 readonly source:readonly WorldObstacle[];
 readonly root:ObstacleNode|undefined;
};
export type CollisionTerrain=readonly WorldObstacle[]|ObstacleIndex;

function mergeBounds(a:WorldBounds,b:WorldBounds):WorldBounds{
 return {minX:Math.min(a.minX,b.minX),minY:Math.min(a.minY,b.minY),
  maxX:Math.max(a.maxX,b.maxX),maxY:Math.max(a.maxY,b.maxY)};
}
function obstacleBounds(o:WorldObstacle):WorldBounds{
 return {minX:o.x-o.radius,minY:o.y-o.radius,maxX:o.x+o.radius,maxY:o.y+o.radius};
}
function buildNode(items:readonly WorldObstacle[]):ObstacleNode{
 if(items.length<=12){
  const bounds=items.slice(1).reduce((box,o)=>mergeBounds(box,obstacleBounds(o)),obstacleBounds(items[0]));
  return {kind:'leaf',bounds,items};
 }
 const middle=Math.floor(items.length/2);
 const left=buildNode(items.slice(0,middle)),right=buildNode(items.slice(middle));
 return {kind:'branch',bounds:mergeBounds(left.bounds,right.bounds),left,right};
}
function searchNode(node:ObstacleNode,bounds:WorldBounds):readonly WorldObstacle[]{
 const box=node.bounds;
 if(box.maxX<bounds.minX||box.minX>bounds.maxX||box.maxY<bounds.minY||box.minY>bounds.maxY)return [];
 if(node.kind==='leaf')return node.items;
 const left=searchNode(node.left,bounds),right=searchNode(node.right,bounds);
 return left.length===0?right:right.length===0?left:[...left,...right];
}
export function indexObstacles(source:readonly WorldObstacle[]):ObstacleIndex{
 // The generator already groups obstacles by chunk. Keep that order for equal-distance hits.
 return {source,root:source.length>0?buildNode(source):undefined};
}
export function obstaclesAlong(terrain:CollisionTerrain,x:number,y:number,endX:number,endY:number,padding:number):readonly WorldObstacle[]{
 if(!('source' in terrain))return terrain;
 return terrain.root?searchNode(terrain.root,{minX:Math.min(x,endX)-padding,minY:Math.min(y,endY)-padding,
  maxX:Math.max(x,endX)+padding,maxY:Math.max(y,endY)+padding}):[];
}
