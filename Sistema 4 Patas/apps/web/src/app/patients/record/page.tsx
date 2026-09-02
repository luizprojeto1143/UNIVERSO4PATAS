"use client";
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Save, FileText, Syringe, TestTube, Activity, AlertTriangle, Dog, History, Calendar, CheckCircle2, ChevronRight, Scale, Thermometer } from 'lucide-react';
import Link from 'next/link';

export default function MedicalRecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'soap' | 'bodymap' | 'history'>('soap');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="pb-12 max-w-[1400px] mx-auto p-4 md:p-6 min-h-screen bg-slate-50/50">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-4 right-4 z-[60] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-2 px-6 py-4 rounded-2xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-bold">{toast.message}</p>
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <Button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
             <h1 className="text-xl font-black text-slate-800">Atendimento em Andamento</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="font-bold border-slate-300 text-slate-600 rounded-xl"
            onClick={() => showToast("Atendimento pausado temporariamente!")}
          >
             Pausar Atendimento
          </Button>
          <Button 
            className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 shadow-md"
            onClick={() => {
              showToast("Consulta finalizada com sucesso! Salvando prontuário...");
              setTimeout(() => {
                window.location.href = '/patients';
              }, 1500);
            }}
          >
             <Save className="w-4 h-4" /> Finalizar Consulta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Patient Context */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="p-6 border-slate-200 shadow-sm rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-orange-400 to-rose-400"></div>
              <div className="relative z-10 pt-8 flex flex-col items-center">
                 <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mb-4">
                   <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                     <Dog className="w-10 h-10 text-slate-400" />
                   </div>
                 </div>
                 <h2 className="text-2xl font-black text-slate-800">Bolinha</h2>
                 <p className="text-slate-500 font-medium">Canino • Pug • 4 anos</p>
                 
                 <div className="w-full mt-6 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Alergia Severa</p>
                      <p className="text-sm text-rose-600 font-medium">Dipirona e Penicilina</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                   <Scale className="w-5 h-5 text-indigo-500 mb-2" />
                   <p className="text-[10px] uppercase font-bold text-slate-400">Peso (Triagem)</p>
                   <p className="text-lg font-black text-slate-800">12.5 <span className="text-sm">kg</span></p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                   <Thermometer className="w-5 h-5 text-rose-500 mb-2" />
                   <p className="text-[10px] uppercase font-bold text-slate-400">Temperatura</p>
                   <p className="text-lg font-black text-slate-800">39.2 <span className="text-sm">°C</span></p>
                 </div>
              </div>
           </Card>

           {/* Timeline Mini */}
           <Card className="p-6 border-slate-200 shadow-sm rounded-3xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-indigo-500" /> Histórico Rápido
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                 <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-indigo-500 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm">
                       <time className="text-[10px] font-bold text-indigo-500 uppercase">Há 3 meses</time>
                       <p className="text-sm font-bold text-slate-700">Vacina V10</p>
                    </div>
                 </div>
                 <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                       <time className="text-[10px] font-bold text-slate-400 uppercase">Há 8 meses</time>
                       <p className="text-sm font-bold text-slate-700">Castração</p>
                    </div>
                 </div>
              </div>
           </Card>
        </div>

        {/* MIDDLE COLUMN: The EMR / SOAP */}
        <div className="lg:col-span-6 flex flex-col gap-6">
           <Card className="border-slate-200 shadow-lg rounded-3xl overflow-hidden flex-grow flex flex-col">
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-2 overflow-x-auto">
                 <Button 
                   onClick={() => setActiveTab('soap')}
                   className={`h-auto flex-1 min-w-[180px] py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'soap' ? 'bg-white shadow-sm text-indigo-700 border border-slate-200/60' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                   📋 Evolução Clínica (SOAP)
                 </Button>
                 <Button 
                   onClick={() => setActiveTab('bodymap')}
                   className={`h-auto flex-1 min-w-[180px] py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'bodymap' ? 'bg-white shadow-sm text-indigo-700 border border-slate-200/60' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                   🐕 Mapa Corporal (Body Map)
                 </Button>
                 <Button 
                   onClick={() => setActiveTab('history')}
                   className={`h-auto flex-1 min-w-[180px] py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-indigo-700 border border-slate-200/60' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                   📚 Histórico Completo
                 </Button>
              </div>

              {activeTab === 'soap' && (
                <div className="p-6 space-y-6 flex-grow flex flex-col bg-white">
                   {/* Smart Dictation Bar */}
                   <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                     <div>
                       <p className="font-bold text-indigo-900 flex items-center gap-2">
                         <Activity className="w-5 h-5" /> Assistente de Voz com IA
                       </p>
                       <p className="text-xs text-indigo-700 font-medium mt-1">Dite a consulta e a IA preenche o SOAP automaticamente.</p>
                     </div>
                     <Button 
                       onClick={toggleRecording}
                       className={`p-4 rounded-full transition-all shadow-md flex items-center justify-center ${isRecording ? 'bg-rose-500 animate-pulse text-white' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}
                     >
                       <Mic className="w-6 h-6" />
                     </Button>
                   </div>

                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-black text-slate-800 mb-2">S - Subjetivo (Histórico e Queixa)</label>
                       <textarea 
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
                         placeholder="O que o tutor relatou? Ex: Cachorro vomitando há 2 dias..."
                         defaultValue={isRecording ? "Transcrevendo áudio: O tutor relatou que o animal está apático desde ontem à noite e apresentou dois episódios de êmese..." : ""}
                       ></textarea>
                     </div>
                     <div>
                       <label className="block text-sm font-black text-slate-800 mb-2">O - Objetivo (Exame Físico)</label>
                       <textarea 
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
                         placeholder="Mucosas, TPC, Linfonodos, Palpação..."
                       ></textarea>
                     </div>
                     <div>
                       <label className="block text-sm font-black text-slate-800 mb-2">A - Avaliação (Suspeita / Diagnóstico)</label>
                       <Input 
                         type="text"
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                         placeholder="Ex: Suspeita de Gastrite"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-black text-slate-800 mb-2">P - Plano (Tratamento e Conduta)</label>
                       <textarea 
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
                         placeholder="Internação? Alta médica? Receita para casa?"
                       ></textarea>
                     </div>
                   </div>
                </div>
              )}

              {activeTab === 'bodymap' && (
                <div className="p-6 flex-grow flex flex-col items-center justify-center bg-slate-50">
                  <div className="text-center mb-6">
                    <h3 className="font-black text-slate-800 text-lg">Mapeamento Clínico Visual</h3>
                    <p className="text-sm text-slate-500">Clique na área do corpo para adicionar uma lesão, nódulo ou dor.</p>
                  </div>
                  
                  {/* Mock of a Body Map */}
                  <div className="relative w-full max-w-md h-[400px] bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center justify-center p-8">
                     <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                       {/* Placeholder for the vector graphic of a dog */}
                       <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                          <path d="M14.267 8.7a2 2 0 0 1 1.395-.9l8-1a2 2 0 0 1 2.238 2.268l-1.39 8.34A2 2 0 0 1 22.544 19h-1.896a2 2 0 0 1-1.95-1.559l-1.09-4.881"/>
                          <path d="M10 14h.01"/>
                          <path d="M14 14h.01"/>
                          <path d="M17.3 11a5.002 5.002 0 0 0-7.3-3c-1.386.814-2.5 2.656-2.5 4.5V14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.5"/>
                       </svg>
                     </div>

                     {/* Mock Pins */}
                     <div className="absolute top-[30%] left-[40%] w-6 h-6 bg-rose-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer group hover:scale-125 transition-transform">
                       <span className="absolute -top-10 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Nódulo (2cm)</span>
                     </div>
                     <div className="absolute top-[60%] right-[30%] w-6 h-6 bg-amber-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer group hover:scale-125 transition-transform">
                       <span className="absolute -top-10 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Dor a palpação</span>
                     </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> Lesão/Nódulo</span>
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> Dor</span>
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Alopecia</span>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="p-6 flex-grow flex flex-col bg-slate-50 overflow-y-auto">
                  <div className="mb-6">
                    <h3 className="font-black text-slate-800 text-lg">Prontuários e Histórico Anterior</h3>
                    <p className="text-sm text-slate-500">Revise os atendimentos passados de Bolinha antes de tomar uma decisão clínica.</p>
                  </div>
                  
                  <div className="space-y-4">
                     <Card className="p-5 border-slate-200 shadow-sm bg-white cursor-pointer hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                           <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-slate-400" />
                             <span className="font-bold text-slate-700">12 de Março, 2026</span>
                           </div>
                           <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">Consulta Rotina</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4"><strong>Avaliação:</strong> Animal apresentava quadro leve de dermatite alérgica por picada de pulga. Foi receitado Simparic e banho terapêutico.</p>
                        <Button variant="outline" className="w-full text-xs font-bold border-slate-200 text-slate-600 h-8">Ver Prontuário Completo</Button>
                     </Card>

                     <Card className="p-5 border-slate-200 shadow-sm bg-white cursor-pointer hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                           <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-slate-400" />
                             <span className="font-bold text-slate-700">05 de Dezembro, 2025</span>
                           </div>
                           <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold">Cirurgia</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4"><strong>Procedimento:</strong> Castração Eletiva. Procedimento ocorreu sem intercorrências. Recuperação anestésica excelente.</p>
                        <Button variant="outline" className="w-full text-xs font-bold border-slate-200 text-slate-600 h-8">Ver Ficha Cirúrgica</Button>
                     </Card>
                     
                     <Card className="p-5 border-slate-200 shadow-sm bg-white cursor-pointer hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                           <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-slate-400" />
                             <span className="font-bold text-slate-700">22 de Agosto, 2025</span>
                           </div>
                           <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">Vacinação</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4"><strong>Aplicação:</strong> V10 importada e Antirrábica. Paciente calmo, sem reações imediatas.</p>
                        <Button variant="outline" className="w-full text-xs font-bold border-slate-200 text-slate-600 h-8">Ver Certificado</Button>
                     </Card>
                  </div>
                </div>
              )}
           </Card>
        </div>

        {/* RIGHT COLUMN: Magic Actions */}
        <div className="lg:col-span-3 space-y-4">
           <h3 className="font-black text-slate-800 mb-4 px-2 uppercase tracking-wider text-sm">Ferramentas Mágicas</h3>
           
           <Button 
             className="w-full h-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-6 rounded-3xl shadow-lg transition-all flex flex-col items-start gap-4 group"
             onClick={() => showToast("Smart Dose ativado! Receita gerada.")}
           >
             <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md group-hover:scale-110 transition-transform">
               <Syringe className="w-8 h-8" />
             </div>
             <div className="text-left">
               <h4 className="text-xl font-black">Smart Dose</h4>
               <p className="text-emerald-100 text-sm font-medium mt-1">Criar receita com cálculo automático de dosagem (Lê os 12.5kg do paciente).</p>
             </div>
           </Button>

           <Button 
             className="w-full h-auto bg-white hover:bg-indigo-50 border border-slate-200 p-6 rounded-3xl shadow-sm transition-all flex items-center gap-4 group text-left"
             onClick={() => showToast("Abrindo painel de exames...")}
           >
             <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               <TestTube className="w-6 h-6" />
             </div>
             <div>
               <h4 className="font-bold text-slate-800">Solicitar Exames</h4>
               <p className="text-xs font-medium text-slate-500 mt-1">Laboratório ou Imagem</p>
             </div>
           </Button>

           <Button 
             className="w-full h-auto bg-white hover:bg-rose-50 border border-slate-200 p-6 rounded-3xl shadow-sm transition-all flex items-center gap-4 group text-left"
             onClick={() => showToast("Solicitando internação no sistema...")}
           >
             <div className="p-4 bg-rose-100 rounded-2xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
               <Activity className="w-6 h-6" />
             </div>
             <div>
               <h4 className="font-bold text-slate-800">Internar Paciente</h4>
               <p className="text-xs font-medium text-slate-500 mt-1">Enviar para UTI/Enfermagem</p>
             </div>
           </Button>

           <Button className="w-full h-auto bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm transition-all flex items-center gap-4 group text-left">
             <div className="p-4 bg-slate-100 rounded-2xl text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
               <FileText className="w-6 h-6" />
             </div>
             <div>
               <h4 className="font-bold text-slate-800">Documentos</h4>
               <p className="text-xs font-medium text-slate-500 mt-1">Atestados, Termos, Carteirinha</p>
             </div>
           </Button>
        </div>

      </div>
    </div>
  );
}
