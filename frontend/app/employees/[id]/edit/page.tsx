'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EmployeeForm } from '@/components/employees/employee-form';
import { apiCall } from '@/lib/api-client';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
}

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call when backend is ready
        // const { data } = await apiCall.get<Employee>(`/api/employees/${id}`);
        // setEmployee(data);

        // Mock data for now
        setEmployee({
          id,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1 (555) 000-0001',
          position: 'Senior Engineer',
          department: 'Engineering',
          salary: 120000,
          joinDate: '2022-01-15',
          employmentType: 'FULL_TIME',
        });
      } catch (error) {
        console.error('Failed to fetch employee:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      // TODO: Replace with actual API call when backend is ready
      // await apiCall.put(`/api/employees/${id}`, data);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/employees');
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-500"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Employee not found
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-moss-900">
            Edit {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-moss-600 mt-1">Update employee information</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-moss-100 p-6">
        <EmployeeForm
          onSubmit={handleSubmit}
          isLoading={isSaving}
          initialData={employee}
          submitText="Update Employee"
        />
      </div>
    </div>
  );
}
