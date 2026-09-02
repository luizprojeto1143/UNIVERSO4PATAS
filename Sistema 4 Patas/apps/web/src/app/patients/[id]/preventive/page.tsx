"use client";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PreventivePage({ params }: { params: { id: string } }) {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen relative">
      {/* Toast Notification */}
      <div className={`fixed bottom-4 right-4 z-[60] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-2 px-6 py-4 rounded-2xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p className="font-bold">{toast.message}</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-8 py-8 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="text-white relative z-10">
            <h1 className="text-3xl font-black flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-200" /> Saúde Preventiva
            </h1>
            <p className="text-indigo-100 mt-2 font-medium">Paciente: <span className="font-bold text-white">Bolinha</span> (Canino, Pug)</p>
          </div>
          <Button 
            className="bg-white text-indigo-700 px-6 py-3 rounded-xl hover:bg-indigo-50 font-bold shadow-sm transition-all z-10"
            onClick={() => showToast("Modal de vacina aberto!")}
          >
            + Registrar Vacina/Vermífugo
          </Button>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-xl font-black text-slate-800 mb-6">Esquema Vacinal e Parasitário</h2>
          
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Produto / Vacina
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Dose
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Data Aplicação
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Próximo Vencimento
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">V10 - Cães</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">Reforço Anual</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">10/05/2026</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">10/05/2027</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1.5 inline-flex text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Em Dia
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">Antirrábica</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">Única</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">15/06/2025</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-red-600">15/06/2026</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1.5 inline-flex text-xs font-bold rounded-lg bg-red-50 text-red-700 border border-red-100 animate-pulse">
                      Atrasada
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">Bravecto (Carrapatos)</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">20 a 40kg</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">01/07/2026</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">25/09/2026</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1.5 inline-flex text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                      Protegido
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
