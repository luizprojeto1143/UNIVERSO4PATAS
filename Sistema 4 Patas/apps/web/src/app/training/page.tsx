'use client';

import React, { useState } from 'react';
import { Search, Plus, Calendar, Activity, CheckCircle2, Clock, MoreVertical, ShieldAlert, Check, Loader2 } from 'lucide-react';

interface Pet {
  id: number;
  name: string;
  breed: string;
  tutor: string;
  status: string;
  progress: number;
  nextClass: string;
  goals: string;
  priority: 'low' | 'medium' | 'high';
}

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCol, setLoadingCol] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [petsList, setPetsList] = useState<Pet[]>([
    {
      id: 1,
      name: 'Rex',
      breed: 'Pastor Alemão',
      tutor: 'Carlos Silva',
      status: 'evaluation',
      progress: 15,
      nextClass: 'Hoje, 14:00',
      goals: 'Avaliação de reatividade',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Golden Retriever',
      tutor: 'Ana Pereira',
      status: 'basic',
      progress: 45,
      nextClass: 'Amanhã, 09:00',
      goals: 'Senta, fica, vem',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Thor',
      breed: 'Border Collie',
      tutor: 'Lucas Mendes',
      status: 'advanced',
      progress: 75,
      nextClass: 'Quinta, 16:30',
      goals: 'Agility & Foco Urbano',
      priority: 'low'
    }
  ]);

  const handleAction = (actionType: string, colId?: string) => {
    if (colId) setLoadingCol(colId);
    else setIsLoading(true);
    
    setTimeout(() => {
      if (colId) setLoadingCol(null);
      else setIsLoading(false);

      if (actionType === 'new') {
        const newPet: Pet = {
          id: Date.now(),
          name: colId === 'basic' ? 'Bolinha' : 'Max',
          breed: 'SRD',
          tutor: 'Tutor Cadastrado',
          status: colId || 'evaluation',
          progress: 10,
          nextClass: 'Amanhã, 10:00',
          goals: 'Treino e Adaptação',
          priority: 'medium'
        };
        setPetsList(prev => [newPet, ...prev]);
        showToast('Novo aluno adicionado com sucesso!');
      } else {
        showToast('Ação realizada com sucesso!');
      }
    }, 600);
  };

  const kanbanColumns = [
    {
      id: 'evaluation',
      title: 'Avaliação Inicial',
      count: 3,
      color: 'bg-yellow-500/10 text-yellow-500',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'basic',
      title: 'Obediência Básica',
      count: 4,
      color: 'bg-blue-500/10 text-blue-500',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'advanced',
      title: 'Treino Avançado',
      color: 'bg-purple-500/10 text-purple-500',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'behavior',
      title: 'Modificação Comportamental',
      color: 'bg-red-500/10 text-red-500',
      borderColor: 'border-red-500/30'
    },
    {
      id: 'graduated',
      title: 'Concluído',
      color: 'bg-green-500/10 text-green-500',
      borderColor: 'border-green-500/30'
    }
  ];

  const renderPetCard = (pet: Pet) => (
    <div key={pet.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-3 shadow-sm hover:shadow-lg hover:border-white/30 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-white tracking-wide">{pet.name}</h4>
          <p className="text-xs text-white/50">{pet.breed}</p>
        </div>
        <button className="text-white/40 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60 font-medium">Progresso</span>
            <span className="text-white font-medium">{pet.progress}%</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${pet.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Calendar size={14} className="text-blue-400" />
          <span className="font-medium">Próx: {pet.nextClass}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Activity size={14} className="text-purple-400" />
          <span className="truncate">{pet.goals}</span>
        </div>
        
        {pet.priority === 'high' && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/30 uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.1)]">
            <ShieldAlert size={12} />
            <span>Atenção Especial</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500/90 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-sm z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-white/20 rounded-full p-1">
            <Check size={16} />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modal Novo Treinamento */}
      {isLoading && !loadingCol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold">Novo Treinamento</h2>
              <button onClick={() => setIsLoading(false)} className="text-slate-400 hover:text-white transition-colors">
                <ShieldAlert className="w-5 h-5 hidden" />
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAction('new'); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Título</label>
                <input required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500" placeholder="Ex: Obediência Básica" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Instrutor</label>
                <input required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500" placeholder="Nome do Instrutor" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Data</label>
                <input type="date" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Modalidade</label>
                <select required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-white">
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsLoading(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors">Cancelar</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium min-w-[120px] transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Adestramento</h1>
          <p className="text-white/60 mt-1">Gestão de treinamento e comportamento canino</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar aluno..." 
              className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsLoading(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-blue-500/20 font-medium"
          >
            <Plus size={18} />
            <span>Novo Treinamento</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Activity className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-white/60 text-sm">Alunos Ativos</p>
              <h3 className="text-2xl font-bold text-white">24</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Calendar className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-white/60 text-sm">Aulas Hoje</p>
              <h3 className="text-2xl font-bold text-white">8</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle2 className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-white/60 text-sm">Aulas Concluídas</p>
              <h3 className="text-2xl font-bold text-white">156</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Clock className="text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-white/60 text-sm">Aulas Pendentes</p>
              <h3 className="text-2xl font-bold text-white">12</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('kanban')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'kanban' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
        >
          Quadro Kanban
          {activeTab === 'kanban' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('agenda')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'agenda' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
        >
          Agenda de Aulas
          {activeTab === 'agenda' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'reports' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
        >
          Relatórios de Evolução
          {activeTab === 'reports' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Main Content - Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px] items-start">
          {kanbanColumns.map(column => (
            <div key={column.id} className="min-w-[320px] w-[320px] flex flex-col gap-4">
              <div className={`flex items-center justify-between p-3 rounded-xl border ${column.borderColor} ${column.color} bg-opacity-50`}>
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-medium">
                  {column.count}
                </span>
              </div>
              
              <div className="flex flex-col min-h-[150px] bg-white/[0.02] rounded-2xl p-2 border border-white/5">
                {petsList.filter(pet => pet.status === column.id).map(pet => renderPetCard(pet))}
                {petsList.filter(pet => pet.status === column.id).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-white/30 text-sm">
                    <p>Nenhum aluno</p>
                  </div>
                )}
                
                <button 
                  onClick={() => handleAction('new', column.id)}
                  disabled={loadingCol === column.id}
                  className="mt-2 w-full py-2 flex items-center justify-center gap-2 text-white/30 hover:text-white/70 hover:bg-white/5 rounded-lg transition-colors border border-dashed border-white/10 hover:border-white/30 text-sm font-medium disabled:opacity-50"
                >
                  {loadingCol === column.id ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== 'kanban' && (
        <div className="flex flex-col items-center justify-center h-64 bg-white/5 border border-white/10 rounded-3xl">
          <Activity className="text-white/20 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white/60">Em desenvolvimento</h3>
          <p className="text-white/40 mt-2">Esta visualização estará disponível em breve.</p>
        </div>
      )}
    </div>
  );
}
