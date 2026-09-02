'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download, Share2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TemplatePreviewPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-8 bg-slate-100">
      {/* Topbar */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <Link href="/settings/templates/1/edit">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Receituário de Controlados (Visualização)</h1>
            <p className="text-xs text-slate-500 font-medium">Visualização simulando dados reais do sistema</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-slate-600 border-slate-200">
             <Share2 className="w-4 h-4 mr-2" /> Compartilhar
          </Button>
          <Button variant="outline" className="text-slate-600 border-slate-200">
             <Download className="w-4 h-4 mr-2" /> Baixar PDF
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        {/* A4 Sheet */}
        <div className="bg-white shadow-lg border border-slate-200 w-full max-w-[800px] min-h-[1100px] relative">
          
          <div className="p-12">
             {/* Header */}
             <div className="border-b-2 border-indigo-900 pb-6 mb-8 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-black text-2xl">
                    4P
                  </div>
                  <div>
                    <h2 className="font-black text-2xl text-indigo-900 tracking-tight">4patas</h2>
                    <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Saúde Animal</p>
                  </div>
               </div>
               <div className="text-right text-xs font-medium text-slate-600 space-y-1">
                 <p>Rua Cristiano Machado, 415, Centro, Igarapé</p>
                 <p>contato@4patas.vet.br • (31) 3534-4623 • (31) 99932-0279</p>
               </div>
             </div>

             {/* Patient Info */}
             <div className="grid grid-cols-2 gap-8 mb-8 border-b border-slate-100 pb-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Dados do Responsável
                  </h3>
                  <div className="space-y-1 text-sm text-slate-800">
                    <p><span className="font-semibold text-slate-500">Nome:</span> João Silva (Exemplo)</p>
                    <p><span className="font-semibold text-slate-500">CPF:</span> 123.456.789-00</p>
                    <p><span className="font-semibold text-slate-500">Endereço:</span> Av. Brasil, 1000 - Centro, SP</p>
                    <p><span className="font-semibold text-slate-500">Telefone:</span> (11) 99999-9999</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Dados do Animal
                  </h3>
                  <div className="space-y-1 text-sm text-slate-800">
                    <p><span className="font-semibold text-slate-500">Nome:</span> Rex (Exemplo)</p>
                    <p><span className="font-semibold text-slate-500">Espécie:</span> Canino / <span className="font-semibold text-slate-500">Raça:</span> Labrador</p>
                    <p><span className="font-semibold text-slate-500">Peso:</span> 12.5 kg / <span className="font-semibold text-slate-500">Idade:</span> 3 anos</p>
                    <p><span className="font-semibold text-slate-500">Sexo:</span> Macho (Castrado)</p>
                  </div>
                </div>
             </div>

             {/* Title */}
             <div className="text-center mb-8">
               <h2 className="text-xl font-black text-slate-900 uppercase">Receituário de Controle Especial</h2>
               <p className="text-sm text-slate-500 mt-1">1ª Via - Retenção da Farmácia / 2ª Via - Paciente</p>
             </div>

             {/* Prescription Items */}
             <div className="mb-12">
               <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">1. Gabapentina 100mg</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Uso Oral</p>
                    </div>
                    <div className="bg-white border border-slate-200 px-3 py-1 rounded text-sm font-bold text-slate-700">
                      1 Frasco
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 p-4 rounded-md">
                    Dar 1 comprimido a cada 12 horas (BID) durante 10 dias consecutivos. 
                    Monitorar sinais de sonolência excessiva no animal. Em caso de dúvidas, retornar à clínica.
                  </div>
               </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">2. Fenobarbital 100mg</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Uso Oral</p>
                    </div>
                    <div className="bg-white border border-slate-200 px-3 py-1 rounded text-sm font-bold text-slate-700">
                      1 Caixa (30 comp)
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 p-4 rounded-md">
                    Dar 1/2 comprimido a cada 12 horas, de forma contínua (uso crônico). 
                    Retornar em 30 dias para exames de rotina (avaliação hepática).
                  </div>
               </div>
             </div>

             {/* Control Number & Date */}
             <div className="flex justify-between items-end mb-12">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    Número da Receita Controlada <CheckCircle2 className="w-3 h-3 text-amber-500" />
                  </p>
                  <p className="font-mono text-lg font-bold text-slate-900">11111/2026 - 001/26</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-700 font-medium">Igarapé, 30 de Julho de 2026</p>
                </div>
             </div>

             {/* Signature Block */}
             <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-200 max-w-sm mx-auto">
                <div className="w-full bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center relative overflow-hidden mb-4">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500 opacity-10 rounded-bl-full"></div>
                   <div className="flex items-center justify-center gap-2 mb-2 text-emerald-700">
                     <CheckCircle2 className="w-5 h-5" />
                     <span className="font-bold text-sm uppercase tracking-wider">Assinatura Digital Qualificada</span>
                   </div>
                   <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                     Documento assinado digitalmente conforme MP nº 2.200-2/2001 e validação ICP-Brasil.
                   </p>
                </div>
                <p className="font-bold text-slate-900 mt-2 text-lg">Dra. Luiza</p>
                <p className="text-sm text-slate-500 font-medium">Médica Veterinária • CRMV-SP 12345</p>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
