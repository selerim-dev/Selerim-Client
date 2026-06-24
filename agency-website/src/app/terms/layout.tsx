import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Terms & Conditions — Selerim',
  description: 'The terms and conditions for using the Selerim website and services.',
  path: '/terms',
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
