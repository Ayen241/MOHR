'use client';

import React from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: 'bg-green-50 text-green-700 border border-green-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  neutral: 'bg-moss-50 text-moss-700 border border-moss-200',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const iconMap = {
  success: <Check size={16} />,
  error: <X size={16} />,
  warning: <AlertCircle size={16} />,
  info: <Clock size={16} />,
  neutral: null,
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  children,
  icon,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-colors ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
    >
      {icon || iconMap[variant]}
      {children}
    </span>
  );
}

// Preset badges for common statuses
export function StatusBadge({
  status,
  size = 'md',
}: {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE' | 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  size?: BadgeSize;
}) {
  const statusConfig: Record<string, { variant: BadgeVariant; label: string }> =
    {
      PENDING: { variant: 'warning', label: 'Pending' },
      APPROVED: { variant: 'success', label: 'Approved' },
      REJECTED: { variant: 'error', label: 'Rejected' },
      ACTIVE: { variant: 'success', label: 'Active' },
      INACTIVE: { variant: 'neutral', label: 'Inactive' },
      PRESENT: { variant: 'success', label: 'Present' },
      ABSENT: { variant: 'error', label: 'Absent' },
      LATE: { variant: 'warning', label: 'Late' },
      HALF_DAY: { variant: 'info', label: 'Half Day' },
    };

  const config = statusConfig[status];
  if (!config) {
    return <Badge variant="neutral">{status}</Badge>;
  }
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
