'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, LogIn, LogOut, Clock } from 'lucide-react';

interface AttendanceConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'checkin' | 'checkout';
  currentTime: string;
}

export default function AttendanceConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  currentTime,
}: AttendanceConfirmationModalProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdDuration = 2000; // 2 seconds
  const progressUpdateInterval = 20; // Update every 20ms for smooth animation

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setIsHolding(false);
      setProgress(0);
      clearTimers();
    }
  }, [isOpen]);

  const clearTimers = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleMouseDown = () => {
    setIsHolding(true);
    setProgress(0);

    // Start progress animation
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(newProgress);
    }, progressUpdateInterval);

    // Set timer for confirmation
    holdTimerRef.current = setTimeout(() => {
      onConfirm();
      clearTimers();
      setIsHolding(false);
      setProgress(0);
    }, holdDuration);
  };

  const handleMouseUp = () => {
    if (progress < 100) {
      // User released too early
      clearTimers();
      setIsHolding(false);
      setProgress(0);
    }
  };

  const handleCancel = () => {
    clearTimers();
    setIsHolding(false);
    setProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  const isCheckIn = type === 'checkin';
  const icon = isCheckIn ? <LogIn size={32} /> : <LogOut size={32} />;
  const title = isCheckIn ? 'Check In' : 'Check Out';
  const message = isCheckIn
    ? 'You are about to check in for today. This will record your arrival time.'
    : 'You are about to check out. This will end your work session for today.';
  const buttonColor = isCheckIn ? 'moss' : 'red';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        onClick={handleCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        {/* Header with gradient */}
        <div
          className={`px-8 py-6 bg-gradient-to-r ${
            isCheckIn
              ? 'from-moss-500 to-moss-600'
              : 'from-red-500 to-red-600'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <h2 className="text-2xl font-bold">{title} Confirmation</h2>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Close"
            >
              <X size={24} className="text-moss-900" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Current Time Display */}
          <div className="flex items-center justify-center gap-3 p-4 bg-moss-50 rounded-2xl border-2 border-moss-100">
            <Clock size={24} className="text-moss-600" />
            <div className="text-center">
              <p className="text-sm text-moss-600 font-semibold">Current Time</p>
              <p className="text-2xl font-bold text-moss-900">{currentTime}</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-center text-moss-800 text-lg">{message}</p>

          {/* Instructions */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 text-center font-semibold">
              ⚠️ Hold the button below for 2 seconds to confirm
            </p>
          </div>

          {/* Hold to Confirm Button */}
          <div className="space-y-3">
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className={`relative w-full py-4 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all ${
                isHolding ? 'scale-95' : 'scale-100'
              } ${
                isCheckIn
                  ? 'bg-moss-600 hover:bg-moss-700'
                  : 'bg-red-600 hover:bg-red-700'
              } shadow-lg hover:shadow-xl`}
            >
              {/* Progress Bar */}
              <div
                className="absolute inset-0 bg-white bg-opacity-30 transition-all"
                style={{
                  width: `${progress}%`,
                  transition: 'width 20ms linear',
                }}
              ></div>

              {/* Button Text */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {icon}
                {isHolding
                  ? `Hold to ${title}... ${Math.ceil((100 - progress) / 50)}s`
                  : `Hold to ${title}`}
              </span>
            </button>

            {/* Progress Indicator */}
            {isHolding && (
              <div className="text-center text-sm text-moss-600 font-semibold animate-pulse">
                Keep holding... {Math.ceil(progress)}%
              </div>
            )}
          </div>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
