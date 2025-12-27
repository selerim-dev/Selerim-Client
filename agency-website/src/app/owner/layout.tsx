"use client";

import React, { useEffect } from "react";
import OwnerSidebar from "../../components/owner/OwnerSidebar";
import MobileHeader from "../../components/MobileHeader";
import { SidebarProvider } from "../../lib/sidebar-context";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add class to body to hide header and footer
    document.body.classList.add('dashboard-page');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  return (
    <SidebarProvider>
      <style jsx global>{`
        body.dashboard-page header {
          display: none !important;
        }
        body.dashboard-page footer {
          display: none !important;
        }
        body.dashboard-page main {
          padding-top: 0 !important;
        }
      `}</style>
      <div className="min-h-screen flex bg-black">
        <OwnerSidebar />
        <MobileHeader />
        <main className="flex-1 min-h-screen bg-black px-0 md:px-8 py-8 overflow-x-auto">
          <div className="pt-16 md:pt-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 