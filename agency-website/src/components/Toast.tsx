'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

const accentColor: Record<string, string> = {
  success: '#3ecf8e',
  error: '#ff6b6b',
  info: 'var(--brand)',
  warning: '#f5b14c',
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
      className="glass-strong animate-fade-in-up fixed right-6 top-6 z-[90] flex min-w-[280px] max-w-sm items-start gap-3 overflow-hidden rounded-2xl py-4 pl-5 pr-4"
      role="alert"
    >
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: accentColor[type] }}
        aria-hidden
      />
      <span
        className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: accentColor[type] }}
        aria-hidden
      />
      <span className="max-h-40 flex-1 overflow-y-auto break-words text-[0.95rem] leading-relaxed text-ink">
        {displayMessage}
      </span>
      <button
        onClick={onClose}
        className="ml-2 text-ink-subtle transition-colors hover:text-ink focus:outline-none"
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