"use client";

import React, { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { useNotification } from "../NotificationProvider";
import authService from "../../lib/auth";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function AccountManagement() {
  const { user, tokens, logout } = useAuth();
  const { notify } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        <h1 className="text-3xl font-bold text-white">Account Management</h1>
        <button
          onClick={handleLogout}
          className="bg-red-400/20 text-red-300 px-6 py-3 rounded-lg hover:bg-red-400/30 transition-colors flex items-center gap-2"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-400/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-400/30 transition-colors flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/60 text-sm mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <UserIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{user?.first_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <UserIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-white">{user?.last_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <EnvelopeIcon className="h-5 w-5 text-green-400" />
                    <span className="text-white">{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-white">{user?.phone || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Role</label>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <ShieldCheckIcon className="h-5 w-5 text-orange-400" />
                    <span className="text-white capitalize">{user?.role}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Member Since</label>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <UserIcon className="h-5 w-5 text-blue-400" />
                    <span className="text-white">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="current_password"
                          value={formData.current_password}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                        >
                          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm mb-2">New Password</label>
                      <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-3 rounded-lg transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-blue-400/30 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                {getInitials()}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{getFullName()}</h3>
              <p className="text-white/60 mb-4">{user?.email}</p>
              <div className="text-sm text-white/60">
                <p>Role: <span className="text-white capitalize">{user?.role}</span></p>
                <p>Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}