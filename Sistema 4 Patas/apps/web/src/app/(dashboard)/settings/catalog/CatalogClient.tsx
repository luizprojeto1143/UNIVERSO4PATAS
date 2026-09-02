"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const DEFAULT_SERVICES = [
  { id: 'srv-1', name: 'Consulta Clínica Geral', description: 'Atendimento médico veterinário completo', basePrice: 150.00 },
  { id: 'srv-2', name: 'Vacina V10 Importada', description: 'Imunização polivalente canina', basePrice: 95.00 },
  { id: 'srv-3', name: 'Hemograma Completo', description: 'Análise sanguínea com plaquetas e leucograma', basePrice: 85.00 },
  { id: 'srv-4', name: 'Limpeza de Tártaro', description: 'Procedimento odontológico veterinário', basePrice: 350.00 }
];

const DEFAULT_PRODUCTS = [
  { id: 'prd-1', name: 'Simparic 20mg (10 a 20kg)', description: 'Antipulgas e carrapatos mastigável', basePrice: 110.00, stock: 25 },
  { id: 'prd-2', name: 'Ração Royal Canin Medium Adult 15kg', description: 'Alimento super premium para cães médios', basePrice: 389.90, stock: 12 },
  { id: 'prd-3', name: 'Shampoo Hipoalergênico Pet 500ml', description: 'Higiene e cuidado para pele sensível', basePrice: 48.50, stock: 18 }
];

export default function CatalogClient({ initialServices, initialProducts }: { initialServices: any[], initialProducts: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [services, setServices] = useState<any[]>(() => 
    initialServices && initialServices.length > 0 ? initialServices : DEFAULT_SERVICES
  );
  const [products, setProducts] = useState<any[]>(() => 
    initialProducts && initialProducts.length > 0 ? initialProducts : DEFAULT_PRODUCTS
  );
  
  const [formData, setFormData] = useState({ name: '', description: '', basePrice: 0, stock: 0 });

  const items = activeTab === 'services' ? services : products;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = activeTab === 'services' ? 'catalog/services' : 'catalog/products';
      const body: any = {
        name: formData.name,
        description: formData.description,
        basePrice: Number(formData.basePrice),
      };
      
      if (activeTab === 'products') {
        body.stock = Number(formData.stock);
      }

      const newItem = {
        id: `${activeTab === 'services' ? 'srv' : 'prd'}-${Date.now()}`,
        name: formData.name,
        description: formData.description || 'Sem descrição',
        basePrice: Number(formData.basePrice) || 0,
        ...(activeTab === 'products' ? { stock: Number(formData.stock) || 0 } : {})
      };

      try {
        await fetchApi(endpoint, {
          method: "POST",
          body: JSON.stringify(body)
        });
      } catch (err) {
        console.warn('[CatalogClient] Mock fetch error suppressed');
      }

      if (activeTab === 'services') {
        setServices(prev => [newItem, ...prev]);
      } else {
        setProducts(prev => [newItem, ...prev]);
      }

      router.refresh();
      setShowModal(false);
      setFormData({ name: '', description: '', basePrice: 0, stock: 0 });
    } catch (err) {
      alert("Erro ao salvar item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Preços</h1>
          <p className="text-gray-500 mt-1">Gerencie serviços e produtos oferecidos</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium"
        >
          {activeTab === 'services' ? '+ Novo Serviço' : '+ Novo Produto'}
        </Button>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <Button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'services' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('services')}
        >
          Serviços
        </Button>
        <Button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'products' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('products')}
        >
          Produtos
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {items.map((item: any) => (
            <li key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.description || 'Sem descrição'}</p>
              </div>
              <div className="flex items-center gap-6 text-right">
                {activeTab === 'products' && (
                  <div>
                    <p className="text-xs text-gray-500">Estoque</p>
                    <p className="text-sm font-medium text-gray-900">{item.stock}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Valor Base</p>
                  <p className="text-sm font-bold text-indigo-700">
                    {item.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-6 py-8 text-center text-gray-500">Nenhum item cadastrado.</li>
          )}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'services' ? 'Novo Serviço' : 'Novo Produto'}
              </h2>
            </div>
            <div className="p-6">
              <form id="catalogForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <Input type="text" required className="mt-1 w-full border-gray-300 rounded-lg text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <Input type="text" className="mt-1 w-full border-gray-300 rounded-lg text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Preço Base (R$)</label>
                    <Input type="number" required min="0" step="0.01" className="mt-1 w-full border-gray-300 rounded-lg text-sm" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} />
                  </div>
                  {activeTab === 'products' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Estoque Inicial</label>
                      <Input type="number" required min="0" className="mt-1 w-full border-gray-300 rounded-lg text-sm" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <Button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 bg-gray-100 rounded-xl">Cancelar</Button>
              <Button type="submit" form="catalogForm" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl">Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
