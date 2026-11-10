export type Stage={readonly id:string;readonly title:string;readonly enemies:number;readonly mora:number;readonly primogems:number};

export const stages:readonly Stage[]=[
 {id:'forest',title:'低语森林 · 初探',enemies:15,mora:300,primogems:40},
 {id:'valley',title:'风起山谷 · 清剿',enemies:30,mora:600,primogems:80},
 {id:'ruins',title:'遗迹边境 · 突围',enemies:50,mora:1000,primogems:120}
];
