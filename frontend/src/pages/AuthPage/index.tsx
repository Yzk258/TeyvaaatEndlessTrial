import {useState} from 'react';
export function AuthPage({pending,message,onLogin,onRegister}:{pending:boolean;message?:string;onLogin:(username:string,password:string)=>void;onRegister:(username:string,password:string,nickname:string)=>void}){
 const [mode,setMode]=useState<'login'|'register'>('login');
 const [username,setUsername]=useState(''),[password,setPassword]=useState(''),[nickname,setNickname]=useState(''),[confirmation,setConfirmation]=useState(''),[error,setError]=useState('');
 const switchMode=(value:'login'|'register')=>{setMode(value);setError('');setPassword('');setConfirmation('');};
 return <section className="mx-auto max-w-md rounded-2xl border border-white/20 bg-[#111d30]/90 p-8 text-stone-100 shadow-xl backdrop-blur-sm">
  <h1 className="mt-4 text-center font-serif text-3xl text-amber-50">{mode==='login'?'登录':'注册账号'}</h1>
  <div className="my-7 grid grid-cols-2 gap-2">{(['login','register'] as const).map(value=><button key={value} disabled={pending} onClick={()=>switchMode(value)} className={mode===value?'rounded-full bg-amber-100 px-5 py-2 text-sm text-slate-900':'rounded-full border border-white/15 px-5 py-2 text-sm text-stone-400'}>{value==='login'?'登录':'注册'}</button>)}</div>
  <form className="space-y-5" onSubmit={event=>{event.preventDefault();if(pending)return;setError('');if(mode==='register'&&password!==confirmation){setError('两次输入的密码不一致');return;}if(mode==='login')onLogin(username,password);else onRegister(username,password,nickname);}}>
   <label className="block text-sm text-stone-300">用户名<input required minLength={3} maxLength={24} pattern="[A-Za-z0-9_]{3,24}" autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/30 px-4 py-3 outline-none focus:border-amber-100/50" placeholder="3–24位字母、数字或下划线"/></label>
   {mode==='register'&&<label className="block text-sm text-stone-300">冒险昵称<input required maxLength={30} autoComplete="nickname" value={nickname} onChange={e=>setNickname(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/30 px-4 py-3 outline-none focus:border-amber-100/50"/></label>}
   <label className="block text-sm text-stone-300">密码<input required type="password" minLength={8} maxLength={128} autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/30 px-4 py-3 outline-none focus:border-amber-100/50" placeholder="至少8个字符"/></label>
   {mode==='register'&&<label className="block text-sm text-stone-300">确认密码<input required type="password" minLength={8} maxLength={128} autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/30 px-4 py-3 outline-none focus:border-amber-100/50"/></label>}
   {(error||message)&&<p role="alert" className="rounded-xl bg-rose-200/5 p-3 text-sm text-rose-100">{error||message}</p>}
   <button disabled={pending} className="w-full rounded-full bg-[#e8dbc2] px-7 py-3 text-sm font-medium text-[#243630] disabled:opacity-40">{pending?'正在处理…':mode==='login'?'登录冒险账号':'注册并开始冒险'}</button>
  </form>
 </section>;
}
