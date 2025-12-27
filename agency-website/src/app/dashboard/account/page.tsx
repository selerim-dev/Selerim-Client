"use client";

import React, { useState } from "react";
import { useAuth } from "../../../lib/auth-context";
import { useNotification } from "../../../components/NotificationProvider";
import authService from "../../../lib/auth";
import { componentClasses } from "../../../components/DesignSystem";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  KeyIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function AccountPage() {
  const { user, tokens, logout } = useAuth();
  const { notify } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!tokens?.access_token) return;

    setIsLoading(true);
    try {
      // Update profile
      const updateData: any = {};
      if (formData.first_name !== user?.first_name) updateData.first_name = formData.first_name;
      if (formData.last_name !== user?.last_name) updateData.last_name = formData.last_name;
      if (formData.phone !== user?.phone) updateData.phone = formData.phone;

      if (Object.keys(updateData).length > 0) {
        await authService.updateProfile(updateData, tokens.access_token);
      }

      // Change password if provided
      if (formData.current_password && formData.new_password) {
        if (formData.new_password !== formData.confirm_password) {
          notify({ message: 'New passwords do not match', type: 'error' });
          return;
        }
        await authService.changePassword({
          current_password: formData.current_password,
          new_password: formData.new_password
        }, tokens.access_token);
      }

      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
      notify({ message: 'Account updated successfully', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update account';
      notify({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.first_name || user?.last_name || 'User';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={componentClasses.sectionTitle}>Account Settings</h1>
        <button
          onClick={handleLogout}
          className={componentClasses.dangerButton}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className={componentClasses.formContainer}>
            <div className="flex items-center justify-between mb-8">
              <h2 className={componentClasses.cardTitle}>Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={componentClasses.secondaryButton}
              >
                {isEditing ? (
                  <>
                    <XMarkIcon className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </>
                )}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={componentClasses.formLabel}>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={componentClasses.formInput}
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <UserIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{user?.first_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className={componentClasses.formLabel}>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={componentClasses.formInput}
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <UserIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{user?.last_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className={componentClasses.formLabel}>Email Address</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <EnvelopeIcon className="h-5 w-5 text-green-400" />
                    <span className="text-white">{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className={componentClasses.formLabel}>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={componentClasses.formInput}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <PhoneIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-white">{user?.phone || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className={componentClasses.formLabel}>Role</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <KeyIcon className="h-5 w-5 text-orange-400" />
                    <span className="text-white capitalize">{user?.role || 'Unknown'}</span>
                  </div>
                </div>

                <div>
                  <label className={componentClasses.formLabel}>Account Status</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className={`h-3 w-3 rounded-full ${user?.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-white">{user?.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-white/10">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={componentClasses.gradientButton}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <CheckIcon className="h-5 w-5" />
                    )}
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="lg:col-span-1">
          <div className={componentClasses.formContainer}>
            <h2 className={componentClasses.cardTitle}>Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className={componentClasses.formLabel}>Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    className={componentClasses.formInput}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={componentClasses.formLabel}>New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    className={componentClasses.formInput}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={componentClasses.formLabel}>Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className={componentClasses.formInput}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {formData.new_password && formData.confirm_password && (
                <div className={`p-3 rounded-lg text-sm ${
                  formData.new_password === formData.confirm_password 
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-400/30'
                }`}>
                  {formData.new_password === formData.confirm_password 
                    ? 'Passwords match' 
                    : 'Passwords do not match'}
                </div>
              )}
            </div>
          </div>

          {/* User Avatar */}
          <div className={`${componentClasses.formContainer} mt-6 text-center`}>
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              {getInitials()}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{getFullName()}</h3>
            <p className="text-white/60">{user?.email}</p>
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.is_active 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-400/30'
              }`}>
                {user?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 