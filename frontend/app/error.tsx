'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-moss-50 to-sage-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={40} />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-moss-900 mb-2">500</h1>
        <h2 className="text-2xl font-bold text-moss-900 mb-3">
          Oops! Something went wrong
        </h2>
        <p className="text-moss-600 mb-2">
          We're sorry, but something unexpected happened on our end.
        </p>
        <p className="text-moss-500 text-sm mb-8 font-mono bg-moss-50 p-3 rounded">
          {error.message || 'An unknown error occurred'}
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={() => reset()} variant="primary" className="gap-2">
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <Home size={20} />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <p className="text-moss-600 text-sm mt-8">
          If the problem persists, please contact{' '}
          <a href="mailto:support@mohr.com" className="text-moss-700 font-semibold hover:underline">
            support@mohr.com
          </a>
        </p>
      </div>
    </div>
  );
}
