// Ne journalise jamais le message brut, la clé, le mot de passe ou une URL.
export function diagnostic(error: unknown) {
 const e=(error&&typeof error==='object'?error:{}) as {code?:unknown;status?:unknown;message?:unknown};
 const raw=typeof e.message==='string'?e.message:'';
 const code=typeof e.code==='string'&&(/^(?:PGRST[0-9]{3}|[0-9A-Z]{5})$/.test(e.code)||['invalid_credentials','email_not_confirmed','over_request_rate_limit','user_banned'].includes(e.code))?e.code:'unknown';
 const status=typeof e.status==='number'&&Number.isInteger(e.status)&&e.status>=100&&e.status<=599?e.status:undefined;
 let reason='supabase_error';
 if(/invalid api key|invalid apikey/i.test(raw))reason='invalid_api_key';
 else if(code==='42703'||code==='PGRST204')reason='missing_column';
 else if(code==='42P01'||code==='PGRST205')reason='missing_table';
 else if(code==='42501')reason='permission_denied';
 else if(code==='invalid_credentials')reason='invalid_credentials';
 else if(code==='email_not_confirmed')reason='email_not_confirmed';
 else if(/fetch failed|failed to fetch|network|ENOTFOUND|ECONNREFUSED/i.test(raw))reason='network_error';
 return {code,...(status?{status}:{}),reason};
}
export function logSupabaseError(operation:string,error:unknown){
 console.error('[Mairie Supabase]',{operation,...diagnostic(error)});
}
