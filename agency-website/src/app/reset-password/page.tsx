'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { gradientMain } from '../../config/tokens';
import { useAuth } from '../../lib/auth-context';
import { useNotification } from '../../components/NotificationProvider';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    token: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  
  const { confirmPasswordReset, isLoading, error, clearError } = useAuth();
  const { notify } = useNotification();

  useEffect(() => {
    // Check if token is in URL params
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setFormData(prev => ({ ...prev, token: urlToken }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (error) {
      notify({ message: error, type: 'error' });
      clearError();
    }
  }, [error, notify, clearError]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.token) {
      newErrors.token = 'Reset token is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }

    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await confirmPasswordReset(formData.token, formData.new_password);
      // Success handled by context (redirect to login)
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-12vw] top-[-12vw] h-[35vw] w-[35vw] rounded-full bg-blue-400/15 blur-[150px]" />
        <div className="absolute right-[-12vw] top-[25vw] h-[30vw] w-[30vw] rounded-full bg-gray-400/15 blur-[150px]" />
        <div className="absolute left-[15vw] bottom-[-12vw] h-[30vw] w-[30vw] rounded-full bg-blue-400/15 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/Logo.png"
              alt="Selerim Logo"
              width={64}
              height={64}
              className="mx-auto"
              priority
            />
          </Link>
          <h2 className="mt-8 text-4xl font-bold tracking-tight text-white">
            Reset your password
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Enter your new password below
          </p>
        </div>

        <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-2xl p-10 border border-white/10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="token" className="block text-lg font-medium text-white/80">
                Reset Token
              </label>
              <div className="mt-2">
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  value={formData.token}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                    errors.token ? 'ring-2 ring-red-400' : ''
                  }`}
                  placeholder="Enter reset token from your email"
                />
                {errors.token && (
                  <p className="mt-1 text-sm text-red-400">{errors.token}</p>
                )}
              </div>
              <p className="mt-2 text-sm text-white/60">
                This token was sent to your email address
              </p>
            </div>

            <div>
              <label htmlFor="new_password" className="block text-lg font-medium text-white/80">
                New Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="new_password"
                  name="new_password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 pr-12 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                    errors.new_password ? 'ring-2 ring-red-400' : ''
                  }`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                >
                  {showNewPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {errors.new_password && (
                  <p className="mt-1 text-sm text-red-400">{errors.new_password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-lg font-medium text-white/80">
                Confirm New Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 pr-12 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                    errors.confirm_password ? 'ring-2 ring-red-400' : ''
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {errors.confirm_password && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirm_password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg ${gradientMain} px-6 py-4 text-lg font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-dark-blue disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-lg text-white/60">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 