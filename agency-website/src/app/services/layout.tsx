import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'AI Integration and Product Engineering Services — Selerim',
  description:
    'Explore Selerim services for AI product features, internal AI assistants, workflow automation, RAG systems, MCP-style tool layers, app modernization, and ongoing product engineering.',
  path: '/services',
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
