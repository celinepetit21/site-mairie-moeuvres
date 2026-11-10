export const subscriptionTopics = { alertes: 'Alertes et urgences', informations: 'Informations communales', festivites: 'Festivités et événements', autres: 'Autres nouvelles de la commune' } as const;
export type SubscriptionTopic = keyof typeof subscriptionTopics;
export function parseSubscription(data: FormData) {
 const channels = [...new Set(data.getAll('canaux').map(String))];
 const topics = [...new Set(data.getAll('sujets').map(String))];
 if (!channels.length || channels.some(c => !['email','sms'].includes(c))) throw new Error('Choisissez au moins un mode de réception.');
 if (!topics.length || topics.some(t => !Object.hasOwn(subscriptionTopics,t))) throw new Error('Choisissez au moins un type d’information.');
 if (data.get('consentement') !== 'oui') throw new Error('Votre accord est nécessaire pour vous inscrire.');
 const email = String(data.get('email') || '').trim().toLowerCase();
 let phone = String(data.get('telephone') || '').replace(/[\s.()-]/g, '');
 if (phone.startsWith('0033')) phone = '+' + phone.slice(2);
 if (/^0[67]\d{8}$/.test(phone)) phone = '+33' + phone.slice(1);
 if (channels.includes('email') && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw new Error('Indiquez une adresse e-mail valide.');
 if (channels.includes('sms') && !/^\+33[67]\d{8}$/.test(phone)) throw new Error('Indiquez un numéro de portable français valide (06 ou 07).');
 return channels.map(c => ({ canal: c, destination: c === 'email' ? email : phone, sujets: topics, consentement_version: '2026-11-10' }));
}
export function csvCell(value: string) { return '"' + (/^[=+@\-\t\r\n]/.test(value) ? "'" + value : value).replaceAll('"','""') + '"'; }
