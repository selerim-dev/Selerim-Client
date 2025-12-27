'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gradientMain } from '../../config/tokens';
import { useAuth } from '../../lib/auth-context';
import { useNotification } from '../../components/NotificationProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { requestPasswordReset, isLoading, error, clearError } = useAuth();
  const { notify } = useNotification();

  useEffect(() => {
    if (error) {
      notify({ message: error, type: 'error' });
      clearError();
    }
  }, [error, notify, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      notify({ message: 'Please enter your email address', type: 'error' });
      return;
    }

    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
      notify({ 
        message: 'If an account with that email exists, a password reset link has been sent.', 
        type: 'success' 
      });
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleResend = () => {
    setIsSubmitted(false);
    setEmail('');
  };

  if (isSubmitted) {
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
            <div className="mt-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-4xl font-bold tracking-tight text-white">
                Check your email
              </h2>
              <p className="mt-4 text-lg text-white/60">
                We've sent a password reset link to your email address
              </p>
            </div>
          </div>

          <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-2xl p-10 border border-white/10">
            <div className="text-center space-y-6">
              <p className="text-lg text-white/80">
                If you don't see the email, check your spam folder or try again.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-6 py-4 text-lg font-semibold text-white shadow-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-dark-blue"
                >
                  Send another email
                </button>
                
                <Link
                  href="/login"
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-6 py-4 text-lg font-semibold text-white shadow-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-dark-blue"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Forgot your password?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-2xl p-10 border border-white/10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-white/80">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg ${gradientMain} px-6 py-4 text-lg font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-dark-blue disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
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