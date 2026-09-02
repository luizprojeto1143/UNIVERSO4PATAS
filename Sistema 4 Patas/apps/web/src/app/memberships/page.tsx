"use client";

import React, { useState } from 'react';
import { Users, TrendingDown, Crown, Shield, Star, Check, ArrowRight, Loader2 } from 'lucide-react';

export default function MembershipsPage() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAction = (actionName: string) => {
    setLoadingAction(actionName);
    setTimeout(() => {
      setLoadingAction(null);
      setToastMessage(`${actionName} realizado com sucesso!`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 500);
  };

  const handleSaveModal = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      setToastMessage("Adesão realizada com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  const stats = [
    { name: 'Assinantes Ativos', value: '2.845', change: '+12%', icon: Users },
    { name: 'Taxa de Cancelamento', value: '2.4%', change: '-0.3%', icon: TrendingDown },
    { name: 'Receita Mensal (MRR)', value: 'R$ 45.230', change: '+8%', icon: Crown },
  ];

  const plans = [
    {
      name: 'Básico',
      price: 'R$ 29',
      interval: '/mês',
      icon: Shield,
      subscribers: 1240,
      features: ['Acesso a recursos básicos', 'Suporte por e-mail', 'Até 5 usuários'],
      color: 'bg-blue-500',
    },
    {
      name: 'Premium',
      price: 'R$ 79',
      interval: '/mês',
      icon: Star,
      subscribers: 985,
      features: ['Todos os recursos Básicos', 'Suporte prioritário', 'Até 20 usuários', 'Análise avançada'],
      color: 'bg-purple-500',
      popular: true,
    },
    {
      name: 'VIP',
      price: 'R$ 199',
      interval: '/mês',
      icon: Crown,
      subscribers: 620,
      features: ['Todos os recursos Premium', 'Suporte dedicado 24/7', 'Usuários ilimitados', 'Integrações personalizadas'],
      color: 'bg-amber-500',
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planos de Saúde e Assinaturas</h1>
          <p className="text-gray-500 mt-1">Gerencie níveis de assinatura e métricas de assinantes</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg flex items-center justify-center min-w-[150px]"
        >
          Nova Adesão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl">
              <stat.icon className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Níveis de Plano</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative bg-white rounded-3xl shadow-sm border ${plan.popular ? 'border-purple-200 ring-2 ring-purple-50' : 'border-gray-100'} p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Mais Popular
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-xl text-white ${plan.color}`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-500">{plan.interval}</span>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">Assinantes Ativos</div>
                <div className="text-lg font-bold">{plan.subscribers.toLocaleString('pt-BR')}</div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleAction(`Gerenciar Plano ${plan.name}`)}
                disabled={loadingAction === `Gerenciar Plano ${plan.name}`}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center disabled:opacity-70 ${
                plan.popular 
                  ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md'
              }`}>
                {loadingAction === `Gerenciar Plano ${plan.name}` ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gerenciar Plano'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 mx-4">
            <h2 className="text-2xl font-bold mb-4">Nova Adesão</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tutor</label>
                <input type="text" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Nome do tutor" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet</label>
                <input type="text" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Nome do pet" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plano Escolhido</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Básico</option>
                  <option>Premium</option>
                  <option>VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Cartão de Crédito</option>
                  <option>Boleto</option>
                  <option>Pix</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveModal}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center min-w-[100px]"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl font-medium flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-4 z-50">
          <Check className="w-5 h-5 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
