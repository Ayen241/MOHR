'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary:
    'bg-moss-500 text-white hover:bg-moss-600 disabled:bg-moss-400',
  secondary:
    'bg-sage-500 text-white hover:bg-sage-600 disabled:bg-sage-400',
  outline:
    'border-2 border-moss-500 text-moss-600 hover:bg-moss-50 disabled:opacity-50',
  danger:
    'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-500',
  ghost: 'text-moss-600 hover:bg-moss-50 disabled:opacity-50',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${
        variantStyles[variant]
      } ${sizeStyles[size]} disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
      )}
      {children}
    </button>
  );
}
