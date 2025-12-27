"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { useNotification } from './NotificationProvider';
import authService from '../lib/auth';
import { componentClasses } from './DesignSystem';
import { 
  ProjectPayment, 
  ProjectPaymentCreate, 
  ProjectPaymentUpdate 
} from '../interfaces/auth';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ProjectPaymentManagerProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

export default function ProjectPaymentManager({ 
  projectId, 
  projectTitle, 
  onClose 
}: ProjectPaymentManagerProps) {
  const { tokens } = useAuth();
  const { notify } = useNotification();
  
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<ProjectPayment | null>(null);
  
  // Form states
  const [paymentForm, setPaymentForm] = useState<ProjectPaymentCreate>({
    title: '',
    amount: 0,
    due_date: '',
    status: 'scheduled',
    method: 'stripe',
    notes: ''
  });

  useEffect(() => {
    loadPayments();
  }, [projectId]);

  const loadPayments = async () => {
    if (!tokens?.access_token) return;

    setIsLoading(true);
    try {
      const paymentsData = await authService.getProjectPayments(projectId, tokens.access_token);
      setPayments(paymentsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load payments';
      notify({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.access_token) return;

    setIsSubmitting(true);
    try {
      const newPayment = await authService.createProjectPayment(projectId, paymentForm, tokens.access_token);
      setPayments(prev => [...prev, newPayment]);
      setShowAddPayment(false);
      setPaymentForm({
        title: '',
        amount: 0,
        due_date: '',
        notes: ''
      });
      notify({ message: 'Payment added successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add payment';
      notify({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.access_token || !editingPayment) return;

    setIsSubmitting(true);
    try {
      const updatedPayment = await authService.updateProjectPayment(
        projectId, 
        editingPayment.id, 
        paymentForm as ProjectPaymentUpdate, 
        tokens.access_token
      );
      setPayments(prev => prev.map(p => p.id === editingPayment.id ? updatedPayment : p));
      setEditingPayment(null);
      setPaymentForm({
        title: '',
        amount: 0,
        due_date: '',
        notes: ''
      });
      notify({ message: 'Payment updated successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update payment';
      notify({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!tokens?.access_token) return;

    if (!confirm('Are you sure you want to delete this payment?')) return;

    try {
      await authService.deleteProjectPayment(projectId, paymentId, tokens.access_token);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      notify({ message: 'Payment deleted successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete payment';
      notify({ message: errorMessage, type: 'error' });
    }
  };

  const startEditPayment = (payment: ProjectPayment) => {
    setEditingPayment(payment);
    setPaymentForm({
      title: payment.title,
      amount: payment.amount,
      due_date: payment.due_date,
      notes: payment.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingPayment(null);
    setPaymentForm({
      title: '',
      amount: 0,
      due_date: '',
      notes: ''
    });
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-400/10';
      case 'overdue':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const outstandingAmount = totalAmount - paidAmount;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Payment Plan</h2>
            <p className="text-white/60 mt-1">{projectTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Total Amount</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Paid</p>
                <p className="text-xl font-bold text-white">{formatCurrency(paidAmount)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-white/60 text-sm">Outstanding</p>
                <p className="text-xl font-bold text-white">{formatCurrency(outstandingAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Payment Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Payment Schedule</h3>
          <button
            onClick={() => setShowAddPayment(true)}
            className={componentClasses.gradientButton}
          >
            <PlusIcon className="h-5 w-5" />
            Add Payment
          </button>
        </div>

        {/* Payments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={componentClasses.skeleton.card} />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <CurrencyDollarIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No payments scheduled</p>
            <button
              onClick={() => setShowAddPayment(true)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
            >
              Add your first payment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{payment.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
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
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => startEditPayment(payment)}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Payment Modal */}
        {(showAddPayment || editingPayment) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPayment ? 'Edit Payment' : 'Add Payment'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddPayment(false);
                    cancelEdit();
                  }}
                  className="text-white/60 hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={editingPayment ? handleUpdatePayment : handleAddPayment} className="space-y-6">
                <div>
                  <label className={componentClasses.formLabel}>Payment Title *</label>
                  <input
                    type="text"
                    value={paymentForm.title}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, title: e.target.value }))}
                    className={componentClasses.formInput}
                    placeholder="e.g., Deposit, Milestone 1, Final Payment"
                    required
                  />
                </div>

                <div>
                  <label className={componentClasses.formLabel}>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className={componentClasses.formInput}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className={componentClasses.formLabel}>Due Date *</label>
                  <input
                    type="date"
                    value={paymentForm.due_date}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, due_date: e.target.value }))}
                    className={componentClasses.formInput}
                    required
                  />
                </div>

                <div>
                  <label className={componentClasses.formLabel}>Notes</label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                    className={componentClasses.formInput}
                    rows={3}
                    placeholder="Optional notes about this payment..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={componentClasses.gradientButton}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <PlusIcon className="h-5 w-5" />
                    )}
                    {isSubmitting ? 'Saving...' : (editingPayment ? 'Update Payment' : 'Add Payment')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPayment(false);
                      cancelEdit();
                    }}
                    className={componentClasses.secondaryButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 