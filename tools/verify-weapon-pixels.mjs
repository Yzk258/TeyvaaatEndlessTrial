import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
const appearances=JSON.parse(fs.readFileSync(new URL('../shared/weapon-appearance.json',import.meta.url),'utf8'));
const chunks=(png,offset=8,parts=[])=>{
 if(offset>=png.length)return parts;
 const length=png.readUInt32BE(offset),kind=png.subarray(offset+4,offset+8).toString();
 return chunks(png,offset+length+12,kind==='IDAT'?[...parts,png.subarray(offset+8,offset+8+length)]:parts);
};
Object.values(appearances).forEach(art=>{
 const path=new URL('../frontend/public'+art.src,import.meta.url);
 const png=fs.readFileSync(path);
 assert.equal(png.subarray(1,4).toString(),'PNG',art.name);
 assert.equal(png[24],8,art.name+'位深');
 assert.equal(png[25],6,art.name+'必须包含透明通道');
 const pixels=zlib.inflateSync(Buffer.concat(chunks(png)));
 assert.equal(pixels[4],0,art.name+'左上角应透明');
 assert.ok(png.readUInt32BE(16)>64&&png.readUInt32BE(20)>64,art.name+'尺寸');
});
console.log('PASS: '+Object.keys(appearances).length+'件武器PNG、透明通道、透明边角与图片尺寸检查');
