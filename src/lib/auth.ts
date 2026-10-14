import 'server-only';
import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import { supabaseConfig } from '@/lib/supabase/config';
export async function requireAdmin() {
 if (!supabaseConfig() || !process.env.ADMIN_USER_ID) redirect('/admin/connexion?erreur=configuration');
 const client = await serverClient();
 const {data:{user},error} = await client.auth.getUser();
 if (error || !user) redirect('/admin/connexion');
 if (user.id !== process.env.ADMIN_USER_ID) redirect('/admin/connexion?erreur=acces');
 const {data: allowed, error: policyError} = await client.rpc('mairie_est_administrateur');
 if (policyError || allowed !== true) redirect('/admin/connexion?erreur=acces');
 return {client,user};
}
