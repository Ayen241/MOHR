'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut, User, ChevronDown, Leaf, Settings } from 'lucide-react';
import AvatarDisplay from '@/components/profile/avatar-display';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-moss-200 flex items-center justify-between px-6 shadow-md z-50">
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-linear-to-br from-moss-500 to-moss-600 rounded-xl flex items-center justify-center shadow-md">
          <Leaf className="text-white" size={24} />
        </div>
        <div className="hidden md:block">
          <h1 className="text-lg font-bold text-moss-900">MoHR</h1>
          <p className="text-xs text-moss-600">Management of Human Resources</p>
        </div>
      </div>

      {/* User Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-moss-50 rounded-lg transition-colors group"
        >
          <AvatarDisplay
            avatar={session?.user?.image || undefined}
            name={session?.user?.name || 'User'}
            size="md"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-moss-900">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-moss-500">{session?.user?.role}</p>
          </div>
          <ChevronDown
            size={16}
            className={`text-moss-600 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border-2 border-moss-200 shadow-lg overflow-hidden z-50">
            <div className="p-2">
              <button
                onClick={() => {
                  router.push('/profile');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-moss-700 hover:bg-moss-50 rounded-lg transition-colors"
              >
                <User size={18} />
                My Profile
              </button>

              <button
                onClick={() => {
                  router.push('/settings');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-moss-700 hover:bg-moss-50 rounded-lg transition-colors"
              >
                <Settings size={18} />
                Settings
              </button>

              <hr className="my-2 border-moss-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
