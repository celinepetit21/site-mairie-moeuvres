import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contentSchema, validateDates, parisToISO, localInput, detectFile } from '../src/lib/validation';
import { isSection } from '../src/lib/types';
import { supabaseConfig } from '../src/lib/supabase/config';
test('horaires de Paris indépendants du fuseau du serveur',()=>{
 assert.equal(parisToISO('2026-12-06T10:00'),'2026-12-06T09:00:00.000Z');
 assert.equal(parisToISO('2026-07-14T10:00'),'2026-07-14T08:00:00.000Z');
 assert.equal(localInput('2026-12-06T09:00:00Z'),'2026-12-06T10:00');
 assert.throws(()=>parisToISO('2026-03-29T02:30'));
 assert.throws(()=>parisToISO('2026-10-25T02:30'));
 assert.throws(()=>parisToISO('2026-02-30T10:00'));
});
test('validation des publications, dates et routes',()=>{
 assert.equal(validateDates('evenements',null,null),'La date de début est obligatoire.');
 assert.ok(validateDates('informations','2026-10-13','2026-10-12'));
 assert.equal(validateDates('informations',null,null),null);
 assert.ok(isSection('actualites'));assert.equal(isSection('__proto__'),false);assert.equal(isSection('constructor'),false);
 assert.equal(contentSchema.safeParse({titre:'OK',resume:'',contenu:'texte',statut:'publie',date_debut:null,date_fin:null,lieu:''}).success,false);
});
test('formats binaires autorisés ; HTML et SVG refusés',()=>{
 assert.equal(detectFile(new TextEncoder().encode('%PDF-1.7')), 'application/pdf');
 assert.equal(detectFile(new TextEncoder().encode('<svg></svg>')),null);
 assert.equal(detectFile(new TextEncoder().encode('<html>')),null);
 assert.equal(detectFile(new Uint8Array([255,216,255])), 'image/jpeg');
});
test('clé serveur secrète interdite dans la configuration',()=>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 try{
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://exemple.supabase.co';process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='sb_secret_fake';assert.throws(()=>supabaseConfig());
 const payload=Buffer.from(JSON.stringify({role:'service_role'})).toString('base64url');
 process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=`eyJfake.${payload}.signature`;assert.throws(()=>supabaseConfig());
 }finally{if(url===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_URL;else process.env.NEXT_PUBLIC_SUPABASE_URL=url;if(key===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=key;}
});
