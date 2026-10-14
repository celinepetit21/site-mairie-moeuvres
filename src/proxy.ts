import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseConfig } from '@/lib/supabase/config';
export async function proxy(request: NextRequest) {
 const config = supabaseConfig();
 let response = NextResponse.next({request});
 response.headers.set('Cache-Control','private, no-store');
 if (!config) return response;
 const client = createServerClient(config.url,config.key,{cookies:{
  getAll:()=>request.cookies.getAll(),
  setAll:(values)=>{ values.forEach(({name,value})=>request.cookies.set(name,value));
   response=NextResponse.next({request});
   values.forEach(({name,value,options})=>response.cookies.set(name,value,options));
   response.headers.set('Cache-Control','private, no-store');
  }
 }});
 const { data,error } = await client.auth.getClaims();
 if (request.nextUrl.pathname !== '/admin/connexion' && (error || !data?.claims)) {
  const next = NextResponse.redirect(new URL('/admin/connexion',request.url));
  response.cookies.getAll().forEach(cookie=>next.cookies.set(cookie));
  next.headers.set('Cache-Control','private, no-store'); return next;
 }
 return response;
}
export const config = { matcher: ['/admin/:path*'] };
