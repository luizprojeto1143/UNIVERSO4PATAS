"use client";

import React, { useState } from 'react';
import { 
  Flame, 
  CalendarDays, 
  Flower2, 
  Box, 
  Search,
  Plus,
  Heart,
  CheckCircle2,
  Loader2,
  Info,
  X
} from 'lucide-react';

export default function FuneralServicesPage() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSchedule = () => {
    setShowModal(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setShowModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const handleActionClick = (actionName: string) => {
    alert(`${actionName} action triggered.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      <div 
        className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
          showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">Serviço agendado com sucesso</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Flame className="w-8 h-8 text-indigo-600 drop-shadow-sm" />
            Crematório e Memorial
          </h1>
          <p className="text-gray-500 mt-1">Gerencie serviços póstumos com cuidado e dignidade.</p>
        </div>
        <button 
          onClick={handleSchedule}
          disabled={isScheduling}
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-200 flex items-center gap-2 transition-all"
        >
          {isScheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          {isScheduling ? 'Agendando...' : 'Agendar Serviço'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 ring-4 ring-indigo-50/50">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Agendados Hoje</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600 ring-4 ring-rose-50/50">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Em Andamento</p>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 ring-4 ring-amber-50/50">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Urnas Disponíveis</p>
            <p className="text-2xl font-bold text-gray-900">28</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 ring-4 ring-emerald-50/50">
            <Flower2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Memoriais Planejados</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
              <h2 className="text-xl font-semibold text-gray-900">Programação de Hoje</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar serviços..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 transition-all"
                />
              </div>
            </div>
            
            <div className="divide-y divide-gray-50 flex-1">
              {[
                { time: '09:00 AM', name: 'Max', species: 'Golden Retriever', type: 'Cremação Individual', owner: 'Sarah Johnson', status: 'concluído' },
                { time: '11:30 AM', name: 'Luna', species: 'Siamese', type: 'Serviço Memorial', owner: 'Mike Davis', status: 'em andamento' },
                { time: '02:00 PM', name: 'Charlie', species: 'Beagle', type: 'Cremação Coletiva', owner: 'Emma Wilson', status: 'agendado' },
                { time: '04:00 PM', name: 'Bella', species: 'Persian', type: 'Cremação Individual', owner: 'Tom Brown', status: 'agendado' },
              ].map((service, i) => (
                <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors group">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="text-sm font-semibold text-gray-500 w-20 pt-1 sm:pt-0">
                      {service.time}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
                        <span className="text-sm text-gray-400">({service.species})</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${
                          service.status === 'concluído' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          service.status === 'em andamento' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="font-medium text-gray-700">{service.type}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        Família: {service.owner}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleActionClick(`Ver detalhes de ${service.name}`)}
                    className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 self-start sm:self-auto"
                  >
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Inventory & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-gray-200 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Box className="w-5 h-5 text-gray-400" />
              Inventário de Urnas
            </h2>
            <div className="space-y-5">
              {[
                { name: 'Madeira Padrão', stock: 12, status: 'good' },
                { name: 'Cerâmica Premium', stock: 5, status: 'low' },
                { name: 'Ecológica', stock: 8, status: 'good' },
                { name: 'Personalizada', stock: 3, status: 'low' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{item.name}</span>
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-semibold text-gray-600">{item.stock}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'low' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => handleActionClick('Gerenciar Inventário')}
              className="w-full mt-6 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              Gerenciar Inventário
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 via-indigo-50/50 to-purple-50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-indigo-100/80 rounded-xl shadow-sm">
                  <Heart className="w-5 h-5 text-indigo-700" />
                </div>
                <h3 className="font-semibold text-indigo-950 text-lg">Apoio ao Luto</h3>
              </div>
              <p className="text-sm text-indigo-900/80 mb-6 leading-relaxed">
                Acesse recursos, apoio psicológico e contatos de aconselhamento para ajudar as famílias durante o momento de perda.
              </p>
              <button 
                onClick={() => handleActionClick('Ver Recursos')}
                className="w-full bg-white text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100 hover:border-transparent flex items-center justify-center gap-2"
              >
                <Info className="w-4 h-4" />
                Ver Recursos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Novo Registro */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Novo Registro</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet</label>
                <input type="text" required placeholder="Nome do pet" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tutor</label>
                <input type="text" required placeholder="Nome do tutor" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                  <option>Cremação Individual</option>
                  <option>Cremação Coletiva</option>
                  <option>Serviço Memorial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isScheduling} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  {isScheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isScheduling ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
