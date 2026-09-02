'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileSignature, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignDocumentPage({ params }: { params: { token: string } }) {
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const token = localStorage.getItem('tutor_token');
        if (!token) throw new Error('Não autenticado');

        const res = await fetch(`http://localhost:3000/tutor-portal/signature/${params.token}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Documento não encontrado ou sem permissão');

        const result = await res.json();
        setDoc(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [params.token]);

  const handleSign = async () => {
    setSigning(true);
    try {
      const token = localStorage.getItem('tutor_token');
      const res = await fetch(`http://localhost:3000/tutor-portal/signature/${params.token}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ipAddress: '192.168.1.1' }) // Mock IP for MVP
      });

      if (!res.ok) throw new Error('Erro ao assinar');

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: any) {
      alert(err.message);
      setSigning(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
      <ShieldCheck className="w-8 h-8" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">Erro</h2>
    <p className="text-slate-500 mb-6">{error}</p>
    <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200">Voltar</Link>
  </div>;

  if (success) return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-6 text-center text-white">
      <CheckCircle2 className="w-20 h-20 text-green-400 mb-6 animate-bounce" />
      <h1 className="text-3xl font-black mb-2 tracking-tight">Assinado!</h1>
      <p className="text-indigo-200 text-lg font-medium mb-8">O documento foi assinado digitalmente com sucesso. A clínica já foi notificada.</p>
      <div className="flex items-center gap-2 text-indigo-300 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Retornando ao dashboard...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-indigo-600 pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold">Assinatura Digital</h1>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 rotate-3 shadow-sm border border-amber-200">
              <FileSignature className="w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center mb-8 border-b border-dashed border-slate-200 pb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{doc.title}</h2>
            <p className="text-slate-500 mt-2 font-medium">Paciente: <span className="font-bold text-indigo-600">{doc.patientName}</span></p>
            <p className="text-xs text-slate-400 mt-1">Gerado em: {new Date(doc.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8 max-h-[40vh] overflow-y-auto">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
              {doc.content}
            </p>
          </div>

          {doc.status === 'SIGNED' ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold border border-green-200">
              <CheckCircle2 className="w-6 h-6" />
              Documento já assinado
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium">
                  Ao clicar em "Li e Aceito", você assina digitalmente este documento, gerando um registro com validade legal atrelado ao seu perfil e IP.
                </p>
              </div>
              
              <button 
                onClick={handleSign}
                disabled={signing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 active:scale-95"
              >
                {signing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Assinando...</>
                ) : (
                  <><FileSignature className="w-5 h-5" /> Li e Aceito (Assinar Digitalmente)</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
