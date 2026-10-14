import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseConfig } from './config';
export async function serverClient() {
 const config = supabaseConfig(); if (!config) throw new Error('Configurez les variables Supabase.');
 const store = await cookies();
 return createServerClient(config.url, config.key, { cookies: {
  getAll: () => store.getAll(),
  setAll: (values) => { try { values.forEach(({name,value,options}) => store.set(name,value,options)); } catch { /* Le proxy renouvelle les cookies pendant le rendu. */ } },
 } });
}
export function publicClient() {
 const config = supabaseConfig();
 return config ? createClient(config.url, config.key, { auth: { persistSession:false, autoRefreshToken:false, detectSessionInUrl:false }, global:{ fetch: (input,init) => fetch(input,{...init,cache:'no-store'}) } }) : null;
}
