import type { Metadata } from 'next';
import { ApplicationPreview } from './preview';
import './preview.css';

export const metadata: Metadata = {
  title: 'Projet d’application commune · Mœuvres',
  robots: { index: false, follow: false },
};

export default function ApplicationProjectPage() {
  return <ApplicationPreview />;
}
