'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
export async function removeSubscription(_state: {error?: string}, data: FormData) {
 const {client} = await requireAdmin();
 const id = String(data.get('id') || '');
 if (!/^[0-9a-f-]{36}$/.test(id) || data.get('confirmer') !== 'oui') return {error:'Cochez la confirmation de désinscription.'};
 const {error} = await client.from('mairie_abonnements').delete().eq('id',id);
 if (error) return {error:'La désinscription a échoué. Veuillez réessayer.'};
 revalidatePath('/admin/abonnements'); return {};
}
