import type {CurrentUser} from '../../objects/CurrentUser';
import {AdminUsersPanel} from './components/AdminUsersPanel';
export function AdminPage({user}:{user:CurrentUser}){
 if(user.role!=='admin')return <section className="rounded-2xl border border-white/10 p-10"><h1 className="font-serif text-3xl text-amber-50">无权访问</h1><p className="mt-4 text-sm text-stone-400">此页面仅管理员可用。</p></section>;
 return <section className="space-y-7"><header><p className="text-xs tracking-[.3em] text-amber-100/40">ADMINISTRATION</p><h1 className="mt-4 font-serif text-4xl text-amber-50">管理员中心</h1><p className="mt-4 text-sm leading-7 text-stone-400">查看已注册账号并管理角色。自己的管理员身份不能在此修改，权限变更会留存审计记录。</p></header><AdminUsersPanel currentUserId={user.id}/></section>;
}
