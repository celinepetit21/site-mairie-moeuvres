import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { parseSubscription, csvCell } from '../src/lib/subscriptions';
function form(channels=['email']) {const f=new FormData();channels.forEach(c=>f.append('canaux',c));f.append('sujets','alertes');f.set('consentement','oui');f.set('email',' Habitant@example.org ');f.set('telephone','06 12 34 56 78');return f;}
test('subscriptions validate channels, topics, consent and normalize only selected contact details',()=>{
 const f=form(['email','sms']);assert.deepEqual(parseSubscription(f).map(r=>r.destination),['habitant@example.org','+33612345678']);
 f.set('consentement','non');assert.throws(()=>parseSubscription(f),/accord/);
 for(const field of ['canaux','sujets']) {const x=form();x.delete(field);assert.throws(()=>parseSubscription(x));}
 const x=form();x.set('sujets','toString');assert.throws(()=>parseSubscription(x));
 const sms=form(['sms']);sms.set('telephone','03 27 82 50 39');assert.throws(()=>parseSubscription(sms),/portable/);
 const email=form();email.set('telephone','invalid');assert.equal(parseSubscription(email).length,1);
});
test('CSV escapes formulas, telephone numbers and quotes',()=>{assert.equal(csvCell('+33612345678'),'"\'+33612345678"');assert.equal(csvCell('a"b'),'"a""b"');assert.equal(csvCell('=1+1'),'"\'=1+1"');});
test('public subscription insertion and duplicate handling never expose contacts; only admin can delete',async()=>{
 const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create function public.mairie_est_administrateur() returns boolean language sql stable as $$ select current_setting('test.admin',true)='yes' $$;`);
 await db.exec(readFileSync('supabase/06-abonnements.sql','utf8'));
 const insert=`insert into mairie_abonnements(canal,destination,sujets,consentement_version) values('email','test@example.org',array['alertes'],'2026-11-10')`;
 await db.exec('set role anon');await db.exec(insert);await assert.rejects(()=>db.exec(insert),/duplicate key/);
 await assert.rejects(()=>db.exec('select * from mairie_abonnements'));
 await assert.rejects(()=>db.exec('delete from mairie_abonnements'));
 await assert.rejects(()=>db.exec(`insert into mairie_abonnements(canal,destination,sujets,consentement_version) values('sms','123',array['alertes'],'2026-11-10')`));
 await db.exec('reset role;set role authenticated');assert.equal((await db.query('select * from mairie_abonnements')).rows.length,0);
 await db.exec('delete from mairie_abonnements');await db.exec("select set_config('test.admin','yes',false)");assert.equal((await db.query('select * from mairie_abonnements')).rows.length,1);
 await db.exec('delete from mairie_abonnements');assert.equal((await db.query('select * from mairie_abonnements')).rows.length,0);
 }finally{await db.close();}
});
