import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 focus:outline-none">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
