'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';

export default function AppointmentsPage() {
  const [data, setData] = useState<any>(null);
  const [veterinarians, setVeterinarians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    patientId: '',
    veterinarianId: '',
    date: '',
    time: ''
  });
  
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tutor_token');
        if (!token) return router.push('/login');

        const [dashRes, vetRes] = await Promise.all([
          fetch('http://localhost:3000/tutor-portal/dashboard', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3000/tutor-portal/veterinarians', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (dashRes.ok && vetRes.ok) {
          const dashData = await dashRes.json();
          const vets = await vetRes.json();
          setData(dashData);
          setVeterinarians(vets);
          if (dashData.patients?.length > 0) {
            setForm(f => ({ ...f, patientId: dashData.patients[0].id }));
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tutor_token');
      const combinedDate = new Date(`${form.date}T${form.time}:00`).toISOString();
      
      const res = await fetch('http://localhost:3000/tutor-portal/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: form.patientId,
          veterinarianId: form.veterinarianId,
          date: combinedDate,
          notes: 'Agendado pelo App do Tutor'
        })
      });

      if (res.ok) {
        setStep(3); // Success step
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white pt-12 pb-6 px-6 border-b border-slate-200 sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <CalendarIcon className="w-6 h-6 mr-2 text-indigo-600" /> Agendar Consulta
        </h1>
        <p className="text-sm text-slate-500 mt-1">Marque um horário para o seu pet</p>
      </div>

      <div className="px-6 mt-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Selecione o Pet</label>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {data?.patients?.map((pet: any) => (
                  <div 
                    key={pet.id} 
                    onClick={() => setForm({...form, patientId: pet.id})}
                    className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all ${form.patientId === pet.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'}`}
                  >
                    <span className="font-bold">{pet.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Profissional</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.veterinarianId}
                onChange={(e) => setForm({...form, veterinarianId: e.target.value})}
              >
                <option value="">Selecione um Veterinário</option>
                {veterinarians.map(v => (
                  <option key={v.id} value={v.id}>{v.email} {v.staffProfile?.crmv ? `(CRMV: ${v.staffProfile.crmv})` : ''}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!form.patientId || !form.veterinarianId}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              Próximo
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Data da Consulta</label>
              <input 
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Horário</label>
              <div className="grid grid-cols-3 gap-3">
                {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                  <div 
                    key={time}
                    onClick={() => setForm({...form, time})}
                    className={`flex items-center justify-center py-3 rounded-xl border-2 cursor-pointer font-bold ${form.time === time ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'}`}
                  >
                    <Clock className="w-4 h-4 mr-1 opacity-70" /> {time}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-300 transition-all"
              >
                Voltar
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!form.date || !form.time || loading}
                className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Consulta Confirmada!</h2>
            <p className="text-slate-500">
              Sua visita foi agendada para o dia <br/>
              <span className="font-bold text-slate-700">{new Date(`${form.date}T${form.time}`).toLocaleDateString('pt-BR')} às {form.time}</span>.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-8 bg-indigo-50 text-indigo-700 font-bold py-3 px-8 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all"
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
