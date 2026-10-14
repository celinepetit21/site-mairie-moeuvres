import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
test('Calendrier public : jours seuls, annulations exclues, réservations privées',async()=>{
 const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create table reservations(id integer,nom text,date_debut date,date_fin date,statut text);alter table reservations enable row level security;insert into reservations values(1,'SECRET',current_date+1,current_date+2,'validee'),(2,'SECRET',current_date+3,current_date+3,'annulee'),(3,'SECRET',current_date+4,current_date+4,'refusee'),(4,'SECRET',current_date+5,current_date+5,'a_valider');`);
 const sql=await readFile(new URL('../supabase/SALLE_calendrier_public.sql',import.meta.url),'utf8');await db.exec(sql);await db.exec(sql);await db.exec('set role anon');
 await assert.rejects(()=>db.query('select * from reservations'));
 const {rows}=await db.query<{jour:string;indisponible:boolean}>('select * from mairie_disponibilites_salle(current_date,current_date+5)');assert.equal(rows.length,6);assert.deepEqual(rows.map(r=>r.indisponible),[false,true,true,false,false,true]);assert.deepEqual(Object.keys(rows[0]).sort(),['indisponible','jour']);assert.equal(JSON.stringify(rows).includes('SECRET'),false);await assert.rejects(()=>db.query('select * from mairie_disponibilites_salle(current_date,current_date+500)'));
 }finally{await db.close();}
});
