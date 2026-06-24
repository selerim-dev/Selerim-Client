import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy — Selerim',
  description: 'How Selerim handles your data and privacy.',
  path: '/privacy',
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
