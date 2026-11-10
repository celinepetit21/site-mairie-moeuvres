import { requireAdmin } from '@/lib/auth';
import { csvCell, subscriptionTopics, type SubscriptionTopic } from '@/lib/subscriptions';
export async function GET(request: Request) {
 const {client} = await requireAdmin(); const params = new URL(request.url).searchParams;
 const lines = [['Coordonnées','Mode de réception','Sujets','Consentement le','Version du consentement'].map(csvCell).join(';')];
 for(let offset=0;;offset+=500) {
 let query = client.from('mairie_abonnements').select('id,destination,canal,sujets,created_at,consentement_version').order('created_at').order('id').range(offset,offset+499);
 const canal=params.get('canal'), sujet=params.get('sujet');
 if(canal&&['email','sms'].includes(canal)) query=query.eq('canal',canal);
 if(sujet&&Object.hasOwn(subscriptionTopics,sujet)) query=query.contains('sujets',[sujet]);
 const {data,error}=await query;
 if(error) return new Response('Export indisponible',{status:503});
 for(const row of data || []) lines.push([row.destination,row.canal,row.sujets.map((t:SubscriptionTopic)=>subscriptionTopics[t]).join(', '),row.created_at,row.consentement_version].map(csvCell).join(';'));
 if(!data || data.length<500) break;
 }
 return new Response('\ufeff'+lines.join('\r\n'), {headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="inscriptions-moeuvres.csv"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
