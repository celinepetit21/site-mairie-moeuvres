import type { MetadataRoute } from 'next';
// Maintient le choix initial : site en préparation, non indexé.
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',disallow:'/'}};}
