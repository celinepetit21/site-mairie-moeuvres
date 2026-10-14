import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { isSection,sections,type Content } from '@/lib/types';
import { uuid } from '@/lib/validation';
import { ContentForm } from '@/components/content-form';
export default async function EditContent({params}:{params:Promise<{section:string;id:string}>}){
 const {client}=await requireAdmin();const {section,id}=await params;if(!isSection(section)||!uuid.safeParse(id).success)notFound();
 const {data,error}=await client.from(sections[section].table).select('*').eq('id',id).maybeSingle();if(error)throw new Error('Chargement impossible.');if(!data)notFound();
 return <><Link className="back-link" href={`/admin/${section}`}>← Retour à la liste</Link><h1>Modifier : {data.titre}</h1><div className="editor-card"><ContentForm section={section} item={data as Content}/></div></>;
}
