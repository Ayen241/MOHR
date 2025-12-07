'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  position: z.string().min(2, 'Position is required'),
  department: z.string().min(2, 'Department is required'),
  salary: z.coerce.number().positive('Salary must be positive'),
  joinDate: z.string().min(1, 'Join date is required'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT']),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<EmployeeFormData>;
  submitText?: string;
}

export function EmployeeForm({
  onSubmit,
  isLoading,
  initialData,
  submitText = 'Save Employee',
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
  });

  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save employee');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            First Name
          </label>
          <input
            {...register('firstName')}
            type="text"
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            Last Name
          </label>
          <input
            {...register('lastName')}
            type="text"
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            Phone
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            Position
          </label>
          <input
            {...register('position')}
            type="text"
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
            placeholder="Software Engineer"
          />
          {errors.position && (
            <p className="text-red-600 text-sm mt-1">{errors.position.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            Department
          </label>
          <select
            {...register('department')}
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
          {errors.department && (
            <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>
          )}
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            Salary
          </label>
          <input
            {...register('salary')}
            type="number"
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
            placeholder="50000"
          />
          {errors.salary && (
            <p className="text-red-600 text-sm mt-1">{errors.salary.message}</p>
          )}
        </div>

        {/* Join Date */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            Join Date
          </label>
          <input
            {...register('joinDate')}
            type="date"
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
          />
          {errors.joinDate && (
            <p className="text-red-600 text-sm mt-1">{errors.joinDate.message}</p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-moss-900 mb-1">
            Employment Type
          </label>
          <select
            {...register('employmentType')}
            className="w-full px-4 py-2 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500"
          >
            <option value="">Select Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
          </select>
          {errors.employmentType && (
            <p className="text-red-600 text-sm mt-1">{errors.employmentType.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
}
