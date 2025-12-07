'use client';

import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { Button } from './button';

export type DialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export interface DialogProps {
  isOpen: boolean;
  type?: DialogType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
}

const iconMap = {
  info: <AlertCircle className="text-blue-600" size={32} />,
  success: <Check className="text-green-600" size={32} />,
  warning: <AlertCircle className="text-amber-600" size={32} />,
  error: <X className="text-red-600" size={32} />,
  confirm: <AlertCircle className="text-moss-600" size={32} />,
};

export function Dialog({
  isOpen,
  type = 'confirm',
  title,
  message,
  onClose,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading,
  isDangerous,
}: DialogProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm mx-4 p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">{iconMap[type]}</div>

        {/* Content */}
        <h2 className="text-lg font-bold text-moss-900 text-center mb-2">
          {title}
        </h2>
        <p className="text-moss-600 text-center mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            onClick={handleConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
