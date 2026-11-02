import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultAppearance, getAppearance } from '../src/lib/appearance';
import { activeSeason, resolveAppearance } from '../src/lib/seasonal-themes';

const paris = (localDate: string) => new Date(localDate + 'T12:00:00+01:00');

test('Une ancienne configuration sans mode active le calendrier sans perdre ses couleurs', () => {
 const { mode: _mode, ...ancien } = defaultAppearance;
 assert.equal(getAppearance(ancien).mode, 'automatique');
 const normal = resolveAppearance({ ...ancien, boutons: '#123456', saison: 'noel' }, paris('2026-08-04'));
 assert.equal(normal.boutons, '#123456');
 assert.equal(normal.saison, 'aucune');
});

test('Movember est bleu du 1er au 30 novembre, en heure de Paris', () => {
 for (const day of ['2026-11-01', '2026-11-02', '2026-11-30']) {
  const a = resolveAppearance(defaultAppearance, paris(day));
  assert.equal(a.saison, 'movember', day);
  assert.equal(a.boutons, '#184b91', day);
  assert.equal(a.texte, '');
 }
 assert.equal(activeSeason(new Date('2026-10-31T23:30:00Z')), 'movember');
 assert.equal(activeSeason(new Date('2026-11-30T23:30:00Z')), 'noel');
});

test('Les périodes se succèdent sans conflit', () => {
 assert.equal(activeSeason(paris('2026-10-25')), 'octobre_rose');
 assert.equal(activeSeason(paris('2026-10-26')), 'halloween');
 assert.equal(activeSeason(paris('2026-10-31')), 'halloween');
 assert.equal(activeSeason(paris('2026-12-26')), 'noel');
 assert.equal(activeSeason(paris('2026-12-27')), 'nouvel_an');
 assert.equal(activeSeason(paris('2027-01-06')), 'nouvel_an');
 assert.equal(activeSeason(paris('2027-01-07')), 'aucune');
 assert.equal(activeSeason(paris('2027-02-14')), 'saint_valentin');
 assert.equal(activeSeason(paris('2027-06-21')), 'fete_musique');
 assert.equal(activeSeason(paris('2027-07-14')), 'quatorze_juillet');
});

test('Pâques suit la date mobile calculée pour chaque année', () => {
 assert.equal(activeSeason(paris('2026-04-05')), 'paques');
 assert.equal(activeSeason(paris('2027-03-28')), 'paques');
 assert.equal(activeSeason(paris('2027-03-29')), 'paques');
 assert.equal(activeSeason(paris('2027-04-10')), 'aucune');
});

test('Le mode manuel prévaut toujours et conserve son message', () => {
 const chosen = { ...defaultAppearance, mode: 'manuel' as const, saison: 'halloween' as const, boutons: '#123456', texte: 'Notre fête' };
 assert.deepEqual(resolveAppearance(chosen, paris('2026-11-02')), chosen);
 assert.deepEqual(resolveAppearance(chosen, paris('2026-12-25')), chosen);
});
