import type {Element} from './Element';

export const hypostases={
 cryo:{name:'无相之冰',color:'#9deaff'},
 anemo:{name:'无相之风',color:'#66f2cf'},
 pyro:{name:'无相之火',color:'#ff8d63'},
 electro:{name:'无相之雷',color:'#d09bff'},
 hydro:{name:'无相之水',color:'#66b8ff'},
 dendro:{name:'无相之草',color:'#b6f475'},
 geo:{name:'无相之岩',color:'#ffd483'}
} as const satisfies Record<Element,{name:string;color:string}>;
