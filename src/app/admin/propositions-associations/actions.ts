'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/auth';
import {uuid} from '@/lib/validation';
export async function markAssociationProposal(form:FormData){
 const {client,user}=await requireAdmin();const id=String(form.get('id')??'');
 if(!uuid.safeParse(id).success)throw new Error('Proposition invalide.');
 const {error}=await client.from('mairie_propositions_associations').update({statut:'traite',traite_par:user.email||'Administration',traite_le:new Date().toISOString()}).eq('id',id).eq('statut','nouveau');
 if(error)throw new Error('Impossible de marquer la proposition comme traitée.');
 revalidatePath('/admin/propositions-associations');
 redirect('/admin/propositions-associations?succes=1');
}
