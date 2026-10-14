import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appearanceSchema,appearanceStyle,defaultAppearance,getAppearance,contrast,readableOnLight } from '../src/lib/appearance';
test('Couleurs : refuse l’injection CSS et traite une configuration ancienne',()=>{
 assert.equal(appearanceSchema.safeParse({...defaultAppearance,boutons:'#fff; background:url(https://example.com)'}).success,false);
 assert.equal(appearanceSchema.safeParse({...defaultAppearance,saison:'inconnue'}).success,false);
 assert.equal(appearanceSchema.safeParse({...defaultAppearance,texte:'x'.repeat(81)}).success,false);
 assert.deepEqual(getAppearance(undefined),defaultAppearance);
});
test('Contraste : texte des boutons et titres lisibles pour couleurs claires, vives ou foncées',()=>{
 for(const r of [0,64,128,192,255])for(const g of [0,64,128,192,255])for(const b of [0,64,128,192,255]){
  const color='#'+[r,g,b].map(c=>c.toString(16).padStart(2,'0')).join('');
  const style=appearanceStyle({...defaultAppearance,boutons:color}) as Record<string,string>;
  assert.ok(contrast(style['--button-bg'],style['--button-fg'])>=4.5,color);
  assert.ok(contrast(style['--button-hover'],style['--button-hover-fg'])>=4.5,color+' hover');
  assert.ok(contrast(readableOnLight(color),'#f5f1e9')>=4.5,color+' titre');
 }
});
