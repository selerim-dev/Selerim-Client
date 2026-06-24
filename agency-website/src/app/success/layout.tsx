import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Selerim Success Stories — Real Products, Real Outcomes',
  description: 'A closer look at teams Selerim partnered with and the products shipped together.',
  path: '/success',
});

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
