"use client";

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ClientLayout({ children, hideSidebar = false }: { children: React.ReactNode, hideSidebar?: boolean }) {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname?.startsWith('/pwa')) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden relative">
      {/* Decorative subtle background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-purple-100/40 rounded-full blur-[100px]" />
      </div>

      {!hideSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-6 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
