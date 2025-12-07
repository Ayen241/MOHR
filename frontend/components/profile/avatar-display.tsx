'use client';

import React from 'react';
import { User } from 'lucide-react';

interface AvatarDisplayProps {
  avatar?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AvatarDisplay({
  avatar,
  name = 'User',
  size = 'md',
  className = '',
}: AvatarDisplayProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 32,
  };

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-linear-to-br from-moss-400 to-moss-500 flex items-center justify-center text-white overflow-hidden shadow-sm ${className}`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {initials ? (
            <span className="text-xs font-semibold">{initials}</span>
          ) : (
            <User size={iconSizes[size]} />
          )}
        </div>
      )}
    </div>
  );
}
