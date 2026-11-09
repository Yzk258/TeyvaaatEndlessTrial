import {useAdminUsers} from '../hooks/useAdminUsers';
import {AccountTable} from './AccountTable';
export function AdminUsersPanel({currentUserId}:{currentUserId:string}){
 const page=useAdminUsers();
 return <div className="space-y-5">{page.notice&&<p role="status" className="rounded-xl border border-amber-100/20 p-4 text-sm text-amber-100">{page.notice}</p>}{page.state.status==='loading'?<p>正在读取账号…</p>:page.state.status==='error'?<p role="alert">{page.state.message}<button onClick={page.load} className="ml-4 text-amber-100">重试</button></p>:page.state.users.length===0?<p>暂无已注册账号。</p>:<AccountTable users={page.state.users} currentUserId={currentUserId} pending={page.pending} onChangeRole={page.changeRole}/>}</div>;
}
