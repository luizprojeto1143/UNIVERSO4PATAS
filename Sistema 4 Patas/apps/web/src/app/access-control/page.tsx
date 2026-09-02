'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, CheckCircle2, ShieldCheck, XCircle, ArrowLeft, Focus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AccessControlPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: GPS, 2: Câmera, 3: Sucesso
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [isCapturing, setIsCapturing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message: string) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };
  
  // Simular verificação de GPS
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setGpsStatus('valid'); // Em um app real, usaria navigator.geolocation
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setStep(3);
      showToast('Acesso registrado com sucesso!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative">
      
      <div className="w-full max-w-md mb-6">
        <Link href="/">
           <Button className="text-slate-400 hover:text-white flex items-center gap-2 font-medium transition-colors">
             <ArrowLeft className="w-4 h-4" /> Cancelar
           </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl rounded-[2rem] overflow-hidden relative">
        
        {/* Cabeçalho */}
        <div className="p-6 text-center border-b border-slate-700/50">
           <h1 className="text-xl font-black text-white flex items-center justify-center gap-2">
             <ShieldCheck className="w-6 h-6 text-emerald-500" /> Controle de Acesso
           </h1>
           <p className="text-slate-400 text-sm mt-1">Validação de Identidade e Local</p>
        </div>

        {/* Passo 1: Validação de GPS */}
        {step === 1 && (
          <div className="p-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
             <div className="w-24 h-24 rounded-full bg-slate-700/50 flex items-center justify-center mb-6 relative">
                <MapPin className={`w-10 h-10 ${gpsStatus === 'valid' ? 'text-emerald-400' : 'text-indigo-400 animate-pulse'}`} />
                {gpsStatus === 'valid' && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-4 border-slate-800">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
             </div>
             
             <h2 className="text-lg font-bold text-white mb-2">
               {gpsStatus === 'checking' ? 'Validando Localização...' : 'Localização Confirmada!'}
             </h2>
             <p className="text-slate-400 text-sm mb-8">
               {gpsStatus === 'checking' 
                 ? 'Aguarde enquanto verificamos se você está na área da clínica.' 
                 : 'Você está dentro do perímetro permitido.'}
             </p>

             <Button 
               onClick={() => setStep(2)}
               disabled={gpsStatus !== 'valid'}
               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-6 rounded-xl"
             >
               Continuar para Câmera
             </Button>
          </div>
        )}

        {/* Passo 2: Captura de Câmera */}
        {step === 2 && (
          <div className="p-6 flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="w-full aspect-[3/4] bg-slate-900 rounded-3xl mb-6 relative overflow-hidden flex items-center justify-center">
                {/* Feed Simulado de Câmera */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 opacity-50"></div>
                
                {/* UI de Guia de Rosto */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-64 border-2 border-dashed border-indigo-400/50 rounded-[4rem] relative">
                    <Focus className="absolute -top-3 -left-3 w-6 h-6 text-indigo-400" />
                    <Focus className="absolute -bottom-3 -right-3 w-6 h-6 text-indigo-400 rotate-180" />
                  </div>
                </div>

                <div className="relative z-10 text-center">
                   <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                   <p className="text-slate-400 font-medium">Câmera Ativa</p>
                </div>
                
                {/* Sobreposição de Tempo Real */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                   {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
             </div>

             <h2 className="text-lg font-bold text-white mb-1">Validação Facial</h2>
             <p className="text-slate-400 text-sm mb-6 text-center">Olhe para a câmera e certifique-se que seu rosto e uniforme estão visíveis.</p>

             <Button 
               onClick={handleCapture}
               disabled={isCapturing}
               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-xl text-lg shadow-lg shadow-indigo-900/50"
             >
               {isCapturing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar Acesso'}
             </Button>
          </div>
        )}

        {/* Passo 3: Sucesso */}
        {step === 3 && (
          <div className="p-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
             <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12" />
             </div>
             
             <h2 className="text-2xl font-black text-white mb-2">Acesso Liberado</h2>
             <p className="text-slate-400 text-sm mb-8">
               Sua identidade e localização foram confirmadas. Bom trabalho!
             </p>

             <div className="w-full bg-slate-900 rounded-xl p-4 mb-8 text-left border border-slate-700">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-500 text-xs font-bold uppercase">Horário</span>
                 <span className="text-white font-mono font-bold">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
               </div>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-500 text-xs font-bold uppercase">Local</span>
                 <span className="text-emerald-400 font-bold text-sm">Clínica (Matriz)</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-slate-500 text-xs font-bold uppercase">Status</span>
                 <span className="text-indigo-400 font-bold text-sm">Entrada Registrada</span>
               </div>
             </div>

             <Link href="/" className="w-full">
               <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-6 rounded-xl">
                 Ir para o Dashboard
               </Button>
             </Link>
          </div>
        )}

      </Card>
      
      <p className="text-slate-500 text-xs font-medium mt-8">Sistema de Segurança e Autenticação</p>

      {/* Notificação Toast */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-50">
          <CheckCircle2 className="w-5 h-5" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
