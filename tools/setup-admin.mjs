import fs from 'node:fs';
import {randomBytes} from 'node:crypto';
const file=new URL('../.local/bootstrap-admin.env',import.meta.url);
fs.mkdirSync(new URL('../.local/',import.meta.url),{recursive:true});
if(fs.existsSync(file)){
 console.log('管理员初始化配置已存在，未覆盖。');
}else{
 fs.writeFileSync(file,'ADMIN_USERNAME=admin\nADMIN_PASSWORD='+randomBytes(24).toString('base64url')+'\n',{flag:'wx'});
 console.log('已生成独立管理员初始密码，保存在 .local/bootstrap-admin.env；后端下次启动时初始化。');
}
