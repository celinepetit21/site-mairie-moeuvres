import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { isSection,sections } from '@/lib/types';
import { ContentForm } from '@/components/content-form';
export default async function NewContent({params}:{params:Promise<{section:string}>}){
 await requireAdmin();const {section}=await params;if(!isSection(section))notFound();return <><Link className="back-link" href={`/admin/${section}`}>← Retour à la liste</Link><h1>Créer {section==='evenements'?'un':'une'} {sections[section].singular}</h1><div className="editor-card"><ContentForm section={section}/></div></>;
}
