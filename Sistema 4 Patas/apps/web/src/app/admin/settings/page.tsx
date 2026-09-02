"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Configurações da Clínica</h1>
          <p className="text-gray-500 mt-1">Gerencie os cadastros base e informações do sistema</p>
        </div>
        {showSuccess && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 shadow-sm flex items-center transition-all duration-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Configurações salvas com sucesso!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Gerais</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Clínica</label>
                  <input type="text" defaultValue="Sistema 4 Patas Vet" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <input type="text" defaultValue="00.000.000/0001-00" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Principal</label>
                  <input type="text" defaultValue="Rua dos Animais, 123 - Centro" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-70 flex items-center"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </>
                  ) : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </span>
              Clínica
            </h2>
            <div className="space-y-3">
              <Link href="/admin/settings" className="block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">Espécies e Raças</Link>
              <Link href="/admin/settings" className="block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">Cores de Pelagem</Link>
              <Link href="/admin/settings" className="block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">Alertas Clínicos</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </span>
              Comercial
            </h2>
            <div className="space-y-3">
              <Link href="/admin/settings" className="block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">Serviços e Valores</Link>
              <Link href="/admin/settings" className="block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">Produtos e Estoque</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
