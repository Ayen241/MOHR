import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
}

export function FormField({ label, error, children, required, fullWidth = true }: FormFieldProps) {
  return (
    <div className={`form-group ${fullWidth ? 'w-full' : ''}`}>
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
