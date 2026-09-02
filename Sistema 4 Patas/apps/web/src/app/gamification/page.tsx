"use client";

import React, { useState } from 'react';
import { Trophy, Star, Medal, ArrowUp, ArrowDown, Award, Zap, Gift, CheckCircle, X, Plus } from 'lucide-react';

export default function GamificationDashboard() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleGivePoints = (name: string) => {
    showToast(`Processando pontos para ${name}...`);
    setTimeout(() => {
      showToast(`50 pontos atribuídos com sucesso para ${name}!`);
    }, 500);
  };

  const handleAwardBadge = (name: string) => {
    showToast(`Preparando emblema para ${name}...`);
    setTimeout(() => {
      showToast(`Emblema especial atribuído com sucesso para ${name}!`);
    }, 500);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      showToast("Pontos adicionados com sucesso!");
    }, 1500);
  };

  const topVets = [
    { id: 1, name: 'Dra. Sarah Jenkins', role: 'Veterinária Sênior', points: 12500, trend: 'up', avatar: 'SJ' },
    { id: 2, name: 'Dr. Michael Chen', role: 'Cirurgião', points: 11200, trend: 'up', avatar: 'MC' },
    { id: 3, name: 'Dra. Emily Rodriguez', role: 'Veterinária', points: 9800, trend: 'down', avatar: 'ER' },
  ];

  const recentAchievements = [
    { id: 1, name: 'Semana Perfeita', description: 'Nenhuma consulta perdida', points: +500, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { id: 2, name: 'Favorito dos Clientes', description: 'Sequência de avaliações 5 estrelas', points: +300, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: 3, name: 'Mestre da Eficiência', description: 'Consultas mais rápidas', points: +450, icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 right-8 bg-white border border-gray-200 shadow-xl rounded-xl p-4 flex items-center space-x-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="font-medium text-gray-800">{toastMessage}</span>
        </div>
      )}

      {/* Modal Nova Recompensa / Adicionar Pontos */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Adicionar Pontos</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funcionário</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                  <option value="">Selecione um funcionário</option>
                  {topVets.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Pontos (XP)</label>
                <input 
                  type="number" 
                  placeholder="Ex: 500"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <textarea 
                  rows={3}
                  placeholder="Descreva o motivo da recompensa..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gamificação e Placar</h1>
          <p className="text-gray-500 mt-2">Métricas de engajamento e desempenho de funcionários</p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl font-medium shadow-sm border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer">
          <Trophy className="w-5 h-5" />
          <span>Temporada Atual: Q3 2026</span>
        </div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recepcionista do Mês */}
        <div className="col-span-1 bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-6">
              <Award className="w-8 h-8 text-white/90 drop-shadow-md" />
              <h2 className="text-xl font-bold tracking-wide uppercase text-white/90">Funcionário Destaque</h2>
            </div>
            <div className="flex items-center space-x-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-4 border-white/40 shadow-inner group-hover:border-white/60 transition-colors duration-300">
                JL
              </div>
              <div>
                <h3 className="text-3xl font-bold drop-shadow-sm">Jessica Lee</h3>
                <p className="text-orange-50 font-medium text-lg mt-1">Gerente de Recepção</p>
              </div>
            </div>
          </div>
          <div className="bg-black/15 rounded-2xl p-5 backdrop-blur-md border border-white/10 relative z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/90 font-medium">Satisfação do Cliente</span>
              <span className="font-bold text-lg">99.8%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
              <div className="bg-white rounded-full h-full w-[99.8%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                <Zap className="w-7 h-7 text-indigo-600" />
              </div>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                12% desde o último mês
              </span>
            </div>
            <p className="text-gray-500 font-medium text-lg">XP Total Gerado</p>
            <h4 className="text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">245.800</h4>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                <Star className="w-7 h-7 text-emerald-600" />
              </div>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                8% desde o último mês
              </span>
            </div>
            <p className="text-gray-500 font-medium text-lg">Engajamento no Sistema</p>
            <h4 className="text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">94.2%</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Placar de Veterinários em Destaque */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Veterinários em Destaque</h3>
            <button 
              onClick={() => setShowModal(true)}
              className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-100 transition-colors"
            >
              Adicionar Pontos
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {topVets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Trophy className="w-12 h-12 mb-3 text-gray-300" />
                <p>Nenhum registro encontrado</p>
              </div>
            ) : (
              topVets.map((vet, index) => (
                <div 
                  key={vet.id} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                    <div className={`w-8 font-extrabold text-2xl ${index === 0 ? 'text-amber-500 drop-shadow-sm' : index === 1 ? 'text-slate-400' : 'text-amber-700'}`}>
                      #{index + 1}
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${index === 0 ? 'bg-amber-100 text-amber-700 border-2 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-2 border-indigo-100'}`}>
                      {vet.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg group-hover:text-indigo-700 transition-colors">{vet.name}</p>
                      <p className="text-sm font-medium text-gray-500">{vet.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 sm:pl-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">{vet.points.toLocaleString('pt-BR')} XP</p>
                      </div>
                      {vet.trend === 'up' ? (
                        <ArrowUp className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleGivePoints(vet.name)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                        title="Adicionar Pontos"
                      >
                        <Gift className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleAwardBadge(vet.name)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                        title="Atribuir Emblema"
                      >
                        <Medal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conquistas Recentes */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Conquistas Recentes</h3>
          </div>
          <div className="space-y-4 flex-1">
            {recentAchievements.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Star className="w-12 h-12 mb-3 text-gray-300" />
                <p>Nenhum registro encontrado</p>
              </div>
            ) : (
              recentAchievements.map((achievement, index) => (
                <div 
                  key={achievement.id} 
                  className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${achievement.bg}`}>
                      <achievement.icon className={`w-7 h-7 ${achievement.color}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{achievement.name}</p>
                      <p className="text-sm font-medium text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center border border-emerald-100 shadow-sm">
                    <Zap className="w-4 h-4 mr-1.5" />
                    {achievement.points} XP
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
