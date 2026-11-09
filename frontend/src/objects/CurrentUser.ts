export type UserRole='user'|'admin';
export type CurrentUser={readonly id:string;readonly username:string|null;readonly nickname:string;readonly role:UserRole;readonly isGuest:boolean};
export type AuthSession={readonly token:string;readonly expiresAt:string;readonly user:CurrentUser};
export type LoginResponse=
 | {readonly status:'authenticated';readonly session:AuthSession;readonly message:string}
 | {readonly status:'invalid'|'locked';readonly session:null;readonly message:string};
export type AccountSummary={readonly id:string;readonly username:string;readonly nickname:string;readonly role:UserRole;readonly createdAt:string};
