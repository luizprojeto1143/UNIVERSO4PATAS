"use client";

import React, { useState } from 'react';
import { Scissors, Calendar, Clock, Bath, CheckCircle, Dog, Cat, User, Plus, ArrowRight, Loader2, Check, X } from 'lucide-react';

type QueueStage = 'espera' | 'banho' | 'tosa' | 'pronto';

interface QueueItem {
  id: number;
  name: string;
  breed: string;
  stage: QueueStage;
  staff?: string;
  time?: string;
  isProcessing?: boolean;
}

export default function GroomingPage() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleNewAppointment = () => {
    setShowModal(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setShowModal(false);
      showToast("Agendamento criado com sucesso!");
    }, 1000);
  };

  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 1, name: 'Bolinha', breed: 'Poodle', stage: 'espera' },
    { id: 2, name: 'Thor', breed: 'Bulldog', stage: 'banho', staff: 'Ana', time: 'Há 15 min' },
    { id: 3, name: 'Luna', breed: 'Shih Tzu', stage: 'tosa', staff: 'Carlos', time: 'Há 30 min' },
    { id: 4, name: 'Mel', breed: 'Beagle', stage: 'pronto' },
  ]);

  const advanceQueue = (id: number) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, isProcessing: true } : item));
    setTimeout(() => {
      setQueue(prev => prev.map(item => {
        if (item.id === id) {
          let nextStage: QueueStage = 'espera';
          if (item.stage === 'espera') nextStage = 'banho';
          else if (item.stage === 'banho') nextStage = 'tosa';
          else if (item.stage === 'tosa') nextStage = 'pronto';
          return { ...item, stage: nextStage, isProcessing: false, time: 'Agora mesmo', staff: item.staff || 'Equipe' };
        }
        return item;
      }));
      showToast("Status atualizado!");
    }, 600);
  };

  const finishItem = (id: number) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, isProcessing: true } : item));
    setTimeout(() => {
      setQueue(prev => prev.filter(item => item.id !== id));
      showToast("Pet entregue ao tutor!");
    }, 600);
  };

  const renderQueueItem = (item: QueueItem) => {
    const stageConfigs = {
      espera: {
        color: 'yellow',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        badgeBg: 'bg-yellow-100',
        icon: <Clock className="w-4 h-4 text-yellow-600" />,
        label: 'Em Espera',
        nextLabel: 'Iniciar Banho',
        action: () => advanceQueue(item.id)
      },
      banho: {
        color: 'blue',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badgeBg: 'bg-blue-100',
        icon: <Bath className="w-4 h-4 text-blue-600 animate-pulse" />,
        label: 'No Banho',
        nextLabel: 'Mover p/ Tosa',
        action: () => advanceQueue(item.id)
      },
      tosa: {
        color: 'purple',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badgeBg: 'bg-purple-100',
        icon: <Scissors className="w-4 h-4 text-purple-600 animate-pulse" />,
        label: 'Na Tosa',
        nextLabel: 'Finalizar',
        action: () => advanceQueue(item.id)
      },
      pronto: {
        color: 'green',
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        badgeBg: 'bg-green-100',
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        label: 'Pronto',
        nextLabel: 'Entregar Pet',
        action: () => finishItem(item.id)
      }
    };

    const config = stageConfigs[item.stage];

    return (
      <div key={item.id} className={`p-4 rounded-xl border transition-all duration-300 ${config.bg} ${config.border} hover:shadow-md relative overflow-hidden group`}>
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-bold uppercase tracking-wider ${config.text} ${config.badgeBg} px-2 py-1 rounded-md`}>
            {config.label}
          </span>
          {config.icon}
        </div>
        <div className="font-medium text-gray-900">{item.name} <span className="text-sm font-normal text-gray-500">({item.breed})</span></div>
        <div className="text-sm text-gray-600 mt-1">
          {item.stage === 'espera' ? 'Aguardando início' : item.stage === 'pronto' ? 'Aguardando tutor' : `Com: ${item.staff} (${item.time})`}
        </div>
        
        <div className="mt-4 pt-3 border-t border-black/5 flex justify-end">
          <button 
            onClick={config.action}
            disabled={item.isProcessing}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors
              ${item.isProcessing ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : `text-${config.color}-700 hover:bg-${config.color}-200/50 bg-${config.color}-100/50`}`}
          >
            {item.isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {item.isProcessing ? 'Atualizando...' : config.nextLabel}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Banho e Tosa</h1>
          <p className="text-gray-500 mt-1">Gerencie a agenda e a fila de serviços de banho e tosa.</p>
        </div>
        <button 
          onClick={handleNewAppointment}
          disabled={isScheduling}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70"
        >
          {isScheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          <span className="font-medium">{isScheduling ? 'Agendando...' : 'Novo Agendamento'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                <Calendar className="w-5 h-5 text-blue-500" />
                Agenda do Dia
              </h2>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Agenda Item */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">09:00</span>
                  <span className="text-xs font-medium text-gray-500">1h 30m</span>
                </div>
                <div className="w-px h-12 bg-gray-200 group-hover:bg-blue-200 transition-colors"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Dog className="w-4 h-4 text-orange-500" />
                      Rex (Golden Retriever)
                    </h3>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                      Banho e Tosa
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" /> Tutor: Maria Silva</span>
                    <span className="flex items-center gap-1.5"><Scissors className="w-4 h-4 text-gray-400" /> Profissional: Carlos</span>
                  </div>
                </div>
              </div>

              {/* Agenda Item */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">10:30</span>
                  <span className="text-xs font-medium text-gray-500">45m</span>
                </div>
                <div className="w-px h-12 bg-gray-200 group-hover:bg-blue-200 transition-colors"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Cat className="w-4 h-4 text-gray-500" />
                      Mimi (Persa)
                    </h3>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-100 rounded-full">
                      Só Banho
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" /> Tutor: João Pedro</span>
                    <span className="flex items-center gap-1.5"><Scissors className="w-4 h-4 text-gray-400" /> Profissional: Ana</span>
                  </div>
                </div>
              </div>

               {/* Agenda Item */}
               <div className="flex items-start gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <span className="text-lg font-bold text-gray-400 group-hover:text-gray-600 transition-colors">11:15</span>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="flex-1 flex items-center">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-2 group-hover:text-gray-700 transition-colors">
                    <Plus className="w-4 h-4" /> Horário Disponível
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Queue Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                <Bath className="w-5 h-5 text-cyan-500" />
                Fila de Serviços
              </h2>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {queue.length}
              </span>
            </div>

            <div className="space-y-4">
              {queue.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Nenhum pet na fila no momento.
                </div>
              ) : (
                queue.map(renderQueueItem)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Novo Agendamento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Novo Agendamento de Banho/Tosa</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet</label>
                <input type="text" required placeholder="Nome do pet" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option>Banho</option>
                  <option>Tosa</option>
                  <option>Banho e Tosa</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input type="time" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea rows={3} placeholder="Alergias, comportamento, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isScheduling} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
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

