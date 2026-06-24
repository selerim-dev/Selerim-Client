import type { Metadata } from 'next';
import PortalPaused from '../../components/PortalPaused';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  void children;
  return (
    <PortalPaused
      compact
      title="Owner Portal Hidden"
      description="The owner/admin interface is still preserved in the repository, but it is disconnected from the active site until that backend is intentionally revived."
    />
  );
}
