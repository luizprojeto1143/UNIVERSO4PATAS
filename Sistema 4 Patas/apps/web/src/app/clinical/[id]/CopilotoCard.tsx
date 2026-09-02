"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function CopilotoCard() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <Card className="p-6 border-indigo-200 shadow-lg shadow-indigo-500/10 rounded-3xl bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
         <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
           <Bot className="w-5 h-5" />
         </div>
         <h3 className="font-black text-slate-800 flex items-center gap-2">
           Vet.AI <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3"/> Copiloto</span>
         </h3>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="bg-white border border-indigo-100 p-3 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Diagnóstico Diferencial (IA)</p>
          <p className="text-sm font-medium text-slate-700 mb-2">
            Baseado em <span className="font-bold text-rose-600">vômito crônico</span> e <span className="font-bold text-rose-600">febre (40ºC)</span>, considere investigar:
          </p>
          <ul className="space-y-2 text-sm font-bold text-slate-800">
            <li className="flex justify-between items-center bg-indigo-50/50 p-2 rounded-lg">
              <span>1. Parvovirose Canina</span>
              <span className="text-indigo-600">85% de compatibilidade</span>
            </li>
            <li className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-slate-600">
              <span>2. Gastroenterite Aguda</span>
              <span className="text-slate-400">60% de compatibilidade</span>
            </li>
            <li className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-slate-600">
              <span>3. Doença Renal (IRA)</span>
              <span className="text-slate-400">45% de compatibilidade</span>
            </li>
          </ul>
        </div>

        <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-md">
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">Conduta Sugerida</p>
          <p className="text-sm font-medium mb-3">Recomendo solicitar um <strong>Hemograma Completo</strong> e <strong>Perfil Renal</strong> para descartar IRA.</p>
          <Button onClick={() => showToast('Exames solicitados e adicionados ao prontuário')} className="w-full py-2 bg-white text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">
            Solicitar Exames Agora
          </Button>
        </div>
      </div>
    </Card>
  );
}
