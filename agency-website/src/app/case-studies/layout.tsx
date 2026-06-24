import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Selerim Work — Shipped Products and AI-Enabled Software',
  description:
    'See real Selerim work across mobile apps, web products, backend systems, and AI-enabled product experiences.',
  path: '/case-studies',
});

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
