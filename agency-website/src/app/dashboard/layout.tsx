import type { Metadata } from 'next';
import PortalPaused from '../../components/PortalPaused';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  void children;
  return (
    <PortalPaused
      compact
      title="Client Dashboard Hidden"
      description="The old dashboard remains in the codebase, but it has been removed from the live frontend while Selerim is repositioned as a marketing and lead-generation site."
    />
  );
}
