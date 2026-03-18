"use client";

import PortalPaused from "../../components/PortalPaused";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  void children;
  return <PortalPaused compact title="Owner Portal Hidden" description="The owner/admin interface is still preserved in the repository, but it is disconnected from the active site until that backend is intentionally revived." />;
}
