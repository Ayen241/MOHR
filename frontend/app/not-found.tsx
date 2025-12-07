'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
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
        <h1 className="text-6xl font-bold text-moss-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-moss-900 mb-3">Page Not Found</h2>
        <p className="text-moss-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
          Let's get you back to the right place.
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="gap-2">
              <Home size={20} />
              Go to Dashboard
            </Button>
          </Link>
          <button onClick={() => window.history.back()} className="text-moss-600 hover:text-moss-700 font-medium">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
