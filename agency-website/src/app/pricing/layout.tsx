import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Selerim Pricing — AI Strategy, Integration Sprints, and Product Engineering',
  description:
    'Simple starting points for AI opportunity audits, AI integration sprints, and ongoing product engineering support.',
  path: '/pricing',
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
