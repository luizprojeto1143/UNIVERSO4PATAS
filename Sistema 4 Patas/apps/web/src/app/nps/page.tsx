"use client";

import React, { useState } from 'react';
import { Smile, Frown, Meh, MessageSquare, TrendingUp, Star, CheckCircle, X } from 'lucide-react';

export default function NPSDashboard() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const npsScore = 72;
  const totalReviews = 1248;

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      setToastMessage("Pesquisa NPS disparada com sucesso!");
    }, 1500);
  };

  const recentReviews = [
    { id: 1, user: 'Alice M.', rating: 5, comment: 'Ótimo serviço, recomendo!', date: '2 dias atrás', type: 'Promotor' },
    { id: 2, user: 'Bob S.', rating: 4, comment: 'Bom no geral, mas poderia ser mais rápido.', date: '3 dias atrás', type: 'Passivo' },
    { id: 3, user: 'Charlie D.', rating: 2, comment: 'Tivemos alguns problemas com o atendimento.', date: '4 dias atrás', type: 'Detrator' },
    { id: 4, user: 'Diana P.', rating: 5, comment: 'Absolutamente incrível, estrutura de ponta!', date: '5 dias atrás', type: 'Promotor' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center space-x-3 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Disparar Pesquisa NPS</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Público-Alvo</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                  <option value="">Selecione o público</option>
                  <option value="recentes">Clientes da Última Semana</option>
                  <option value="hotel">Clientes do Hotelzinho</option>
                  <option value="cirurgia">Pacientes Pós-Cirúrgicos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título da Campanha</label>
                <input 
                  type="text" 
                  placeholder="Ex: Pesquisa Pós-Internação"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Disparo</label>
                <input 
                  type="date" 
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
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
                      Disparando...
                    </>
                  ) : (
                    'Disparar Pesquisa'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Satisfação do Cliente (NPS)</h1>
          <p className="text-gray-500 mt-2">Monitore a satisfação e feedbacks recentes dos tutores.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center space-x-2"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Nova Pesquisa</span>
        </button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <Smile size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tendência de Sentimento</p>
            <h3 className="text-3xl font-bold text-green-600 flex items-center">{npsScore}</h3>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp size={14} className="mr-1" /> +5 este mês
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <MessageSquare size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Avaliações</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalReviews}</h3>
            <p className="text-sm text-gray-500 mt-1">Em todas as plataformas</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
            <Star size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avaliação Média</p>
            <h3 className="text-3xl font-bold text-gray-900">4.6<span className="text-lg text-gray-400">/5</span></h3>
            <p className="text-sm text-gray-500 mt-1">Baseada em pesquisas recentes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Distribuição de Feedbacks */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Distribuição de Feedbacks</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-green-600 flex items-center"><Smile size={16} className="mr-2"/> Promotores (9-10)</span>
                <span className="font-bold">65%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-yellow-600 flex items-center"><Meh size={16} className="mr-2"/> Neutros (7-8)</span>
                <span className="font-bold">25%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-red-600 flex items-center"><Frown size={16} className="mr-2"/> Detratores (0-6)</span>
                <span className="font-bold">10%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-red-500 h-3 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Avaliações Recentes */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Feedbacks Recentes</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">Ver Todos</button>
          </div>

          <div className="space-y-4">
            {recentReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
                <p>Nenhum registro encontrado</p>
              </div>
            ) : (
              recentReviews.map((review) => (
                <div key={review.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{review.user}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        review.type === 'Promotor' ? 'bg-green-100 text-green-700' :
                        review.type === 'Passivo' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {review.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
