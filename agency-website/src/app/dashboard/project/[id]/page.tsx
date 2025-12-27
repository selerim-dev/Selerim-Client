"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import authService from "@/lib/auth";
import { Project, ProjectPayment } from "@/interfaces/auth";
import { componentClasses } from "@/components/DesignSystem";
import { ArrowLeftIcon, CurrencyDollarIcon, CalendarIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { tokens } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!tokens?.access_token || !id) return;
      setIsLoading(true);
      try {
        const proj = await authService.getProject(id as string, tokens.access_token);
        setProject(proj);
        const pays = await authService.getProjectPayments(id as string, tokens.access_token);
        setPayments(pays);
      } catch (error) {
        console.error('Failed to fetch project data:', error);
        
        // If it's an authentication error, the auth service will handle logout
        if (error instanceof Error && (
          error.message.includes('Authentication required') ||
          error.message.includes('401') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('Session expired')
        )) {
          // Auth service will handle the logout automatically
          return;
        }
        
        // For other errors, show empty state
        setProject(null);
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, tokens]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-24 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-6"></div>
        <div className="text-lg text-white/60">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full max-w-3xl mx-auto py-24 text-center">
        <div className="text-2xl font-bold text-white mb-4">Project not found</div>
        <button
          className="mt-4 px-6 py-3 rounded-lg bg-blue-500/80 hover:bg-blue-400 text-white font-semibold text-lg"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeftIcon className="h-5 w-5 inline-block mr-2" /> Back to Dashboard
        </button>
      </div>
    );
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingAmount = totalAmount - paidAmount;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      <button
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-lg font-medium mb-4"
        onClick={() => router.push('/dashboard')}
      >
        <ArrowLeftIcon className="h-5 w-5" /> Back to Dashboard
      </button>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
            {project.tier.charAt(0).toUpperCase() + project.tier.slice(1)}
          </span>
          {project.total_cost && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-500/20 text-fuchsia-300">
              ${Number(project.total_cost).toLocaleString()}
            </span>
          )}
        </div>
        <div className="text-white/60 text-lg mb-4">{project.description || "No description provided."}</div>
        <div className="text-white/40 text-sm mb-2">Last updated: {new Date(project.updated_at).toLocaleDateString()}</div>
      </div>

      {/* Payment Plan */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Payment Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Total Amount</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Paid</p>
                <p className="text-xl font-bold text-white">{formatCurrency(paidAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-white/60 text-sm">Outstanding</p>
                <p className="text-xl font-bold text-white">{formatCurrency(outstandingAmount)}</p>
              </div>
            </div>
          </div>
        </div>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <CurrencyDollarIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No payments scheduled for this project.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{payment.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid'
                          ? 'text-green-400 bg-green-400/10'
                          : payment.status === 'overdue'
                          ? 'text-red-400 bg-red-400/10'
                          : 'text-yellow-400 bg-yellow-400/10'
                      }`}>
                        {payment.status}
                      </span>
                      {getStatusIcon(payment.status)}
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-white/60">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>{formatCurrency(payment.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Due: {formatDate(payment.due_date)}</span>
                      </div>
                      {payment.paid_date && (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Paid: {formatDate(payment.paid_date)}</span>
                        </div>
                      )}
                    </div>
                    {payment.notes && (
                      <p className="text-white/60 text-sm mt-2">{payment.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 