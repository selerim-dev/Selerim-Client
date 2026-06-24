import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'About Selerim — Founder-Led AI and Product Engineering Studio',
  description:
    'Selerim is a founder-led software studio helping teams build production-ready AI integrations, product features, and workflow automation.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
