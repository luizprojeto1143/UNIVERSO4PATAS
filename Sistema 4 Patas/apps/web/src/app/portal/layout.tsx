"use client";
import { Button } from '@/components/ui/button';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, PawPrint, CalendarPlus, Receipt, Headset, Menu, User, Bell } from 'lucide-react';
import { useState } from 'react';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Se for a tela de login, não mostra os menus
  if (pathname === '/portal/login') {
    return <div className="bg-slate-50 min-h-screen">{children}</div>;
  }

  const navItems = [
    { name: 'Início', href: '/portal', icon: <Home className="w-6 h-6" /> },
    { name: 'Meus Pets', href: '/portal/pets', icon: <PawPrint className="w-6 h-6" /> },
    { name: 'Agendar', href: '/portal/schedule', icon: <CalendarPlus className="w-6 h-6" /> },
    { name: 'Financeiro', href: '/portal/financial', icon: <Receipt className="w-6 h-6" /> }, 
    { name: 'Atendimento', href: '/portal/chat', icon: <Headset className="w-6 h-6" /> },
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-indigo-100">
      
      {/* Top Bar (Mobile & Desktop) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md md:max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg text-slate-800 tracking-tight">Clínica 4 Patas</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button className="text-slate-400 hover:text-indigo-600 relative transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </Button>
            <Button className="md:hidden text-slate-400 hover:text-slate-800" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              <Link href="/portal/profile">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 hover:bg-indigo-100 cursor-pointer">
                  RC
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md md:max-w-4xl mx-auto pb-24 md:pb-8">
        {children}
      </main>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/portal');
            return (
              <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side/Top Nav Alternative (Simplificada para foco no conteúdo) */}
      {/* Como o foco é Mobile-First, mantemos a view parecida no desktop, centrada */}

    </div>
  );
}
