'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Home, Calendar, FlaskConical, ChevronLeft, HeartPulse, CheckCircle2, ChevronRight, AlertTriangle, MessageCircle, Loader2 } from 'lucide-react';

export default function TutorAppointmentsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceService = searchParams ? searchParams.get('service') : null;
  const forcePet = searchParams ? searchParams.get('pet') : null;

  const [toastMsg, setToastMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);

  // Inicializa o state dependendo se veio algum parâmetro da URL
  const [step, setStep] = useState(forceService ? 3 : 1);
  const [selectedPet, setSelectedPet] = useState(forcePet || '');
  const [selectedService, setSelectedService] = useState(forceService || '');
  
  // Date and Time selection
  const [selectedDate, setSelectedDate] = useState('14/08');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Estado para simular busca em tempo real na API da clínica
  const [isFetchingTimes, setIsFetchingTimes] = useState(false);
  const [liveTimes, setLiveTimes] = useState<string[]>([]);

  // Flag para controle do bloqueio do WhatsApp
  const [showWhatsappBlock, setShowWhatsappBlock] = useState(false);

  const navItems = [
    { href: '/pwa/tutor', label: 'Home', icon: Home },
    { href: '/pwa/tutor/appointments', label: 'Agenda', icon: Calendar },
    { href: '/pwa/tutor/hospitalization', label: 'Internação', icon: HeartPulse },
    { href: '/pwa/tutor/results', label: 'Exames', icon: FlaskConical },
  ];

  const pets = [
    { name: 'Thor', daysSinceConsult: 12 }, // Elegível
    { name: 'Luna', daysSinceConsult: 45 }  // Não elegível
  ];

  const availableDates = [
    { date: '14/08', dayName: 'Amanhã' },
    { date: '15/08', dayName: 'Qua' },
    { date: '16/08', dayName: 'Qui' },
    { date: '17/08', dayName: 'Sex' },
    { date: '18/08', dayName: 'Sáb' },
  ];

  const showToast = (text: string, type: 'success'|'error' = 'success') => {
    setToastMsg({text, type});
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleServiceSelect = (svcName: string) => {
    if (svcName === 'Retorno') {
      const petInfo = pets.find(p => p.name === selectedPet);
      if (petInfo && petInfo.daysSinceConsult > 30) {
        setShowWhatsappBlock(true);
        return;
      }
    }
    setSelectedService(svcName);
    setStep(3);
    fetchLiveAvailability('14/08', svcName); // Busca a primeira data ao entrar no passo 3
  };

  const handleConfirm = () => {
    showToast('Agendamento confirmado!', 'success');
    setTimeout(() => router.push('/pwa/tutor'), 1500);
  };

  // Simula a busca ao vivo na agenda da recepção
  const fetchLiveAvailability = (date: string, service: string) => {
    setIsFetchingTimes(true);
    setSelectedTime(''); // Reseta o horário selecionado ao mudar de dia
    
    setTimeout(() => {
      let baseTimes = [];
      if (service === 'Vacinação') {
        baseTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
      } else {
        baseTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      }
      
      // Simula que alguns horários já foram ocupados na recepção naquele dia
      // (Remove aleatoriamente alguns horários da grade para mostrar a regra de "tempo real")
      const randomSeed = date.charCodeAt(0) + date.charCodeAt(1); 
      const filteredTimes = baseTimes.filter((_, idx) => (idx + randomSeed) % 3 !== 0);
      
      setLiveTimes(filteredTimes);
      setIsFetchingTimes(false);
    }, 800); // 800ms de delay para simular a requisição de rede
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    fetchLiveAvailability(date, selectedService);
  };

  // Carrega inicial caso entre direto no passo 3 via URL
  useEffect(() => {
    if (step === 3 && liveTimes.length === 0) {
       fetchLiveAvailability(selectedDate, selectedService);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans relative">
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 w-[90%] text-center rounded-xl shadow-lg text-white text-sm font-bold flex justify-center items-center gap-2 ${toastMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toastMsg.text}
        </div>
      )}
      
      {/* Header */}
      <header className="bg-orange-500 text-white pt-12 pb-6 px-5 shadow-md rounded-b-[2rem] sticky top-0 z-30 bg-gradient-to-br from-orange-500 to-rose-500">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="p-2 bg-white/20 rounded-full active:bg-white/30">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Novo Agendamento</h1>
        </div>
        
        {/* Progress */}
        <div className="flex gap-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="font-bold text-lg text-slate-700 mb-4">1. Qual pet você quer agendar?</h2>
            <div className="space-y-3">
              {pets.map(pet => (
                <button 
                  key={pet.name}
                  onClick={() => { setSelectedPet(pet.name); setStep(2); setShowWhatsappBlock(false); }}
                  className={`w-full p-4 rounded-3xl border text-left flex items-center justify-between transition-colors ${selectedPet === pet.name ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-slate-200 text-slate-700'}`}
                >
                  <span className="font-bold text-lg">{pet.name}</span>
                  <ChevronRight size={20} className={selectedPet === pet.name ? 'text-orange-500' : 'text-slate-400'} />
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">💡 Dica de teste: Thor consultou há 12 dias. Luna consultou há 45 dias.</p>
          </div>
        )}

        {step === 2 && !showWhatsappBlock && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="font-bold text-lg text-slate-700 mb-4">2. Qual o serviço para o {selectedPet}?</h2>
            <div className="space-y-3">
              {[
                { name: 'Consulta Clínica', desc: 'Avaliação geral com clínico' },
                { name: 'Retorno', desc: 'Reavaliação (Gratuito até 30 dias)' },
                { name: 'Vacinação', desc: 'Atualização da carteirinha' }
              ].map(svc => (
                <button 
                  key={svc.name}
                  onClick={() => handleServiceSelect(svc.name)}
                  className={`w-full p-4 rounded-3xl border text-left flex flex-col justify-center transition-colors ${selectedService === svc.name ? 'bg-orange-50 border-orange-500' : 'bg-white border-slate-200'}`}
                >
                  <span className={`font-bold text-lg ${selectedService === svc.name ? 'text-orange-700' : 'text-slate-800'}`}>{svc.name}</span>
                  <span className="text-sm text-slate-500 font-medium">{svc.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bloqueio de Retorno > 30 Dias */}
        {step === 2 && showWhatsappBlock && (
          <div className="animate-in zoom-in-95 duration-300 bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center shadow-lg mt-10">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="font-bold text-xl text-red-800 mb-2">Prazo Expirado</h3>
            <p className="text-red-700/80 text-sm mb-6 leading-relaxed font-medium">
              A última consulta de {selectedPet} ocorreu há mais de 30 dias. O direito ao Retorno gratuito expirou. 
              Por favor, entre em contato com nossa equipe via WhatsApp para análise do caso.
            </p>
            
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 text-white font-bold text-lg h-14 rounded-2xl flex items-center justify-center gap-2 shadow-md active:bg-emerald-600 transition-colors"
            >
              <MessageCircle size={20} /> Falar no WhatsApp
            </a>
            
            <button 
              onClick={() => setShowWhatsappBlock(false)}
              className="mt-4 text-sm font-bold text-slate-400 active:text-slate-600 underline"
            >
              Voltar aos serviços
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="font-bold text-lg text-slate-700 mb-4">3. Escolha data e horário</h2>
            
            {/* Seletor de Data */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {availableDates.map(d => (
                  <button 
                    key={d.date}
                    onClick={() => handleDateChange(d.date)}
                    className={`flex flex-col items-center justify-center min-w-[72px] h-20 rounded-2xl border transition-colors shadow-sm ${selectedDate === d.date ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-600 active:bg-slate-50'}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{d.dayName}</span>
                    <span className="text-lg font-bold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seletor de Horário com Verificação Ao Vivo */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6 min-h-[160px]">
              <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center justify-between">
                <span>Horários Livres</span>
                {selectedService === 'Vacinação' ? (
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Duração: 30 min</span>
                ) : (
                  <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Duração: 1 hora</span>
                )}
              </h3>
              
              {isFetchingTimes ? (
                <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                  <Loader2 className="animate-spin mb-2 text-orange-500" size={24} />
                  <span className="text-xs font-bold animate-pulse">Sincronizando com a recepção...</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-300">
                  {liveTimes.length > 0 ? liveTimes.map(time => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`h-12 rounded-xl font-bold text-sm border transition-colors ${selectedTime === time ? 'bg-orange-500 border-orange-500 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 active:bg-slate-100'}`}
                    >
                      {time}
                    </button>
                  )) : (
                     <div className="col-span-3 text-center py-4 text-sm text-slate-400">Nenhum horário livre neste dia.</div>
                  )}
                </div>
              )}
            </div>

            {selectedDate && selectedTime && (
              <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5 mb-6 animate-in fade-in">
                <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2"><CheckCircle2 size={18}/> Resumo</h3>
                <p className="text-orange-700 text-sm mb-1"><strong>Pet:</strong> {selectedPet}</p>
                <p className="text-orange-700 text-sm mb-1"><strong>Serviço:</strong> {selectedService}</p>
                <p className="text-orange-700 text-sm"><strong>Quando:</strong> {availableDates.find(d => d.date === selectedDate)?.dayName} ({selectedDate}) às {selectedTime}</p>
              </div>
            )}

            <button 
              onClick={handleConfirm}
              disabled={!selectedTime || isFetchingTimes}
              className="w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-orange-500 text-white active:bg-orange-600 shadow-md"
            >
              Confirmar Agendamento
            </button>
          </div>
        )}

      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40 pb-safe">
        {navItems.map(item => {
          const isActive = pathname?.startsWith(item.href) && item.href !== '/pwa/tutor';
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors ${isActive ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}>
              <item.icon size={24} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
