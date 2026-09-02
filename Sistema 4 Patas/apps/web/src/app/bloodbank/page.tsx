"use client";

import React, { useState } from 'react';
import { 
  Droplet, 
  Search, 
  Plus, 
  Heart, 
  Activity, 
  AlertCircle,
  Clock,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react';

const BloodTypeBadge = ({ type }: { type: string }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-gradient-to-br from-red-50 to-white text-red-700 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
    <Droplet className="w-3 h-3 mr-1.5 text-red-500" />
    {type}
  </span>
);

export default function BloodBankPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isSavingDonation, setIsSavingDonation] = useState(false);

  // Form states
  const [donor, setDonor] = useState('');
  const [bloodType, setBloodType] = useState('DEA 1.1 Positivo');
  const [volume, setVolume] = useState('');
  const [date, setDate] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveDonation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDonation(true);
    setTimeout(() => {
      setIsSavingDonation(false);
      setShowDonationModal(false);
      showToast('Doação registrada com sucesso!');
      setDonor('');
      setBloodType('DEA 1.1 Positivo');
      setVolume('');
      setDate('');
    }, 1500);
  };

  const handleNewRequest = () => {
    setIsSubmittingRequest(true);
    setTimeout(() => {
      setIsSubmittingRequest(false);
      showToast('Solicitação de sangue enviada com sucesso!');
    }, 500);
  };

  const inventory = [
    { type: 'DEA 1.1 Positivo', stock: 12, status: 'Saudável', lastUpdated: '2 horas atrás' },
    { type: 'DEA 1.1 Negativo', stock: 3, status: 'Baixo', lastUpdated: '1 hora atrás' },
    { type: 'DEA 4', stock: 8, status: 'Saudável', lastUpdated: '5 horas atrás' },
    { type: 'Felino Tipo A', stock: 5, status: 'Adequado', lastUpdated: '1 dia atrás' },
    { type: 'Felino Tipo B', stock: 1, status: 'Crítico', lastUpdated: '30 min atrás' },
  ];

  const donorPets = [
    { id: 1, name: 'Max', species: 'Cachorro', breed: 'Golden Retriever', bloodType: 'DEA 1.1 Positivo', lastDonation: '2026-06-15' },
    { id: 2, name: 'Luna', species: 'Gato', breed: 'Siamês', bloodType: 'Felino Tipo A', lastDonation: '2026-07-20' },
    { id: 3, name: 'Buddy', species: 'Cachorro', breed: 'Pastor Alemão', bloodType: 'DEA 1.1 Negativo', lastDonation: '2026-05-10' },
  ];

  const pendingRequests = [
    { id: 'REQ-001', patient: 'Bella', type: 'Felino Tipo B', urgency: 'Crítico', status: 'Aguardando compatibilidade' },
    { id: 'REQ-002', patient: 'Charlie', type: 'DEA 1.1 Negativo', urgency: 'Alta', status: 'Preparando' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Nova Doação Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Droplet className="h-5 w-5 text-red-500" />
                Nova Doação
              </h2>
              <button 
                onClick={() => setShowDonationModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveDonation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Doador (Nome do Pet)</label>
                <input 
                  type="text"
                  required
                  value={donor}
                  onChange={(e) => setDonor(e.target.value)}
                  placeholder="Ex: Max"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Sanguíneo</label>
                <select 
                  required
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors bg-white"
                >
                  <option>DEA 1.1 Positivo</option>
                  <option>DEA 1.1 Negativo</option>
                  <option>DEA 4</option>
                  <option>Felino Tipo A</option>
                  <option>Felino Tipo B</option>
                  <option>Felino Tipo AB</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Volume (ml)</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="Ex: 250"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSavingDonation}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isSavingDonation ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isSavingDonation ? 'Salvando...' : 'Salvar Doação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Droplet className="h-8 w-8 text-red-500" />
            Banco de Sangue Veterinário
          </h1>
          <p className="text-slate-500 mt-1">Gerencie o estoque de sangue, doadores e solicitações de transfusão</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleNewRequest}
            disabled={isSubmittingRequest}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {isSubmittingRequest ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
            {isSubmittingRequest ? 'Enviando...' : 'Solicitar Sangue'}
          </button>
          <button 
            onClick={() => setShowDonationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-xl text-white hover:bg-red-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Nova Doação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Droplet className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Bolsas</p>
            <p className="text-2xl font-bold text-slate-900">29</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Heart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Doadores Ativos</p>
            <p className="text-2xl font-bold text-slate-900">145</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Activity className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Transfusões Pendentes</p>
            <p className="text-2xl font-bold text-slate-900">2</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Droplet className="h-5 w-5 text-slate-500" />
              Estoque de Sangue
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {inventory.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">Nenhum registro encontrado</div>
            ) : (
              inventory.map((item, index) => (
                <div key={index} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <BloodTypeBadge type={item.type} />
                    <p className="text-sm text-slate-500 mt-2">Atualizado {item.lastUpdated}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">{item.stock} bolsas</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                      ${item.status === 'Saudável' ? 'bg-emerald-100 text-emerald-800' : 
                        item.status === 'Adequado' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'Baixo' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Solicitações de Transfusão Pendentes
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium">Nenhum registro encontrado</div>
              ) : (
                pendingRequests.map((req, index) => (
                  <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-slate-900">{req.patient} <span className="text-sm text-slate-500 font-normal">({req.id})</span></p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-slate-600">Requer:</span> 
                          <BloodTypeBadge type={req.type} />
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${req.urgency === 'Crítico' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {req.urgency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                      <Clock className="h-4 w-4" />
                      Status: {req.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Heart className="h-5 w-5 text-slate-500" />
                Doadores Recentes
              </h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Ver todos</button>
            </div>
            <div className="divide-y divide-slate-100">
              {donorPets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium">Nenhum registro encontrado</div>
              ) : (
                donorPets.map((pet, index) => (
                  <div key={index} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {pet.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{pet.name} <span className="text-sm text-slate-500 font-normal">- {pet.breed}</span></p>
                        <div className="mt-1">
                          <BloodTypeBadge type={pet.bloodType} />
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <p>Última Doação</p>
                      <p className="font-medium text-slate-700">{pet.lastDonation}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
