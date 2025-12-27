'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gradientMain } from '../../config/tokens';
import { useAuth } from '../../lib/auth-context';
import { useNotification } from '../../components/NotificationProvider';

export default function AdminSetupPage() {
  const [formData, setFormData] = useState({
    admin_code: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { setupAdmin, isLoading, error, clearError } = useAuth();
  const { notify } = useNotification();

  React.useEffect(() => {
    if (error) {
      notify({ message: error, type: 'error' });
      clearError();
    }
  }, [error, notify, clearError]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.admin_code) {
      newErrors.admin_code = 'Admin code is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const payload = {
      admin_code: formData.admin_code,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
    };

    try {
      await setupAdmin(payload);
      // Success handled by context (redirect), errors by notification
    } catch (error) {
      // Error handled by notification system
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

      <div className="relative z-10 w-full max-w-2xl space-y-8">
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
            Admin Setup
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Create the first administrator account for Selerim
          </p>
        </div>

        <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-2xl p-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin_code" className="block text-lg font-medium text-white/80">
                Admin Setup Code *
              </label>
              <div className="mt-2">
                <input
                  id="admin_code"
                  name="admin_code"
                  type="text"
                  required
                  value={formData.admin_code}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                    errors.admin_code ? 'ring-2 ring-red-400' : ''
                  }`}
                  placeholder="Enter admin setup code"
                />
                {errors.admin_code && (
                  <p className="mt-1 text-sm text-red-400">{errors.admin_code}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-lg font-medium text-white/80">
                  First Name *
                </label>
                <div className="mt-2">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                      errors.first_name ? 'ring-2 ring-red-400' : ''
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-lg font-medium text-white/80">
                  Last Name *
                </label>
                <div className="mt-2">
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                      errors.last_name ? 'ring-2 ring-red-400' : ''
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-white/80">
                Email Address *
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                    errors.email ? 'ring-2 ring-red-400' : ''
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-white/80">
                  Password *
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 pr-12 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                      errors.password ? 'ring-2 ring-red-400' : ''
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                  >
                    {showPassword ? (
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
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-lg font-medium text-white/80">
                  Confirm Password *
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full rounded-lg border-0 bg-white/5 px-5 py-4 pr-12 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 ${
                      errors.confirmPassword ? 'ring-2 ring-red-400' : ''
                    }`}
                    placeholder="Confirm your password"
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
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg ${gradientMain} px-6 py-4 text-lg font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-dark-blue disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Setting up admin...' : 'Create admin account'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-lg text-white/60">
              Already have an account?{' '}
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