import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  actionText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Complete Legal Analysis',
  message,
  onRetry,
  actionText = 'Try Again',
}) => {
  return (
    <div
      role="alert"
      className="mx-auto my-8 max-w-lg rounded-xl border border-red-200 bg-red-50/50 p-6 text-center text-slate-800 shadow-xs"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>

      <h3 className="text-base font-semibold text-red-950">{title}</h3>
      <p className="mt-2 text-sm text-red-800 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          id="error-retry-button"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
