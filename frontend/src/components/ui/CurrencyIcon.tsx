export function CurrencyIcon({kind,size=14,className}:{kind:'primogem'|'mora'|'fate';size?:number;className?:string}){
  const src = kind==='mora'?'/currency/mora.png':kind==='primogem'?'/currency/primogem.png':'/currency/fate.png';
  return <img src={src} width={size} height={size} alt="" className={className} style={{imageRendering:'pixelated'}}/>;
}
