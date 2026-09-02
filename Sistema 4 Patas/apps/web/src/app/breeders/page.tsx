"use client";

import React, { useState } from 'react';
import { Shield, GitCommit, GitBranch, Star, MapPin, Award, Users, Plus, Loader2, X, CheckCircle2 } from 'lucide-react';

export default function BreedersPage() {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleRegister = () => {
    setShowModal(true);
  };

  const handleSaveBreeder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };
  const breeders = [
    {
      id: 1,
      name: "Kennel Golden Horizon",
      owner: "Carlos Silva",
      location: "São Paulo, SP",
      rating: 4.9,
      litters: 3,
      breeds: ["Golden Retriever", "Labrador"],
      verified: true,
    },
    {
      id: 2,
      name: "Paws & Pedigree",
      owner: "Ana Souza",
      location: "Curitiba, PR",
      rating: 4.8,
      litters: 1,
      breeds: ["German Shepherd"],
      verified: true,
    },
    {
      id: 3,
      name: "Cão Nobre",
      owner: "Roberto Almeida",
      location: "Rio de Janeiro, RJ",
      rating: 4.7,
      litters: 0,
      breeds: ["Pug", "French Bulldog"],
      verified: false,
    }
  ];

  const litters = [
    {
      id: "L-2023-01",
      kennel: "Kennel Golden Horizon",
      sire: "Champion Max (Golden)",
      dam: "Bella (Golden)",
      birthDate: "2023-08-15",
      puppies: 6,
      status: "Disponível",
    },
    {
      id: "L-2023-02",
      kennel: "Paws & Pedigree",
      sire: "Rex (German Shepherd)",
      dam: "Luna (German Shepherd)",
      birthDate: "2023-09-02",
      puppies: 4,
      status: "Reservado",
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      <div 
        className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
          showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">Criador registrado com sucesso</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Gestão de Canis
          </h1>
          <p className="text-gray-500 mt-2">Gerencie criadores parceiros, ninhadas e pedigrees.</p>
        </div>
        <button onClick={handleRegister} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Novo Criador</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            Criadores Parceiros
          </h2>
          
          <div className="grid gap-4">
            {breeders.map(breeder => (
              <div key={breeder.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        {breeder.name}
                        {breeder.verified && <Award className="w-5 h-5 text-yellow-500" />}
                      </h3>
                      <p className="text-sm text-gray-500">{breeder.owner}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">{breeder.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {breeder.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitCommit className="w-4 h-4 text-gray-400" />
                      {breeder.litters} Ninhadas Ativas
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {breeder.breeds.map(breed => (
                      <span key={breed} className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {breed}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-indigo-500" />
              Ninhadas Ativas
            </h2>
            <div className="space-y-4">
              {litters.map(litter => (
                <div key={litter.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-800">{litter.id}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${litter.status === 'Disponível' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {litter.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Canil:</span> {litter.kennel}</p>
                    <p><span className="font-medium">Pai:</span> {litter.sire}</p>
                    <p><span className="font-medium">Mãe:</span> {litter.dam}</p>
                    <div className="pt-2 flex justify-between border-t border-gray-50 mt-2">
                      <span className="text-gray-500">{litter.birthDate}</span>
                      <span className="font-medium text-indigo-600">{litter.puppies} Filhotes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">Análise de Pedigree</h3>
            <p className="text-indigo-100 text-sm mb-4">Veja a linhagem genética e atestados de saúde para cães registrados.</p>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 text-sm">
                <GitBranch className="w-5 h-5" />
                <span>3 Gerações</span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-indigo-200">Sistema Pronto</span>
                <button className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
                  Abrir Visualizador
                </button>
              </div>
            </div>
          </section>
        </div>

      </div>

      {/* Modal Novo Criador */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Novo Criador</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBreeder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" required placeholder="Nome do criador ou canil" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                <input type="text" required placeholder="Ex: Golden Retriever, Pug" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                <input type="text" required placeholder="(00) 00000-0000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
