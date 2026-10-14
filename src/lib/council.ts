// Composition communiquée par la mairie. Mettre à jour ce fichier en cas de changement.
// Les photographies individuelles peuvent être ajoutées dans public/conseil/.
export type CouncilMember = { name: string; role: string; photo?: string; age?: number | null; group?: string };
export const mayor: CouncilMember = { name: 'Damien Plataux', role: 'Maire' };
export const deputies: CouncilMember[] = [
 { name: 'Vincent Scafuro', role: '1er adjoint' },
 { name: 'Julie Mionnet', role: '2e adjointe' },
 { name: 'Rudy Petit', role: '3e adjoint' },
];
export const councillors: CouncilMember[] = [
 { name: 'Marion Cappelaere', role: 'Conseillère municipale' },
 { name: 'Marcelle Guillot', role: 'Conseillère municipale' },
 { name: 'Noémie Lefebvre', role: 'Conseillère municipale' },
 { name: 'Thibault Silvain', role: 'Conseiller municipal' },
 { name: 'Noah Soufflet', role: 'Conseiller municipal' },
 { name: 'Antoine Terrasse', role: 'Conseiller municipal' },
];
