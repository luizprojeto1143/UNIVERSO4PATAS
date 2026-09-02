"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CreatePatientModal from './CreatePatientModal';
import Cookies from 'js-cookie';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [permissions, setPermissions] = useState<string[]>(['admin']);

  useEffect(() => {
    try {
      const storedUserStr = localStorage.getItem('user');
      if (storedUserStr) {
        const userObj = JSON.parse(storedUserStr);
        if (userObj.permissions && Array.isArray(userObj.permissions)) {
          setPermissions(userObj.permissions);
          return;
        }
      }
      setPermissions(['admin', 'manage_clinical', 'manage_inventory', 'view_appointments', 'manage_appointments']);
    } catch (e) {
      setPermissions(['admin']);
    }
  }, []);

  const menuItems = [
    { name: 'Painel Inicial', href: '/', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    )},
    { name: 'Agenda & Consultas', href: '/appointments', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    )},
    { name: 'Pacientes & Tutores', href: '/patients', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    )},
    { name: 'Internação (UTI)', href: '/hospitalization', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4M8 10h8M12 6v8M12 2a4 4 0 100 8 4 4 0 000-8z"></path></svg>
    )},
    { name: 'Estoque & Controlados', href: '/inventory', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
    )},
    { name: 'Financeiro & Comissões', href: '/financial', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    )},
    { name: 'PDV / Caixa', href: '/financial/pdv', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    )},
    { name: 'Equipe & Permissões', href: '/settings/roles', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
    )},
    { name: 'Catálogo de Serviços', href: '/catalog', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
    )},
    { name: 'Laboratório & Exames', href: '/laboratory', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
    )},
    { name: 'Documentos & Atestados', href: '/documents', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
    )},
    { name: 'Marketing & CRM', href: '/marketing', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
    )},
    { name: 'Configurações', href: '/settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    )},
  ];

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <div className={`flex flex-col transition-all duration-300 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 min-h-screen relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}>
        
        {/* Header com Botão de Recolher Sidebar */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-slate-100/60">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight whitespace-nowrap">
                Sistema 4 Patas
              </span>
            </Link>
          )}

          {isCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
            </div>
          )}

          {/* Botão de Toggle Recolher / Expandir Painel */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors shadow-sm"
            title={isCollapsed ? "Expandir Painel" : "Recolher Painel"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Botão Novo Paciente */}
        <div className="p-3 border-b border-slate-100/50">
          <button 
            onClick={() => setIsModalOpen(true)}
            title="Novo Paciente"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-3 rounded-2xl font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            {!isCollapsed && <span className="truncate">Novo Paciente</span>}
          </button>
        </div>

        {/* Menu de Navegação */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link key={item.name} href={item.href} title={isCollapsed ? item.name : undefined}>
                  <div className={`flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm border border-indigo-100/50' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 font-medium'
                  }`}>
                    <div className={`transition-transform duration-200 shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </div>
                    {!isCollapsed && <span className="truncate text-sm">{item.name}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-100/50 mt-auto">
          <button 
            onClick={handleLogout}
            title={isCollapsed ? "Sair do Sistema" : undefined}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            {!isCollapsed && <span className="truncate">Sair do Sistema</span>}
          </button>
        </div>
      </div>
      
      <CreatePatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
