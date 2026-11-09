import {useEffect,useState} from 'react';
import type {AccountSummary,UserRole} from '../../../objects/CurrentUser';
import {ListUsersMessage} from '../../../apis/identity/ListUsersMessage';
import {SetUserRoleMessage} from '../../../apis/identity/SetUserRoleMessage';
type State={readonly status:'loading'}|{readonly status:'ready';readonly users:readonly AccountSummary[]}|{readonly status:'error';readonly message:string};
export function useAdminUsers(){
 const [state,setState]=useState<State>({status:'loading'}),[pending,setPending]=useState(false),[notice,setNotice]=useState('');
 const load=()=>{setState({status:'loading'});new ListUsersMessage().send().then(users=>setState({status:'ready',users})).catch(e=>setState({status:'error',message:e.message}));};
 useEffect(()=>{load();},[]);
 const changeRole=(id:string,role:UserRole)=>{if(pending)return;setPending(true);setNotice('');new SetUserRoleMessage(id,role).send().then(users=>{setState({status:'ready',users});setNotice('用户角色已更新');}).catch(e=>setNotice(e.message)).finally(()=>setPending(false));};
 return {state,pending,notice,load,changeRole};
}
