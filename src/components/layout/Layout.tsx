import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FcmBridge } from './FcmBridge';
import { RealtimeBridge } from './RealtimeBridge';

export const Layout: React.FC = () => {
  return (
    <div className="h-screen h-[100dvh] w-screen w-[100dvw] flex overflow-hidden bg-[var(--color-brand-ink)] text-[var(--color-brand-cream)]">
      <FcmBridge />
      <RealtimeBridge />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-8 bg-[var(--color-brand-ink)] flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
