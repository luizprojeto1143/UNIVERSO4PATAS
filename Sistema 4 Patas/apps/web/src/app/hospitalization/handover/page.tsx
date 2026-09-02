"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ClipboardCheck, CheckCircle2, AlertCircle, Camera, Save, 
  ArrowLeft, Loader2, CheckCircle, Bed, HeartPulse, User, 
  RefreshCcw, ShieldCheck, FileText, History
} from 'lucide-react';
import Link from 'next/link';
import { useHospitalizationStore } from '@/store/useHospitalizationStore';

export default function HandoverFormPage() {
  const { kennels, handovers, submitHandover, activeDoctors } = useHospitalizationStore();

  const [turno, setTurno] = useState<'diurno' | 'noturno'>('diurno');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Identification
  const [outgoingVet, setOutgoingVet] = useState(activeDoctors[0] || 'Dra. Fernanda Silva');
  const [incomingVet, setIncomingVet] = useState(activeDoctors[1] || 'Dr. Roberto Assis');
  const [outgoingPassword, setOutgoingPassword] = useState('');
  const [incomingPassword, setIncomingPassword] = useState('');
  const [intercurrences, setIntercurrences] = useState('Sem intercorrências graves no plantão.');
  const [otherNotes, setOtherNotes] = useState('');

  const [cleaningChecks, setCleaningChecks] = useState<Record<string, boolean>>({
    baias_ocupadas: true,
    baias_vazias: true,
    piso_internacao: true,
    piso_recepcao: true,
    consultorio: true,
    banheiros: true,
    bancadas: true,
    baldes: true,
    pias_tanques: true,
    vasilhas: true,
    bloco_cirurgico: true,
    sala_exames: true,
    corredores: true,
    roupas_lavadas: true,
    roupas_dobradas: true,
    int_nao_infectante_org: true,
    int_infectante_org: true,
  });

  const [orgChecks, setOrgChecks] = useState<Record<string, boolean>>({
    baia_infectante: true,
    baia_nao_infectante: true,
    estoque: true,
    materiais_repostos: true,
    meds_organizados: true,
    geladeira_armarios: true,
    papel_toalha: true,
    cirurgicos_limpos: true,
    cirurgicos_esterelizados: true,
    papeis_temperatura: true,
  });

  const [equipChecks, setEquipChecks] = useState<Record<string, boolean>>({
    raiox_guardado: true,
    rx_desligado: true,
    hemograma_conferida: true,
    oxigenio: true,
    ar_condicionado: true,
  });

  const [trashChecks, setTrashChecks] = useState<Record<string, boolean>>({
    lixo_infectante: true,
    lixo_nao_infectante: true,
    lixo_consultorio: true,
    lixo_recepcao: true,
    lixo_bloco: true,
    lixo_banheiros: true,
    lixo_sustentacao: true,
    perfurocortantes: true,
  });

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleToggle = (stateUpdater: any, key: string) => {
    stateUpdater((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const occupiedPatients = kennels.filter(k => k.status === 'occupied');
  const criticalCount = occupiedPatients.filter(k => k.critical).length;

  let totalPendingMeds = 0;
  occupiedPatients.forEach(k => {
    k.medications.forEach(m => {
      m.times.forEach(t => {
        if (t.status === 'pending' || t.status === 'late') totalPendingMeds++;
      });
    });
  });

  const handleSubmit = () => {
    if (!outgoingVet || !incomingVet) {
      showToast('Selecione o Médico Saindo e o Médico Assumidor.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitHandover({
        date: new Date().toLocaleDateString('pt-BR'),
        shift: turno,
        outgoingVet,
        incomingVet,
        censusSummary: {
          totalPatients: occupiedPatients.length,
          criticalCount,
          pendingMedsCount: totalPendingMeds
        },
        cleaningChecks,
        orgChecks,
        equipChecks,
        trashChecks,
        intercurrences,
        otherNotes,
        signatureConfirmed: true
      });

      setIsSubmitting(false);
      showToast('Passagem de plantão assinada e registrada com sucesso!');
      setActiveTab('history');
    }, 800);
  };

  return (
    <div className="pb-16 max-w-5xl mx-auto p-4 md:p-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/hospitalization">
            <Button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <ClipboardCheck className="w-8 h-8 text-indigo-600" />
              Passagem de Plantão Médico & Enfermagem
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-0.5">
              Protocolo obrigatório de transferência de responsabilidade clínica e checklist setorial
            </p>
          </div>
        </div>

        {/* View Switch */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-max">
          <Button 
            onClick={() => setActiveTab('form')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'form' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 bg-transparent hover:bg-slate-300/40'
            }`}
          >
            Novo Plantão
          </Button>
          <Button 
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 bg-transparent hover:bg-slate-300/40'
            }`}
          >
            Histórico ({handovers.length})
          </Button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" /> Histórico de Passagens de Plantão
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Registros assinados digitalmente pelos médicos plantonistas
              </p>
            </div>
            <Button 
              onClick={() => setActiveTab('form')}
              className="bg-indigo-600 text-white rounded-xl font-bold px-4 py-2 text-xs shadow-md"
            >
              Registrar Novo
            </Button>
          </div>

          <div className="space-y-4">
            {handovers.map((h) => (
              <Card key={h.id} className="p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                      h.shift === 'diurno' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {h.shift === 'diurno' ? '🌞 Plantão Diurno' : '🌜 Plantão Noturno'}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{h.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Assinado Digitalmente
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Médico Saindo</span>
                    <p className="font-black text-slate-800">{h.outgoingVet}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Médico Assumidor</span>
                    <p className="font-black text-slate-800">{h.incomingVet}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center mb-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-400">Pacientes Internados</span>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{h.censusSummary.totalPatients}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400">Quadros Críticos</span>
                    <p className="text-lg font-black text-red-600 mt-0.5">{h.censusSummary.criticalCount}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400">Medicações Pendentes</span>
                    <p className="text-lg font-black text-indigo-600 mt-0.5">{h.censusSummary.pendingMedsCount}</p>
                  </div>
                </div>

                {h.intercurrences && (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 mb-2">
                    <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">Intercorrências do Plantão:</span>
                    <p className="text-xs font-medium text-slate-700">{h.intercurrences}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Turno Selector */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50/80 p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Turno de Transferência</h3>
                <p className="text-xs text-slate-500 font-medium">Selecione o turno referente a este relatório</p>
              </div>
              <div className="flex bg-slate-200/60 p-1.5 rounded-2xl">
                <Button 
                  onClick={() => setTurno('diurno')}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    turno === 'diurno' ? 'bg-white text-amber-700 shadow-md' : 'text-slate-600 bg-transparent hover:text-slate-800'
                  }`}
                >
                  🌞 Plantão Diurno (07h às 19h)
                </Button>
                <Button 
                  onClick={() => setTurno('noturno')}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    turno === 'noturno' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 bg-transparent hover:text-slate-800'
                  }`}
                >
                  🌜 Plantão Noturno (19h às 07h)
                </Button>
              </div>
            </div>
          </Card>

          {/* Steps Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {[
              '1. Censo de Pacientes',
              '2. Limpeza Setorial',
              '3. Organização & Estoque',
              '4. Equipamentos',
              ...(turno === 'noturno' ? ['5. Gestão de Lixo'] : []),
              `${turno === 'noturno' ? '6' : '5'}. Assinatura & Fechamento`
            ].map((title, index) => (
              <Button 
                key={index}
                onClick={() => setStep(index + 1)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                  step === index + 1 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {title}
              </Button>
            ))}
          </div>

          {/* STEP 1: Censo de Pacientes */}
          {step === 1 && (
            <Card className="border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">1. Identificação dos Médicos & Censo Hospitalar</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Pacientes internados sob responsabilidade transferida
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Médico Saindo (Entregador) *</label>
                  <select 
                    value={outgoingVet}
                    onChange={e => setOutgoingVet(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none"
                  >
                    {activeDoctors.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Médico Entrando (Assumidor) *</label>
                  <select 
                    value={incomingVet}
                    onChange={e => setIncomingVet(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none"
                  >
                    {activeDoctors.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Automatic Live Census Grid */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Censo Automático em Tempo Real ({occupiedPatients.length} pacientes internados)
                  </span>
                  <span className="text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                    {criticalCount} paciente(s) crítico(s)
                  </span>
                </div>

                <div className="space-y-3">
                  {occupiedPatients.map(p => (
                    <div key={p.kennelId} className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                      p.critical ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-sm text-indigo-700">
                          {p.kennelId}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">{p.name} ({p.species} • {p.weight}kg)</h4>
                          <p className="text-xs text-slate-500 font-medium">Diagnóstico: {p.diagnosis}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {p.critical && (
                          <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <HeartPulse className="w-3 h-3" /> Crítico
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          {p.medications.length} meds prescritos
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button onClick={() => setStep(2)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 font-bold shadow-md">
                  Avançar para Limpeza Setorial
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 2: Limpeza */}
          {step === 2 && (
            <Card className="border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">2. Checklist de Limpeza & Desinfecção</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Marque os itens conferidos e em conformidade
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'baias_ocupadas', label: 'Baias e canis Ocupados limpos e forrados' },
                  { id: 'baias_vazias', label: 'Baias e canis Vazios desinfetados' },
                  { id: 'piso_internacao', label: 'Piso da internação lavado e seco' },
                  { id: 'piso_recepcao', label: 'Piso da recepção limpo' },
                  { id: 'consultorio', label: 'Consultórios limpos e mesas higienizadas' },
                  { id: 'banheiros', label: 'Banheiros limpos e abastecidos' },
                  { id: 'bancadas', label: 'Bancadas de enfermagem limpas e organizadas' },
                  { id: 'baldes', label: 'Baldes e calhas lavados com desinfetante' },
                  { id: 'pias_tanques', label: 'Pias e tanques limpos' },
                  { id: 'vasilhas', label: 'Vasilhas e potes de água higienizados' },
                  { id: 'bloco_cirurgico', label: 'Bloco cirúrgico pronto para uso' },
                  { id: 'sala_exames', label: 'Sala de ultrassom e raio-X higienizada' },
                  { id: 'corredores', label: 'Corredores desobstruídos e limpos' },
                  { id: 'roupas_lavadas', label: 'Panos e cobertores lavados' },
                  { id: 'roupas_dobradas', label: 'Roupas dobradas e guardadas' },
                  { id: 'int_nao_infectante_org', label: 'Internação Não-infectante organizada' },
                  { id: 'int_infectante_org', label: 'Internação Infectante em isolamento rígido' },
                ].map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleToggle(setCleaningChecks, item.id)}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      cleaningChecks[item.id] ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                    }`}>
                      {cleaningChecks[item.id] && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl font-bold">Voltar</Button>
                <Button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 font-bold shadow-md">
                  Avançar para Organização
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 3: Organização */}
          {step === 3 && (
            <Card className="border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">3. Organização & Farmácia Setorial</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Conferência de reposição de insumos e armários
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'baia_infectante', label: 'Baia infectante com EPIs completos' },
                  { id: 'baia_nao_infectante', label: 'Baia não infectante pronta' },
                  { id: 'estoque', label: 'Estoque de seringas e cateteres abastecido' },
                  { id: 'materiais_repostos', label: 'Scalps, equipos e soros repostos' },
                  { id: 'meds_organizados', label: 'Carrinho de parada e emergência lacrado' },
                  { id: 'geladeira_armarios', label: 'Geladeira de vacinas/insulinas conferida' },
                  { id: 'papel_toalha', label: 'Papel toalha e sabonete em todas as pias' },
                  { id: 'cirurgicos_limpos', label: 'Caixas cirúrgicas lavadas' },
                  { id: 'cirurgicos_esterelizados', label: 'Autoclave conferida e materiais estéreis' },
                  { id: 'papeis_temperatura', label: 'Planilhas de temperatura preenchidas' },
                ].map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleToggle(setOrgChecks, item.id)}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      orgChecks[item.id] ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                    }`}>
                      {orgChecks[item.id] && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl font-bold">Voltar</Button>
                <Button onClick={() => setStep(4)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 font-bold shadow-md">
                  Avançar para Equipamentos
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 4: Equipamentos */}
          {step === 4 && (
            <Card className="border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">4. Equipamentos Hospitalares</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Conferência de bombas, oxigênio e aparelhos de diagnóstico
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'raiox_guardado', label: 'Chassis e emissor de Raio-X travados' },
                  { id: 'rx_desligado', label: 'Equipamento de RX desligado da rede' },
                  { id: 'hemograma_conferida', label: 'Máquina hematológica lavada e calibrada' },
                  { id: 'oxigenio', label: 'Torpedos e concentradores de oxigênio com pressão adequada' },
                  { id: 'ar_condicionado', label: 'Temperatura da UTI regulada (22°C-24°C)' },
                ].map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleToggle(setEquipChecks, item.id)}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      equipChecks[item.id] ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                    }`}>
                      {equipChecks[item.id] && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(3)} className="rounded-xl font-bold">Voltar</Button>
                <Button 
                  onClick={() => setStep(turno === 'noturno' ? 5 : 5)} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 font-bold shadow-md"
                >
                  {turno === 'noturno' ? 'Avançar para Lixo' : 'Avançar para Assinatura'}
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 5: Gestão de Lixo (se Noturno) */}
          {step === 5 && turno === 'noturno' && (
            <Card className="border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">5. Gestão de Resíduos & Perfurocortantes</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Conferência de descarte correto de lixo infectante e descarpack
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'lixo_infectante', label: 'Sacos brancos infectantes trocados' },
                  { id: 'lixo_nao_infectante', label: 'Lixo comum recolhido' },
                  { id: 'lixo_consultorio', label: 'Lixeiras de consultório esvaziadas' },
                  { id: 'lixo_recepcao', label: 'Lixeira da recepção limpa' },
                  { id: 'lixo_bloco', label: 'Resíduos cirúrgicos descartados com segurança' },
                  { id: 'lixo_banheiros', label: 'Lixeiras dos banheiros trocadas' },
                  { id: 'perfurocortantes', label: 'Descarpack abaixo do limite de segurança (2/3)' },
                ].map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleToggle(setTrashChecks, item.id)}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      trashChecks[item.id] ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                    }`}>
                      {trashChecks[item.id] && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(4)} className="rounded-xl font-bold">Voltar</Button>
                <Button onClick={() => setStep(6)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 font-bold shadow-md">
                  Avançar para Assinatura Final
                </Button>
              </div>
            </Card>
          )}

          {/* FINAL STEP: Assinatura e Confirmação */}
          {((step === 5 && turno === 'diurno') || (step === 6 && turno === 'noturno')) && (
            <Card className="border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Intercorrências & Assinatura Digital do Plantão</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Registro formal de ocorrências e validação dupla de responsabilidade
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Intercorrências Clínicas & Observações Relevantes
                  </label>
                  <textarea 
                    value={intercurrences}
                    onChange={e => setIntercurrences(e.target.value)}
                    rows={3}
                    placeholder="Ex: Paciente da UTI apresentou pico febril às 03h, administrado dipirona com sucesso..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pendências Gerais / Recados para a Direção
                  </label>
                  <textarea 
                    value={otherNotes}
                    onChange={e => setOtherNotes(e.target.value)}
                    rows={2}
                    placeholder="Ex: Solicitar compra de seringas de 3ml..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Dupla Assinatura */}
                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
                  <h4 className="font-black text-indigo-950 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" /> Confirmação Digital de Transferência
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100">
                      <span className="text-xs font-bold text-slate-500 uppercase">Médico Saindo</span>
                      <p className="font-black text-slate-900 text-sm mt-0.5">{outgoingVet}</p>
                      <Input 
                        type="password"
                        placeholder="Senha digital"
                        value={outgoingPassword}
                        onChange={e => setOutgoingPassword(e.target.value)}
                        className="mt-2 bg-slate-50 text-xs"
                      />
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-indigo-100">
                      <span className="text-xs font-bold text-slate-500 uppercase">Médico Assumidor</span>
                      <p className="font-black text-slate-900 text-sm mt-0.5">{incomingVet}</p>
                      <Input 
                        type="password"
                        placeholder="Senha digital"
                        value={incomingPassword}
                        onChange={e => setIncomingPassword(e.target.value)}
                        className="mt-2 bg-slate-50 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(turno === 'noturno' ? 5 : 4)} className="rounded-xl font-bold">
                  Voltar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 h-12 font-black shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSubmitting ? 'Validando e Assinando...' : 'Assinar e Concluir Passagem de Plantão'}
                </Button>
              </div>
            </Card>
          )}

        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom-5 font-bold flex items-center gap-3`}>
          <CheckCircle2 className="w-5 h-5" />
          {toast.message}
        </div>
      )}

    </div>
  );
}
