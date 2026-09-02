'use client';

import React, { useState } from 'react';
import { Search, Cpu, Dog, Cat, Calendar, CheckCircle2, Plus, X, Loader2 } from 'lucide-react';

const RECENT_REGISTRATIONS = [
  { id: 1, chip: '985141002019483', name: 'Max', species: 'Cachorro', breed: 'Golden Retriever', date: '05/08/2026' },
  { id: 2, chip: '977200008892104', name: 'Luna', species: 'Gato', breed: 'Siamês', date: '05/08/2026' },
  { id: 3, chip: '990000003291114', name: 'Bella', species: 'Cachorro', breed: 'Bulldog Francês', date: '04/08/2026' },
];

export default function MicrochipsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsModalOpen(false);
      setToast({ show: true, message: 'Microchip registrado com sucesso!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 relative">
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-emerald-500/90 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-sm z-50 animate-in slide-in-from-bottom-5">
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Registrar Microchip</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Animal (Pet)</label>
                <input required className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" placeholder="Nome do pet" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número do Chip</label>
                <input required className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" placeholder="15 dígitos numéricos" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
                <input required className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" placeholder="Ex: Allflex, Virbac" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input type="date" required className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium min-w-[120px] flex justify-center">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Registro de Microchips</h1>
            </div>
            <p className="text-gray-500">Busque e gerencie microchips de pets com padrão ISO de 15 dígitos.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Registrar Microchip
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Search className="h-32 w-32" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Buscar Microchip</h2>
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Digite o número do microchip de 15 dígitos..."
                className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                maxLength={15}
              />
              <button className="absolute right-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                Buscar
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              Suporta todos os microchips padrão ISO 11784/11785
            </p>
          </div>
        </div>

        {/* Recent Registrations Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Registrados Recentemente</h2>
          <div className="grid gap-4">
            {RECENT_REGISTRATIONS.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-500 font-medium">
                Nenhum registro encontrado.
              </div>
            ) : (
              RECENT_REGISTRATIONS.map((pet) => (
                <div key={pet.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                      {pet.species === 'Cachorro' ? <Dog className="h-6 w-6 text-gray-400" /> : <Cat className="h-6 w-6 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-500">{pet.breed}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex flex-col items-end">
                    <div className="flex items-center space-x-2 text-sm font-mono text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                      <Cpu className="h-4 w-4" />
                      <span>{pet.chip}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {pet.date}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
