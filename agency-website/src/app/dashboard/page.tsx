"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import DashboardHome from "../../components/DashboardHome";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect admin/owner users to the owner dashboard
      if (user.role === 'admin' || user.role === 'owner') {
        router.push('/owner');
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-lg text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (isAuthenticated && user && (user.role === 'admin' || user.role === 'owner')) {
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-lg text-white/60">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show client dashboard for client users
  if (isAuthenticated && user && user.role === 'client') {
    return <DashboardHome />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return null;
} 