'use server';
import {z} from 'zod';
import {publicClient} from '@/lib/supabase/server';
import {associationOrder} from '@/lib/association-data';
export type ProposalState={error?:string;success?:boolean};
const proposalSchema=z.object({
 association_id:z.string().uuid(),
 nom:z.string().trim().min(2).max(100),
 prenom:z.string().trim().min(2).max(100),
 fonction:z.string().trim().max(120),
 email:z.union([z.literal(''),z.email()]),
 telephone:z.string().trim().max(35),
 sujet:z.enum(['coordonnees','presentation','manifestations','actualites','autre']),
 message:z.string().trim().min(15).max(5000)
});
export async function submitAssociationProposal(_previous:ProposalState,form:FormData):Promise<ProposalState>{
 if(String(form.get('site_web')??''))return {error:'Demande refusée.'};
 if(form.get('accord')!=='on')return {error:'Veuillez accepter la transmission de vos informations.'};
 const parsed=proposalSchema.safeParse(Object.fromEntries(['association_id','nom','prenom','fonction','email','telephone','sujet','message'].map(key=>[key,String(form.get(key)??'')])));
 if(!parsed.success)return {error:'Merci de vérifier les informations du formulaire.'};
 if(!associationOrder.includes(parsed.data.association_id))return {error:'Association inconnue.'};
 if(!parsed.data.email&&!parsed.data.telephone)return {error:'Indiquez une adresse e-mail ou un téléphone.'};
 const client=publicClient();if(!client)return {error:'Le formulaire est temporairement indisponible.'};
 const {error}=await client.from('mairie_propositions_associations').insert(parsed.data);
 if(error)return {error:'Impossible d’enregistrer votre proposition pour le moment.'};
 return {success:true};
}
