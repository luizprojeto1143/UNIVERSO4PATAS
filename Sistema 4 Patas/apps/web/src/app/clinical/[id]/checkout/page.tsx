'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckCircle2, Activity } from 'lucide-react';

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleComplete = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Fatura gerada e concluída com sucesso!');
    }, 1000);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      {toastMessage && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Finalizar Atendimento #1029</h1>
          <p className="text-gray-500 mt-1">Revise os itens consumidos e gere a fatura para o tutor.</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col md:flex-row">
          {/* Lado Esquerdo - Itens */}
          <div className="w-full md:w-2/3 p-6 border-r border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens do Atendimento</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Consulta Clínica (Rotina)</p>
                  <p className="text-xs text-gray-500">Serviço • Dr. João Silva</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ 150,00</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Vacina V10</p>
                  <p className="text-xs text-gray-500">Produto • 1 dose</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ 100,00</p>
                </div>
              </div>
            </div>

            <Button onClick={() => showToast('Adicionar Item (Em breve)')} className="mt-4 text-indigo-600 font-medium text-sm hover:underline flex items-center gap-1">
              + Adicionar Item Manualmente
            </Button>
          </div>

          {/* Lado Direito - Faturamento */}
          <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Fatura</h2>
              
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>R$ 250,00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Desconto</span>
                <span>R$ 0,00</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-indigo-700">R$ 250,00</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option>Aguardando Pagamento (Pendente)</option>
                  <option>Cartão de Crédito</option>
                  <option>Cartão de Débito</option>
                  <option>Pix</option>
                  <option>Dinheiro</option>
                </select>
              </div>

              <Button disabled={isSaving} onClick={handleComplete} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 shadow-sm transition-colors flex items-center justify-center gap-2">
                {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : null}
                Gerar Fatura e Concluir
              </Button>
              <Button onClick={() => showToast('Rascunho salvo')} className="w-full bg-white text-gray-700 border border-gray-300 font-medium py-3 rounded-md hover:bg-gray-50 transition-colors">
                Salvar como Rascunho
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
