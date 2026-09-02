'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Stethoscope, Clock, CheckCircle2, HeartPulse, Activity, Utensils, Droplet, Download } from 'lucide-react';
import Link from 'next/link';

export default function PortalHospitalizationPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-16 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/portal">
            <Button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-800">Boletim Médico</h1>
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 28/07/2026 - 08:00
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="font-bold text-slate-600 rounded-xl h-9">
          <Download className="w-4 h-4 mr-2" /> PDF
        </Button>
      </div>

      <div className="p-4 space-y-4">
        
        {/* 1. Identificação */}
        <Card className="p-4 bg-white border-2 border-indigo-100 shadow-sm rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Stethoscope className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-1 text-indigo-600 mb-3">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">1. Identificação</span>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 relative z-10">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Paciente</p>
              <p className="font-black text-slate-800 text-base">Piloto</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Espécie / Sexo</p>
              <p className="font-bold text-slate-700 text-sm">Canina (Macho)</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Idade / Raça</p>
              <p className="font-bold text-slate-700 text-sm">10 anos (SRD)</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Vet. Responsável</p>
              <p className="font-bold text-slate-700 text-sm">Dra. Jéssica</p>
            </div>
          </div>
        </Card>

        {/* 2. Estado Geral & 3. Nível de Consciência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-3 inline-block">2. Estado Geral</span>
            
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2 bg-indigo-50 border border-indigo-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-black text-indigo-900 text-sm">ESTÁVEL</h4>
                  <p className="text-[10px] font-medium text-indigo-800 leading-tight mt-1">
                    Os parâmetros vitais e o quadro clínico não apresentam alterações significativas no momento. A estabilidade não indica necessariamente bom prognóstico.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-3 inline-block">3. Nível de Consciência</span>
            
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2 bg-indigo-50 border border-indigo-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-black text-indigo-900 text-sm">RESPONSIVO</h4>
                  <p className="text-[10px] font-medium text-indigo-800 leading-tight mt-1">
                    Paciente com nível de consciência reduzido, porém responde de forma adequada a estímulos (voz, toque). Pode apresentar sonolência.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 4. Parâmetros / Sinais Vitais */}
        <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-4 inline-flex items-center gap-1"><HeartPulse className="w-3 h-3" /> 4. Parâmetros - Sinais Vitais</span>
          
          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Temperatura</p>
                <p className="font-black text-slate-800">38 °C <span className="text-[10px] font-medium text-slate-400 font-normal">(37.5 - 39.4)</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Glicemia</p>
                <p className="font-black text-slate-800">90 mg/dL <span className="text-[10px] font-medium text-slate-400 font-normal">(70 - 120)</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Pressão Arterial</p>
                <p className="font-black text-slate-800">110 mmHg <span className="text-[10px] font-medium text-slate-400 font-normal">(110 - 140)</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Escore de Dor (0-10)</p>
                <p className="font-black text-amber-600">2 <span className="text-[10px] font-medium text-amber-600/70 font-normal">(Desconforto leve)</span></p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Freq. Cardíaca</p>
                <p className="font-black text-slate-800">124 bpm <span className="text-[10px] font-medium text-slate-400 font-normal">(60 - 160)</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Freq. Respiratória</p>
                <p className="font-black text-slate-800">20 mpm <span className="text-[10px] font-medium text-slate-400 font-normal">(10 - 30)</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">TPC</p>
                <p className="font-black text-slate-800">2 seg <span className="text-[10px] font-medium text-slate-400 font-normal">(&lt;2)</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Mucosas / Hidratação</p>
                <p className="font-black text-slate-800">Normocoradas <span className="text-[10px] font-medium text-slate-400 font-normal">/ Normal</span></p>
              </div>
            </div>

          </div>
        </Card>

        {/* 5 e 6: Alimentação e Hidratação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-4 inline-flex items-center gap-1"><Utensils className="w-3 h-3" /> 5. Alimentação</span>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Método</p>
                <p className="font-black text-slate-800 text-sm">Alimentação por Seringa</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Aceitação</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">REGULAR</span>
                  <span className="text-xs font-medium text-slate-600">Consumiu parte da quantidade</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Quantidade</p>
                <p className="font-bold text-slate-700 text-sm">20 ml</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-4 inline-flex items-center gap-1"><Droplet className="w-3 h-3" /> 6. Hidratação</span>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Ingeriu água livremente?</p>
                <p className="font-black text-slate-800 text-sm">Pouca água</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Fluidoterapia IV (Soro na veia)</p>
                <p className="font-black text-slate-800 text-sm">Sim</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 7. Eliminações */}
        <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-4 inline-flex items-center gap-1"><Activity className="w-3 h-3" /> 7. Eliminações</span>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Fezes</p>
              <p className="font-black text-slate-800 text-sm">Ausente</p>
              <p className="text-[10px] text-slate-500 mt-1">Alt: Nenhuma</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Urina</p>
              <p className="font-black text-slate-800 text-sm">Ausente</p>
              <p className="text-[10px] text-slate-500 mt-1">Alt: Nenhuma</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Vômito</p>
              <p className="font-black text-slate-800 text-sm">Não</p>
              <p className="text-[10px] text-slate-500 mt-1">Alt: Nenhuma</p>
            </div>
          </div>
        </Card>

        {/* 8. Observações Gerais */}
        <Card className="p-4 bg-amber-50 border border-amber-100 shadow-sm rounded-2xl">
          <span className="bg-amber-200 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-2 inline-block">8. Observações Gerais</span>
          <p className="text-sm font-medium text-amber-900 leading-relaxed">
            Paciente aguardando ultrassom e resultado de exames.
          </p>
        </Card>

        {/* Assinatura Tutor */}
        <div className="pt-6 pb-4">
          <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Confirmo que visualizei o boletim
          </Button>
          <p className="text-center text-xs font-medium text-slate-400 mt-3">
            O botão registrará o IP e horário do aceite no prontuário do paciente.
          </p>
        </div>

      </div>
    </div>
  );
}
