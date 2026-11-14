export const associationOrder=['a5500000-0000-4000-8000-000000000001','a5500000-0000-4000-8000-000000000005','a5500000-0000-4000-8000-000000000002','a5500000-0000-4000-8000-000000000003','a5500000-0000-4000-8000-000000000004'];
export const associationNames:Record<string,string>={
 [associationOrder[0]]:'Association des fêtes communales',
 [associationOrder[1]]:'UNC de Mœuvres',
 [associationOrder[2]]:'Club des Quatre Saisons',
 [associationOrder[3]]:'Comité des fêtes',
 [associationOrder[4]]:'Club de chasse'
};
export const associationLogos:Record<string,string>={
 [associationOrder[0]]:'/associations/afc-logo.png',
 [associationOrder[1]]:'https://unc-nord.fr/wp-content/uploads/2025/03/logo-unc-nord.png'
};
export function associationSort(id:string){const index=associationOrder.indexOf(id);return index<0?999:index}
