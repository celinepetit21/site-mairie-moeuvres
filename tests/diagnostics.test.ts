import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnostic } from '../src/lib/supabase/diagnostics';
test('Diagnostic : aucune clé, URL ou donnée de connexion dans la sortie',()=>{
 const secret='sb_secret_confidentiel';
 const output=JSON.stringify(diagnostic({message:'Invalid API key '+secret,details:'mot-de-passe',url:'https://private.example',code:'PGRST204',status:401}));
 assert.equal(output.includes(secret),false);
 assert.equal(output.includes('mot-de-passe'),false);
 assert.equal(output.includes('private.example'),false);
 assert.equal(JSON.parse(output).reason,'invalid_api_key');
 assert.deepEqual(diagnostic({code:secret,message:secret}),{code:'unknown',reason:'supabase_error'});
 assert.equal(diagnostic({code:'42703'}).reason,'missing_column');
 assert.equal(diagnostic({code:'PGRST205'}).reason,'missing_table');
});
