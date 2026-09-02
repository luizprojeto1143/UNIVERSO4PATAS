"use client";
import Image from 'next/image';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Heart, Syringe, FileText, DollarSign, Calendar, ChevronRight, CheckCircle2, QrCode, Download, Settings, Bone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TutorApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'vaccines' | 'exams' | 'finance'>('home');

  const pet = {
    name: 'Bolinha',
    breed: 'Golden Retriever',
    age: '3 anos',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80'
  };

  const upcomingVaccines = [
    { name: 'V10 (Reforço Anual)', date: '15/08/2026', status: 'pending' },
    { name: 'Antirrábica', date: '15/08/2026', status: 'pending' },
  ];

  const pastVaccines = [
    { name: 'V10 (3Âª Dose)', date: '10/08/2025', doctor: 'Dr. Roberto' },
    { name: 'Vermífugo (Milbemax)', date: '05/06/2026', doctor: 'Em casa' },
  ];

  const exams = [
    { name: 'Hemograma Completo', date: '30/07/2026', status: 'Pronto', type: 'Sangue' },
    { name: 'Ultrassom Abdominal', date: '30/07/2026', status: 'Em Análise', type: 'Imagem' },
  ];

  return (
    <div className="bg-slate-100 min-h-screen pb-20">
      
      {/* Mobile Frame Simulation for Desktop */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl">
        
        {/* App Header */}
        <div className="bg-indigo-600 px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-lg sticky top-0 z-40">
           <div className="flex justify-between items-center text-white mb-6">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                   <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                </div>
                <span className="font-black tracking-widest text-sm uppercase">4Patas App</span>
             </div>
             <div className="relative">
               <Bell className="w-6 h-6 text-indigo-200 hover:text-white transition-colors" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-indigo-600"></span>
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-indigo-400/30">
               <img src={pet.photo} alt="Pet" className="w-full h-full object-cover" width={500} height={500} />
             </div>
             <div>
               <h1 className="text-2xl font-black text-white">{pet.name}</h1>
               <p className="text-indigo-200 text-sm font-medium">{pet.breed} â€¢ {pet.age}</p>
             </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
               
               {/* Health Score */}
               <Card className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-6 text-white border-0 shadow-lg shadow-emerald-500/20">
                 <div className="flex justify-between items-center mb-4">
                   <h2 className="font-bold text-emerald-50 flex items-center gap-2">
                     <ShieldCheck className="w-5 h-5" /> Saúde em Dia
                   </h2>
                   <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black backdrop-blur-sm">ÓTIMO</span>
                 </div>
                 <p className="text-sm text-emerald-50 mb-4">O peso do Bolinha está ideal (32kg) e não há medicações pendentes para hoje.</p>
                 <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl text-sm">
                   <Calendar className="w-4 h-4 mr-2" /> Solicitar Agendamento
                 </Button>
               </Card>

               {/* Quick Actions */}
               <div className="grid grid-cols-4 gap-4">
                 <Button onClick={() => setActiveTab('vaccines')} className="flex flex-col items-center gap-2 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                     <Syringe className="w-6 h-6 text-indigo-600" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-600 uppercase">Vacinas</span>
                 </Button>
                 <Button onClick={() => setActiveTab('exams')} className="flex flex-col items-center gap-2 group">
                   <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                     <FileText className="w-6 h-6 text-rose-600" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-600 uppercase">Exames</span>
                 </Button>
                 <Button onClick={() => setActiveTab('finance')} className="flex flex-col items-center gap-2 group relative">
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full z-10"></div>
                   <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                     <DollarSign className="w-6 h-6 text-amber-600" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-600 uppercase">Faturas</span>
                 </Button>
                 <Button className="flex flex-col items-center gap-2 group">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors border border-slate-200">
                     <Settings className="w-6 h-6 text-slate-500" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-600 uppercase">Perfil</span>
                 </Button>
               </div>

               {/* Upcoming Alerts */}
               <div>
                 <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                   <Bell className="w-5 h-5 text-rose-500" /> Próximos Vencimentos
                 </h3>
                 <div className="space-y-3">
                   {upcomingVaccines.map((v, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                           <Syringe className="w-5 h-5 text-rose-500" />
                         </div>
                         <div>
                           <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                           <p className="text-xs text-rose-500 font-bold">{v.date}</p>
                         </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}

          {/* VACCINES TAB */}
          {activeTab === 'vaccines' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="font-black text-slate-800 text-xl mb-6">Carteirinha Digital</h3>
               
               <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8">
                 {pastVaccines.map((v, i) => (
                   <div key={i} className="relative">
                     <div className="absolute -left-[31px] bg-indigo-500 w-4 h-4 rounded-full border-4 border-white"></div>
                     <p className="text-xs font-bold text-indigo-500 mb-1">{v.date}</p>
                     <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                       <p className="font-bold text-slate-800 mb-1">{v.name}</p>
                       <p className="text-xs text-slate-500 font-medium">Aplicado por: {v.doctor}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* EXAMS TAB */}
          {activeTab === 'exams' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
               <h3 className="font-black text-slate-800 text-xl mb-2">Meus Exames</h3>
               <p className="text-sm text-slate-500 mb-6">Acesse os laudos laboratoriais e de imagem.</p>
               
               {exams.map((exam, i) => (
                 <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="font-bold text-slate-800 text-sm">{exam.name}</p>
                       <p className="text-xs text-slate-400 font-medium">{exam.date}</p>
                     </div>
                     <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${exam.status === 'Pronto' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                       {exam.status}
                     </span>
                   </div>
                   {exam.status === 'Pronto' && (
                     <Button className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-indigo-600 transition-colors">
                       <Download className="w-4 h-4" /> Baixar PDF
                     </Button>
                   )}
                 </div>
               ))}
            </div>
          )}

          {/* FINANCE TAB */}
          {activeTab === 'finance' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="font-black text-slate-800 text-xl mb-6">Faturas em Aberto</h3>
               
               <Card className="p-6 bg-slate-800 border-slate-700 rounded-3xl text-white relative overflow-hidden">
                 <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl"></div>
                 
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Consulta Especialista + Vacina</p>
                 <div className="flex items-end gap-2 mb-6">
                   <span className="text-slate-400 font-bold mb-1">R$</span>
                   <span className="text-4xl font-black">320,00</span>
                 </div>
                 
                 <p className="text-sm text-slate-300 mb-6">Vencimento: Hoje (31/07/2026)</p>
                 
                 <div className="bg-white rounded-2xl p-4 flex flex-col items-center">
                    <QrCode className="w-32 h-32 text-slate-900 mb-2" />
                    <p className="text-xs font-bold text-slate-500">Escaneie para pagar via Pix</p>
                 </div>
                 
                 <Button className="w-full mt-4 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-sm transition-colors">
                   Copiar Código Pix
                 </Button>
               </Card>
            </div>
          )}

        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
           <Button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}>
             <Bone className={`w-6 h-6 ${activeTab === 'home' ? 'fill-indigo-600' : ''}`} />
             <span className="text-[10px] font-bold">Início</span>
           </Button>
           <Button onClick={() => setActiveTab('vaccines')} className={`flex flex-col items-center gap-1 ${activeTab === 'vaccines' ? 'text-indigo-600' : 'text-slate-400'}`}>
             <Syringe className={`w-6 h-6 ${activeTab === 'vaccines' ? 'fill-indigo-600' : ''}`} />
             <span className="text-[10px] font-bold">Saúde</span>
           </Button>
           <Button onClick={() => setActiveTab('finance')} className={`flex flex-col items-center gap-1 relative ${activeTab === 'finance' ? 'text-indigo-600' : 'text-slate-400'}`}>
             <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></div>
             <DollarSign className="w-6 h-6" />
             <span className="text-[10px] font-bold">Financeiro</span>
           </Button>
        </div>

      </div>
    </div>
  );
}
