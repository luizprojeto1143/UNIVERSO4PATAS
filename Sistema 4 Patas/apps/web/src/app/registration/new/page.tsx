"use client";
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Dog, Camera, CheckCircle2, Plus, Info, AlertTriangle, ShieldCheck, Heart, MapPin, Bone, Scissors, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PremiumRegistrationPage() {
  const [step, setStep] = useState(1);
  const [pets, setPets] = useState([1]); // Array of pet forms to allow multiple

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const addPet = () => setPets([...pets, pets.length + 1]);

  return (
    <div className="pb-12 max-w-5xl mx-auto p-4 md:p-8 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Novo Cadastro</h1>
          <p className="text-slate-500 font-medium mt-1">Integração de Tutor e Pacientes</p>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${step >= 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
            1
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-indigo-800' : 'text-slate-400'}`}>Tutor</span>
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${step >= 2 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
            2
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-indigo-800' : 'text-slate-400'}`}>Pacientes</span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${step >= 3 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
            3
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${step >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>Conclusão</span>
        </div>
      </div>

      {/* Step 1: TUTOR */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-indigo-500" /> Dados Pessoais do Tutor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Nome Completo *</label>
                 <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ex: João da Silva" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">CPF / RG *</label>
                 <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="000.000.000-00" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">WhatsApp *</label>
                 <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="(00) 90000-0000" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">E-mail</label>
                 <Input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="joao@email.com" />
               </div>
            </div>
          </Card>

          <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-indigo-500" /> Endereço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2 md:col-span-1">
                 <label className="text-sm font-bold text-slate-700">CEP</label>
                 <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="00000-000" />
               </div>
               <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-bold text-slate-700">Rua / Avenida</label>
                 <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Número</label>
                 <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
               </div>
               <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-bold text-slate-700">Complemento</label>
                 <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Apto, Bloco, Casa 2..." />
               </div>
            </div>
          </Card>

          <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-indigo-50/50 border-dashed">
            <h2 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-500" /> Marketing & Relacionamento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Como conheceu a clínica?</label>
                 <select className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 font-medium">
                    <option>Instagram / Redes Sociais</option>
                    <option>Indicação de Amigo</option>
                    <option>Passou na frente</option>
                    <option>Pesquisa no Google</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Desconto Padrão (VIP/Protetor)</label>
                 <select className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 font-medium">
                    <option>Sem desconto</option>
                    <option>ONG / Protetor (15% OFF)</option>
                    <option>Cliente VIP (10% OFF)</option>
                 </select>
               </div>
            </div>
          </Card>
        </div>
      )}

      {/* Step 2: PATIENT(S) */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {pets.map((petIdx, index) => (
             <div key={petIdx} className="relative">
                {index > 0 && <div className="w-full h-px bg-slate-200 my-8"></div>}
                
                <Card className="p-8 border-slate-200 shadow-lg rounded-3xl bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <Dog className="w-7 h-7 text-teal-600" /> Paciente {index + 1}
                    </h2>
                  </div>

                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Nome do Pet *</label>
                       <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Espécie *</label>
                       <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium">
                          <option>Canino (Cachorro)</option>
                          <option>Felino (Gato)</option>
                          <option>Silvestre / Exótico</option>
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Raça</label>
                       <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="Ex: Poodle, SRD..." />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Sexo</label>
                       <div className="flex gap-2">
                          <Button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 focus:bg-indigo-50 focus:border-indigo-500 focus:text-indigo-700">Macho</Button>
                          <Button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 focus:bg-pink-50 focus:border-pink-500 focus:text-pink-700">Fêmea</Button>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Data de Nasc. (Aprox)</label>
                       <Input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-600" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Microchip</label>
                       <Input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="Opcional" />
                     </div>
                  </div>

                  {/* Informações Clínicas & Comportamentais Premium */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                     <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Perfil Clínico e Comportamental (Premium)
                     </h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Box Comportamento */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                           <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                             <AlertCircle className="w-4 h-4 text-amber-500" /> Nível de Temperamento
                           </h4>
                           <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium mb-3 text-slate-600">
                              <option>Dócil e sociável</option>
                              <option>Assustado / Medroso</option>
                              <option>Reativo / Agressivo (Alerta)</option>
                           </select>
                           <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer">
                              <Input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                              Recomenda-se uso de focinheira?
                           </label>
                        </div>

                        {/* Box Estilo de Vida */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                           <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                             <Bone className="w-4 h-4 text-orange-500" /> Estilo de Vida
                           </h4>
                           <div className="space-y-3">
                             <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-slate-600">
                                <option>Alimentação: Somente Ração Seca</option>
                                <option>Alimentação: Natural / Úmida</option>
                                <option>Alimentação: Mista</option>
                             </select>
                             <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-slate-600">
                                <option>Ambiente: Apenas Indoor (Dentro de casa)</option>
                                <option>Ambiente: Acesso Ã  rua / Passeios frequentes</option>
                             </select>
                           </div>
                        </div>

                        {/* Box Alergias */}
                        <div className="md:col-span-2 bg-rose-50/50 p-5 rounded-xl border border-rose-100">
                           <h4 className="font-bold text-rose-800 flex items-center gap-2 mb-2">
                             <AlertTriangle className="w-4 h-4 text-rose-500" /> Alertas Críticos (Alergias ou Doenças Crônicas)
                           </h4>
                           <textarea 
                             className="w-full bg-white border border-rose-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none text-slate-700 font-medium"
                             placeholder="Ex: Alergia a dipirona, Diabético, Epilético..."
                             rows={2}
                           ></textarea>
                        </div>
                     </div>
                  </div>
                </Card>
             </div>
          ))}

          <Button onClick={addPet} variant="outline" className="w-full py-6 border-dashed border-2 border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 rounded-3xl font-black gap-2 transition-all">
             <Plus className="w-5 h-5" /> Cadastrar mais um pet para este Tutor
          </Button>
        </div>
      )}

      {/* Step 3: CAPTURE & FINISH */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <Card className="p-10 border-slate-200 shadow-sm rounded-3xl bg-white text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                 <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Quase lá!</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                Tutor e {pets.length} pet(s) registrados com sucesso. Deseja capturar as fotos agora pela webcam ou finalizar?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
                 <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors group">
                    <Camera className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-3" />
                    <p className="font-bold text-slate-700">Tirar foto do Tutor</p>
                 </div>
                 <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-teal-300 transition-colors group">
                    <Camera className="w-8 h-8 text-slate-400 group-hover:text-teal-500 mb-3" />
                    <p className="font-bold text-slate-700">Tirar foto do Pet 1</p>
                 </div>
              </div>

              <div className="flex justify-center gap-4">
                 <Button variant="outline" className="font-bold border-slate-300 text-slate-600 rounded-xl px-8 h-12">Pular Fotos</Button>
                 <Link href="/">
                   <Button className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-emerald-600/20">Finalizar e Salvar</Button>
                 </Link>
              </div>
           </Card>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
         <Button 
           onClick={prevStep} 
           disabled={step === 1}
           variant="outline" 
           className="font-bold border-slate-300 text-slate-600 rounded-xl"
         >
            Voltar
         </Button>
         
         {step < 3 && (
           <Button 
             onClick={nextStep} 
             className="font-bold bg-slate-900 hover:bg-indigo-600 text-white rounded-xl px-8 shadow-md transition-colors"
           >
              Avançar Passo {step + 1}
           </Button>
         )}
      </div>

    </div>
  );
}
