export function supabaseConfig() {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
 if (!url || !key || url.includes('votre-projet')) return null;
 if (key.startsWith('sb_secret_')) throw new Error('Utilisez uniquement une clé Supabase publique.');
 // Une ancienne clé JWT anon est permise ; une service_role est toujours refusée.
 if (key.startsWith('eyJ')) {
  try { const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString());
   if (payload.role !== 'anon') throw new Error('Clé non publique.');
  } catch { throw new Error('La clé Supabase doit être publishable ou anon.'); }
 }
 return { url, key };
}
