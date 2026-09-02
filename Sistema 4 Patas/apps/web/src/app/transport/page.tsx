"use client";

import React, { useState } from 'react';
import { Truck, Map, Calendar, Clock, MapPin, CheckCircle, AlertCircle, Navigation, Loader2, Check } from 'lucide-react';

export default function TransportDashboard() {
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAssign = (idx: number) => {
    if (assignedIds.includes(idx)) return;
    setAssigningId(idx);
    setTimeout(() => {
      setAssigningId(null);
      setAssignedIds((prev) => [...prev, idx]);
      alert("Motorista atribuído com sucesso a esta solicitação!");
    }, 500);
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Táxi Dog e Transporte</h1>
          <p className="text-gray-500 mt-1">Gerencie horários de motoristas, rotas e coletas pendentes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Map className="w-5 h-5" />
          Nova Rota
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Veículos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">4/5</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Viagens Concluídas</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Coletas Pendentes</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-500" />
              Rotas Ativas
            </h2>
            <div className="space-y-4">
              {[
                { driver: 'Carlos M.', vehicle: 'Van 01', status: 'Em Trânsito', nextStop: 'Rua das Flores, 123', eta: '10 min' },
                { driver: 'Ana P.', vehicle: 'Van 02', status: 'No Local', nextStop: 'Av. Paulista, 1000', eta: 'Agora' },
              ].map((route, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 gap-4 cursor-pointer bg-white">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${route.status === 'Em Trânsito' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{route.driver} - {route.vehicle}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        Próximo: {route.nextStop}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${route.status === 'Em Trânsito' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {route.status}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-2 flex items-center gap-1.5 justify-end">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        Prev: {route.eta}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Escala de Motoristas
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/80">
                  <tr>
                    <th className="px-5 py-4 font-medium">Motorista</th>
                    <th className="px-5 py-4 font-medium">Turno</th>
                    <th className="px-5 py-4 font-medium">Veículo</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">Carlos M.</td>
                    <td className="px-5 py-4 text-gray-500">08:00 - 16:00</td>
                    <td className="px-5 py-4 text-gray-500">Van 01</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full text-xs"><CheckCircle className="w-3 h-3"/> Em Serviço</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">Ana P.</td>
                    <td className="px-5 py-4 text-gray-500">09:00 - 17:00</td>
                    <td className="px-5 py-4 text-gray-500">Van 02</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full text-xs"><CheckCircle className="w-3 h-3"/> Em Serviço</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">Roberto S.</td>
                    <td className="px-5 py-4 text-gray-500">14:00 - 22:00</td>
                    <td className="px-5 py-4 text-gray-500">Van 03</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full text-xs"><Clock className="w-3 h-3"/> Fora de Serviço</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Solicitações Pendentes</h2>
            <div className="space-y-4">
              {[
                { pet: 'Max (Golden)', owner: 'Julia', address: 'Rua Augusta, 500', time: '14:30', type: 'Coleta' },
                { pet: 'Bella (Poodle)', owner: 'Marcos', address: 'Av. Brasil, 200', time: '15:00', type: 'Entrega' },
                { pet: 'Thor (Bulldog)', owner: 'Luiz', address: 'Rua Oscar Freire, 100', time: '16:15', type: 'Coleta' },
              ].map((req, idx) => (
                <div key={idx} className="p-4 border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{req.pet}</h4>
                      <p className="text-xs text-gray-500">{req.owner}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${req.type === 'Coleta' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                      {req.type}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-gray-600 mt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{req.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{req.time}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAssign(idx)}
                    disabled={assignedIds.includes(idx) || assigningId === idx}
                    className={`w-full mt-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2
                      ${assignedIds.includes(idx) 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm hover:shadow'}`}
                  >
                    {assigningId === idx ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Atribuindo...</>
                    ) : assignedIds.includes(idx) ? (
                      <><Check className="w-4 h-4" /> Atribuído</>
                    ) : (
                      'Atribuir Motorista'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modal Nova Rota */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Criar Nova Rota</h2>
            <form onSubmit={handleSaveRoute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet</label>
                <input type="text" required placeholder="Nome do Pet" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motorista</label>
                <select required className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option value="">Selecione um motorista</option>
                  <option value="carlos">Carlos M.</option>
                  <option value="ana">Ana P.</option>
                  <option value="roberto">Roberto S.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Coleta/Entrega)</label>
                <input type="text" required placeholder="Endereço completo" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input type="time" required className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Salvando..." : "Salvar Rota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast de Sucesso */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl shadow-lg border border-emerald-100 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Rota criada com sucesso!</span>
        </div>
      )}
    </div>
  );
}
