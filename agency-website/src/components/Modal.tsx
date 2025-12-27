import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-xl" }: ModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close when clicking backdrop
    >
      <div 
        className={`bg-black border border-white/20 rounded-2xl p-8 w-full ${maxWidth} shadow-2xl max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Reusable form components for consistent styling
export const ModalForm = ({ children, onSubmit }: { children: React.ReactNode; onSubmit: (e: React.FormEvent) => void }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {children}
  </form>
);

export const ModalInput = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false,
  placeholder = "",
  rows = 4,
  ...props 
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  [key: string]: any;
}) => (
  <div>
    <label className="block text-white/80 text-lg mb-3 font-semibold">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
        rows={rows}
        placeholder={placeholder}
        {...props}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder={placeholder}
        {...props}
      />
    )}
  </div>
);

export const ModalSelect = ({ 
  label, 
  value, 
  onChange, 
  children, 
  required = false 
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div>
    <label className="block text-white/80 text-lg mb-3 font-semibold">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      {children}
    </select>
  </div>
);

export const ModalButtons = ({ 
  primaryText, 
  onPrimary, 
  secondaryText = "Cancel", 
  onSecondary,
  primaryColor = "blue",
  isLoading = false
}: {
  primaryText: string;
  onPrimary: () => void;
  secondaryText?: string;
  onSecondary: () => void;
  primaryColor?: "blue" | "green" | "red";
  isLoading?: boolean;
}) => {
  const getPrimaryColorClasses = () => {
    switch (primaryColor) {
      case "green":
        return "bg-green-600 hover:bg-green-700";
      case "red":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <div className="flex gap-4 pt-6">
      <button
        type="button"
        onClick={onPrimary}
        disabled={isLoading}
        className={`flex-1 ${getPrimaryColorClasses()} text-white py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'Loading...' : primaryText}
      </button>
      <button
        type="button"
        onClick={onSecondary}
        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
      >
        {secondaryText}
      </button>
    </div>
  );
}; 