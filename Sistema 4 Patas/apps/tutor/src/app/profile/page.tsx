'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { User, LogOut, Phone, Mail, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const [tutor, setTutor] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const tutorData = localStorage.getItem('tutor_data');
    if (!tutorData) {
      router.push('/login');
    } else {
      setTutor(JSON.parse(tutorData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('tutor_token');
    localStorage.removeItem('tutor_data');
    router.push('/login');
  };

  if (!tutor) return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-indigo-600 pt-12 pb-24 px-6 text-white relative">
        <h1 className="text-2xl font-bold flex items-center">
          Meu Perfil
        </h1>
      </div>

      <div className="px-6 -mt-16 relative z-10 space-y-6">
        
        {/* Tutor Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 text-center">{tutor.name}</h2>
          <p className="text-sm text-slate-500 mb-6">CPF: {tutor.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</p>

          <div className="w-full space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <Phone className="w-5 h-5 text-indigo-500" />
              <span className="text-sm text-slate-700 font-medium">{tutor.phone || 'Não informado'}</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <Mail className="w-5 h-5 text-indigo-500" />
              <span className="text-sm text-slate-700 font-medium">{tutor.email || 'Não informado'}</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <span className="text-sm text-slate-700 font-medium">Endereço cadastrado na clínica</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair da conta</span>
        </button>

      </div>

      <BottomNavigation />
    </div>
  );
}
