/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(event.reason);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  if (hasError) {
    let errorMessage = 'Something went wrong.';
    
    try {
      const parsed = JSON.parse(error?.message || '');
      if (parsed.error && parsed.operationType) {
        errorMessage = `Firestore Error: ${parsed.operationType} on ${parsed.path || 'unknown path'} failed. ${parsed.error}`;
      }
    } catch (e) {
      errorMessage = error?.message || errorMessage;
    }

    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 text-center">
        <div className="glass p-8 max-w-md w-full border-red-500/20">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold mb-4">Application Error</h2>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            {errorMessage}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full h-12 rounded-xl bg-cobalt font-bold text-sm cobalt-glow"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
