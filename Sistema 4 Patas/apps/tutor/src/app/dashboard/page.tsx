'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Bell, HeartPulse, ShieldAlert, FileSignature, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('tutor_token');
        if (!token) throw new Error('Não autenticado');

        const res = await fetch('http://localhost:3000/tutor-portal/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('tutor_token');
            router.push('/login');
            return;
          }
          throw new Error('Erro ao carregar dados');
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        if (err.message === 'Não autenticado') {
          router.push('/login');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Carregando seus pets...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {/* App Bar */}
      <div className="bg-indigo-600 rounded-b-3xl pt-12 pb-8 px-6 text-white shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Bem-vindo de volta,</p>
            <h1 className="text-2xl font-bold">{data?.tutor?.name.split(' ')[0]} 👋</h1>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bell className="w-5 h-5 text-white" />
            </div>
            {data?.pendingSignatures?.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-600"></div>
            )}
          </div>
        </div>

        {/* Quick Alerts */}
        <div className="absolute -bottom-8 left-6 right-6 space-y-2">
          {data?.upcomingAppointments?.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-xl text-slate-800 flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Consulta Agendada</h3>
                <p className="text-xs text-slate-500">
                  {new Date(data.upcomingAppointments[0].date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })} - {data.upcomingAppointments[0].patient?.name}
                </p>
              </div>
            </div>
          )}

          {data?.pendingSignatures?.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-xl border-l-4 border-l-amber-500 text-slate-800 flex items-center space-x-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                <FileSignature className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Assinatura Pendente</h3>
                <p className="text-xs text-slate-500">Um termo precisa da sua assinatura.</p>
              </div>
              <Link href={`/sign/${data.pendingSignatures[0].magicToken}`} className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/30">
                Assinar
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className={`px-6 ${(data?.upcomingAppointments?.length > 0 && data?.pendingSignatures?.length > 0) ? 'mt-32' : ((data?.upcomingAppointments?.length > 0 || data?.pendingSignatures?.length > 0) ? 'mt-14' : 'mt-6')}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Meus Pets 🐾</h2>
          <Link href="/pets/add" className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-200 transition-colors">
            + Novo Pet
          </Link>
        </div>
        
        <div className="space-y-4">
          {data?.patients?.map((pet: any) => (
            <div key={pet.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner">
                  <HeartPulse className="w-8 h-8 opacity-50" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">{pet.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{pet.species || 'Cão'} • {pet.breed || 'SRD'}</p>
                  <div className="flex space-x-2 mt-2">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center">
                      <ShieldAlert className="w-3 h-3 mr-1" /> Saúdavel
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
                      {pet.weight ? `${pet.weight}kg` : '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center relative z-10">
                <div className="text-xs text-slate-500">
                  Próx. Vacina: <span className="font-bold text-slate-700">
                    {pet.vaccines?.length > 0 ? new Date(pet.vaccines[0].nextDueDate).toLocaleDateString('pt-BR') : 'Sem previsão'}
                  </span>
                </div>
                <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg">
                  Ver Perfil
                </button>
              </div>
              {/* Decorative blob */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-50 rounded-full opacity-50 z-0"></div>
            </div>
          ))}

          {data?.patients?.length === 0 && (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-500">Nenhum pet encontrado.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
