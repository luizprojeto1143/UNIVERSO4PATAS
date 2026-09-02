"use client";
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, Smartphone, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PortalLoginPage() {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 8) {
      setStep('code');
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4) {
      router.push('/portal');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-4">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center">Clínica 4 Patas</h1>
          <p className="text-slate-500 font-medium text-center mt-1">Portal do Tutor</p>
        </div>

        <Card className="p-6 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-3xl bg-white/80 backdrop-blur-sm">
          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Bem-vindo de volta!</h2>
                <p className="text-sm text-slate-500 font-medium mb-6">Digite seu CPF ou número de WhatsApp para acessar.</p>
                
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 90000-0000 ou CPF"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all text-lg"
                    autoFocus
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-lg shadow-lg shadow-indigo-200 transition-all">
                Continuar <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Código de segurança</h2>
                <p className="text-sm text-slate-500 font-medium mb-6">Enviamos um código de 4 dígitos para o seu WhatsApp final <strong className="text-slate-700">{phone.slice(-4)}</strong>.</p>
                
                <div className="flex gap-3 justify-center mb-6">
                  {/* Mocking a 4 digit input */}
                  {[1,2,3,4].map((_, i) => (
                    <Input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-14 h-16 bg-slate-50 border border-slate-200 rounded-2xl text-center text-2xl font-black text-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      onChange={(e) => {
                        if (e.target.value && i < 3) {
                          const next = e.target.nextElementSibling as HTMLInputElement;
                          if (next) next.focus();
                        }
                        setCode(prev => prev.length < 4 ? prev + e.target.value : prev);
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-lg shadow-lg shadow-indigo-200 transition-all">
                Entrar
              </Button>
              
              <div className="text-center">
                <Button type="button" onClick={() => setStep('phone')} className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  Voltar e editar número
                </Button>
              </div>
            </form>
          )}
        </Card>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Acesso Seguro</span>
          </div>
        </div>

      </div>
    </div>
  );
}
