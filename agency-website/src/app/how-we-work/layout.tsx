import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'How Selerim Works — From Idea to Production AI',
  description:
    'A transparent, founder-led process for turning a product or workflow into a production-ready AI integration: discovery, build, ship, and ongoing iteration.',
  path: '/how-we-work',
});

export default function HowWeWorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
