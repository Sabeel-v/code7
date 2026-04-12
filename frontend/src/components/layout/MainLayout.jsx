import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
  const [isMobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 dark:bg-dark-bg min-h-screen font-sans w-full">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300 w-full overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
