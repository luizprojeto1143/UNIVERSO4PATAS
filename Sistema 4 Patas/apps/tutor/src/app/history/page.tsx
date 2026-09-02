'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FileText, Stethoscope, FileSignature } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('tutor_token');
        if (!token) return router.push('/login');

        const res = await fetch('http://localhost:3000/tutor-portal/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setData(await res.json());
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white pt-12 pb-6 px-6 border-b border-slate-200 sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-600" /> Histórico
        </h1>
        <p className="text-sm text-slate-500 mt-1">Prontuários e Documentos</p>
      </div>

      <div className="px-6 mt-6 space-y-8">
        
        {/* Documentos Pendentes */}
        {data?.pendingSignatures?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Aguardando Assinatura</h2>
            {data.pendingSignatures.map((doc: any) => (
              <div key={doc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                    <FileSignature className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{doc.title}</h4>
                    <p className="text-xs text-slate-500">Documento pendente de assinatura digital.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/sign/${doc.magicToken}`} className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    Assinar Agora
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prontuários (Clinical Records) */}
        {data?.patients?.map((pet: any) => (
          <div key={pet.id} className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Histórico: {pet.name}</h2>
            
            {pet.clinicalRecords?.length > 0 ? (
              <div className="space-y-3">
                {pet.clinicalRecords.map((record: any) => (
                  <div key={record.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2 text-indigo-600">
                        <Stethoscope className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">{record.recordType}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-slate-600">
                      <p className="font-medium text-slate-800 mb-1">Motivo da visita:</p>
                      <p className="italic">"{record.notes}"</p>
                    </div>

                    {record.prescriptions && (
                      <div className="mt-3 pt-3 border-t border-slate-50">
                        <p className="text-xs font-bold text-slate-500 mb-1">Prescrição:</p>
                        <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded-lg">{record.prescriptions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-100 rounded-xl p-4 text-center text-slate-500 text-sm">
                Nenhum histórico registrado.
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}
