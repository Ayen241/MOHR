'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PanelType = 'home' | 'attendance' | 'leave' | 'employees' | 'rooms' | 'reports' | 'settings';

interface DashboardContextType {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activePanel, setActivePanel] = useState<PanelType>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check for saved panel on mount
  useEffect(() => {
    const savedPanel = sessionStorage.getItem('dashboardPanel');
    if (savedPanel) {
      setActivePanel(savedPanel as PanelType);
      sessionStorage.removeItem('dashboardPanel');
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ activePanel, setActivePanel, sidebarOpen, setSidebarOpen }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
