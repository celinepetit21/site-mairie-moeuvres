import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesSearch,eventEnded,calendarFile } from '../src/lib/content-tools';
test('Recherche : accents, ligature et plusieurs mots',()=>{
 assert.equal(matchesSearch('moeuvres ecole',['École de Mœuvres']),true);
 assert.equal(matchesSearch('ecole tarif',['École de Mœuvres']),false);
 assert.equal(matchesSearch('  ÉCOLE  ',['école']),true);
});
test('Agenda : fin réelle et journée à Paris sans heure de fin',()=>{
 const now=Date.parse('2026-10-14T18:00:00Z');
 assert.equal(eventEnded('2026-10-14T08:00:00Z',null,now),false);
 assert.equal(eventEnded('2026-10-13T08:00:00Z',null,now),true);
 assert.equal(eventEnded('2026-10-14T08:00:00Z','2026-10-14T09:00:00Z',now),true);
 assert.equal(eventEnded('2026-10-14T23:30:00Z',null,Date.parse('2026-10-15T20:00:00Z')),false);
});
test('Calendrier : échappement, heures UTC et pliage UTF-8',()=>{
 const output=calendarFile({id:'test',titre:'Fête, village; ensemble',contenu:'Ligne 1\nBEGIN:VEVENT\n'+ 'é'.repeat(200),lieu:'Mœuvres',date_debut:'2026-10-24T19:00:00+02:00',date_fin:'2026-10-25T02:00:00+02:00'},new Date('2026-10-14T06:00:00Z'));
 assert.ok(output.includes('DTSTART:20261024T170000Z\r\n'));
 assert.ok(output.includes('DTEND:20261025T000000Z\r\n'));
 assert.ok(output.includes('SUMMARY:Fête\\, village\\; ensemble'));
 assert.ok(output.includes('Ligne 1\\nBEGIN:VEVENT\\n'));
 assert.equal(output.split('\r\n').filter(l=>l==='BEGIN:VEVENT').length,1);
 for(const line of output.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);
});
