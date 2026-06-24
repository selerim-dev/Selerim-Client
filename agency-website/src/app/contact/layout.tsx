import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Contact Selerim — Build AI Into Your Product or Workflow',
  description:
    'Tell Selerim what you are building or trying to improve. Get help with AI integrations, product engineering, workflow automation, and app modernization.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
