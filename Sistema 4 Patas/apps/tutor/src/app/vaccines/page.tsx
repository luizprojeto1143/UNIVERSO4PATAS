'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Syringe, ShieldCheck, AlertCircle } from 'lucide-react';

export default function VaccinesPage() {
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
          <Syringe className="w-6 h-6 mr-2 text-indigo-600" /> Caderneta de Vacinas
        </h1>
        <p className="text-sm text-slate-500 mt-1">Acompanhe a imunização dos seus pets</p>
      </div>

      <div className="px-6 mt-6 space-y-8">
        {data?.patients?.map((pet: any) => (
          <div key={pet.id} className="space-y-4">
            <h2 className="text-lg font-bold text-slate-700">{pet.name}</h2>
            
            {pet.vaccines?.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {pet.vaccines.map((vac: any, idx: number) => {
                  const isOverdue = new Date(vac.nextDueDate) < new Date();
                  return (
                    <div key={vac.id} className={`p-4 flex items-center space-x-4 ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isOverdue ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                        {isOverdue ? <AlertCircle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{vac.name}</h4>
                        <p className="text-xs text-slate-500">
                          Aplicada em: {new Date(vac.appliedAt).toLocaleDateString('pt-BR')}
                        </p>
                        <p className={`text-xs font-bold mt-1 ${isOverdue ? 'text-red-500' : 'text-slate-600'}`}>
                          {isOverdue ? 'Atrasada desde: ' : 'Próxima dose: '}
                          {new Date(vac.nextDueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-100 rounded-xl p-4 text-center text-slate-500 text-sm">
                Nenhuma vacina registrada para {pet.name}.
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}
