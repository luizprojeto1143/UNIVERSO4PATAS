"use client";

import React, { useState } from 'react';
import { Truck, Package, Clock, CheckCircle, AlertCircle, Phone, Mail, ChevronRight, BarChart3, Plus, Loader2, ArrowRight } from 'lucide-react';

const INITIAL_PENDING_ORDERS = [
  { id: 'PO-2026-081', supplier: 'PharmaCorp Inc.', items: 12, total: 'R$ 4.250,00', status: 'Em Trânsito', expected: 'Hoje', urgency: 'Alta' },
  { id: 'PO-2026-082', supplier: 'VetSupplies Co.', items: 45, total: 'R$ 1.890,50', status: 'Processando', expected: '8 de Ago', urgency: 'Média' },
  { id: 'PO-2026-083', supplier: 'MediDog Labs', items: 3, total: 'R$ 950,00', status: 'Aprovação Pendente', expected: '10 de Ago', urgency: 'Baixa' },
];

const INITIAL_SUPPLIERS = [
  { name: 'PharmaCorp Inc.', rating: 4.8, activeOrders: 2, contact: 'Sarah Jones', cnpj: '12.345.678/0001-90', category: 'Medicamentos' },
  { name: 'VetSupplies Co.', rating: 4.5, activeOrders: 1, contact: 'Mike Chen', cnpj: '98.765.432/0001-10', category: 'Equipamentos' },
  { name: 'MediDog Labs', rating: 4.9, activeOrders: 1, contact: 'Emma White', cnpj: '45.678.910/0001-20', category: 'Insumos' },
];

export default function SuppliersDashboard() {
  const [ordersList, setOrdersList] = useState<any[]>(INITIAL_PENDING_ORDERS);
  const [suppliersList, setSuppliersList] = useState<any[]>(INITIAL_SUPPLIERS);

  const [isOrdering, setIsOrdering] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [isSavingSupplier, setIsSavingSupplier] = useState(false);

  const [newSupplier, setNewSupplier] = useState({ name: '', cnpj: '', category: '' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNewOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      const createdOrder = {
        id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
        supplier: suppliersList[0]?.name || 'PharmaCorp Inc.',
        items: Math.floor(Math.random() * 15) + 1,
        total: `R$ ${(Math.random() * 2000 + 500).toFixed(2).replace('.', ',')}`,
        status: 'Processando',
        expected: 'Amanhã',
        urgency: 'Média'
      };
      setOrdersList(prev => [createdOrder, ...prev]);
      setIsOrdering(false);
      showToast(`Pedido ${createdOrder.id} criado com sucesso!`);
    }, 800);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSupplier(true);
    setTimeout(() => {
      const createdSup = {
        name: newSupplier.name || 'Novo Fornecedor',
        rating: 5.0,
        activeOrders: 0,
        contact: 'Contato Comercial',
        cnpj: newSupplier.cnpj,
        category: newSupplier.category
      };
      setSuppliersList(prev => [createdSup, ...prev]);
      setIsSavingSupplier(false);
      setShowSupplierModal(false);
      setNewSupplier({ name: '', cnpj: '', category: '' });
      showToast("Fornecedor adicionado com sucesso!");
    }, 800);
  };

  const handleMockAction = (action: string) => {
    showToast(`Ação ${action} acionada.`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Novo Fornecedor Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Novo Fornecedor</h2>
            
            <form onSubmit={handleSaveSupplier} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                <input 
                  required 
                  type="text" 
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ex: PharmaCorp Inc." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input 
                  required 
                  type="text" 
                  value={newSupplier.cnpj}
                  onChange={e => setNewSupplier({ ...newSupplier, cnpj: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="00.000.000/0001-00" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria de Produto</label>
                <input 
                  required 
                  type="text" 
                  value={newSupplier.category}
                  onChange={e => setNewSupplier({ ...newSupplier, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ex: Medicamentos, Equipamentos" 
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSavingSupplier}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  {isSavingSupplier ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {isSavingSupplier ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fornecedores e Pedidos</h1>
            <p className="text-gray-500 mt-1">Gerencie pedidos de compra e relacionamento com fornecedores</p>
          </div>
          <button 
            onClick={handleNewOrder}
            disabled={isOrdering}
            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70"
          >
            {isOrdering ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            {isOrdering ? 'Criando Pedido...' : 'Novo Pedido de Compra'}
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Em Trânsito', value: '4', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100/80' },
            { label: 'Pendente', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100/80' },
            { label: 'Entregues (30d)', value: '45', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100/80' },
            { label: 'Gasto Total', value: 'R$ 24,5k', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-100/80' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/60 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Pending Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-500" />
                  Pedidos de Compra Ativos
                </h2>
                <button 
                  onClick={() => handleMockAction("View All Orders")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Ver Todos
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {ordersList.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => handleMockAction(`View Order ${order.id}`)}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-1.5">
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                            order.status === 'Em Trânsito' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            order.status === 'Processando' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center">
                          <span className="font-medium text-gray-700">{order.supplier}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          {order.items} itens
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{order.total}</p>
                        <p className="text-sm text-gray-500 mt-0.5">Prev: <span className="font-medium text-gray-700">{order.expected}</span></p>
                      </div>
                    </div>
                    {order.urgency === 'Alta' && (
                      <div className="mt-4 flex items-center justify-between text-sm text-amber-700 bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />
                          Estoque criticamente baixo para 2 itens neste pedido. Necessita acompanhamento.
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Suppliers & Inventory Link */}
          <div className="space-y-8">
            {/* Predictive Inventory Alert */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-7 text-white shadow-lg relative overflow-hidden group">
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 mb-4 backdrop-blur-md">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs font-semibold tracking-wider uppercase">Insights</span>
                </div>
                <h3 className="font-semibold text-xl mb-3">
                  Alerta de Estoque Baixo
                </h3>
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                  Com base em tendências recentes, você pode precisar reabastecer <strong className="text-white">Amoxicilina</strong> nos próximos 7 dias.
                </p>
                <button 
                  onClick={() => handleMockAction("Create Auto-Order")}
                  className="bg-white text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all w-full flex justify-center items-center shadow-sm group-hover:shadow"
                >
                  Criar Pedido Automático
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="absolute -bottom-8 -right-8 text-white opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                <BarChart3 className="w-48 h-48" />
              </div>
            </div>

            {/* Top Suppliers */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Principais Fornecedores</h2>
                <button 
                  onClick={() => setShowSupplierModal(true)}
                  className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center text-sm font-medium px-3"
                  title="Novo Fornecedor"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Novo
                </button>
              </div>
              <div className="p-6 space-y-5">
                {suppliersList.map((supplier, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{supplier.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{supplier.activeOrders} pedidos ativos</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleMockAction(`Email ${supplier.contact}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleMockAction(`Call ${supplier.contact}`)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t border-gray-50 bg-gray-50/50">
                <button 
                  onClick={() => handleMockAction("View Directory")}
                  className="w-full text-center text-sm text-gray-600 font-semibold hover:text-gray-900 transition-colors"
                >
                  Ver Diretório Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

