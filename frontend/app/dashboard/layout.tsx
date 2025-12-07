'use client';

import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';
import { DashboardProvider, useDashboard } from './DashboardContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useDashboard();

  return (
    <div className="min-h-screen bg-linear-to-b from-moss-50 to-white">
      {/* Header */}
      <Header />

      {/* Main content area with sidebar */}
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Page content - responsive margin based on sidebar */}
        <main 
          className={`flex-1 overflow-y-auto ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
          style={{
            transition: 'margin-left 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardContent>{children}</DashboardContent>
    </DashboardProvider>
  );
}
