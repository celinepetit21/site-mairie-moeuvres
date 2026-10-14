"use client";
import { useActionState, type ReactNode } from 'react';
import type { ActionState } from '@/app/admin/actions';
export function ActionForm({action,children,label='Enregistrer',danger=false}:{action:(state:ActionState,data:FormData)=>Promise<ActionState>;children:ReactNode;label?:string;danger?:boolean}) {
 const [state,formAction,pending]=useActionState(action,{});
 return <form action={formAction} className="action-form"><fieldset disabled={pending}>{children}</fieldset>{state.error&&<p role="alert" className="alert error">{state.error}</p>}<button className={danger?'button danger':'button'} disabled={pending}>{pending?'Traitement…':label}</button></form>;
}
