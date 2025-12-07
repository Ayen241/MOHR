'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EmployeeForm } from '@/components/employees/employee-form';
import { apiCall } from '@/lib/api-client';

export default function AddEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await apiCall.post('/api/employees', data);
      router.push('/employees');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/employees"
          className="p-2 hover:bg-moss-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-moss-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-moss-900">Add New Employee</h1>
          <p className="text-moss-600 mt-1">Create a new employee record</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-moss-100 p-6">
        <EmployeeForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Create Employee"
        />
      </div>
    </div>
  );
}
