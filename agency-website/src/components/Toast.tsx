'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

const typeStyles = {
  success: 'bg-green-600 text-white border-green-400',
  error: 'bg-red-600 text-white border-red-400',
  info: 'bg-blue-600 text-white border-blue-400',
  warning: 'bg-yellow-600 text-black border-yellow-400',
};

// Sanitize error messages for user display
function sanitizeMessage(message: string, type?: string): string {
  if (type === 'error') {
    // Hide stack traces, SQL, or technical details
    if (message.match(/sql|database|trace|exception|error occurred|asyncpg|column|SELECT|at https?:\/\//i)) {
      return 'Something went wrong. Please try again or contact support.';
    }
    // Hide long technical messages
    if (message.length > 300) {
      return 'An unexpected error occurred. Please try again.';
    }
  }
  return message;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const displayMessage = sanitizeMessage(message, type);

  // Log the full error to the console if sanitized
  useEffect(() => {
    if (type === 'error' && displayMessage !== message) {
      // eslint-disable-next-line no-console
      console.error('[User-facing error sanitized]', message);
    }
  }, [type, message, displayMessage]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 min-w-[280px] max-w-xs px-6 py-4 rounded-xl shadow-lg border-l-4 flex items-center gap-3 animate-fade-in-up ${typeStyles[type]} backdrop-blur-md bg-opacity-90`}
      role="alert"
    >
      <span className="flex-1 text-lg font-medium break-words max-h-40 overflow-y-auto leading-relaxed pr-2">
        {displayMessage}
      </span>
      <button
        onClick={onClose}
        className="ml-4 text-white/70 hover:text-white focus:outline-none"
        aria-label="Close notification"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast; 