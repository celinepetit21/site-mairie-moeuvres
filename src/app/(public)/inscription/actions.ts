'use server';
import { publicClient } from '@/lib/supabase/server';
import { parseSubscription } from '@/lib/subscriptions';
export type SubscriptionState = { error?: string; success?: boolean };
export async function subscribe(_state: SubscriptionState, data: FormData): Promise<SubscriptionState> {
 if (String(data.get('site_web') || '')) return { success: true };
 let rows;
 try { rows = parseSubscription(data); } catch (error) { return { error: error instanceof Error ? error.message : 'Vérifiez les informations saisies.' }; }
 const client = publicClient();
 if (!client) return { error: 'Le formulaire est temporairement indisponible. Contactez la mairie.' };
 try {
 const results = await Promise.all(rows.map(row => client.from('mairie_abonnements').insert(row)));
 if (results.some(({error}) => error && error.code !== '23505')) return { error: 'L’inscription n’a pas pu être enregistrée. Réessayez plus tard ou contactez la mairie.' };
 return { success: true };
 } catch { return { error: 'Connexion interrompue. Veuillez réessayer.' }; }
}
