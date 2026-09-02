'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Users, FlaskConical, Pill, ChevronDown, ChevronUp, FileText, Download } from 'lucide-react';

type LabResult = {
  id: string;
  patient: string;
  exam: string;
  date: string;
  status: 'NOVO' | 'Visualizado';
  details: string;
};

type ImageResult = {
  id: string;
  patient: string;
  partner: string;
  exam: string;
  date: string;
};

export default function VetResults() {
  const [toastMsg, setToastMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);
  const [activeTab, setActiveTab] = useState<'lab' | 'img'>('lab');
  const [expandedLab, setExpandedLab] = useState<string | null>(null);

  const labResults: LabResult[] = [
    { id: '1', patient: 'Belinha (Poodle)', exam: 'Hemograma Completo', date: 'Hoje, 08:30', status: 'NOVO', details: 'Eritrócitos: 5.2 M/µL\nLeucócitos: 12.000/µL\nPlaquetas: 45.000/µL (BAIXO)' },
    { id: '2', patient: 'Rex (Pastor Alemão)', exam: 'Bioquímico (Função Renal)', date: 'Ontem, 16:45', status: 'NOVO', details: 'Ureia: 85 mg/dL (ALTO)\nCreatinina: 2.1 mg/dL (ALTO)' },
    { id: '3', patient: 'Nina (Gato SRD)', exam: 'FIV/FeLV', date: '10/08/2026', status: 'Visualizado', details: 'FIV: Negativo\nFeLV: Negativo' },
  ];

  const imageResults: ImageResult[] = [
    { id: '1', patient: 'Rex (Pastor Alemão)', exam: 'RX Tórax', partner: 'Radiologia Vet Express', date: 'Ontem, 14:00' },
    { id: '2', patient: 'Luna (Lhasa Apso)', exam: 'Ultrassom Abdominal', partner: 'EcoVet Imagem', date: '09/08/2026' },
  ];

  const showToast = (text: string, type: 'success'|'error' = 'success') => {
    setToastMsg({text, type});
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDownloadPdf = (title: string) => {
    showToast(`Baixando Laudo: ${title}...`, 'success');
    const content = `UNIVERSO 4 PATAS - LAUDO DE EXAME VETERINÁRIO\n\nPaciente / Exame: ${title}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nRESULTADO DA ANÁLISE:\nParâmetros analisados dentro dos padrões fisiológicos para a espécie.\nLaudo emitido e assinado digitalmente pelo sistema veterinário.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laudo_${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { href: '/pwa/vet', label: 'Home', icon: Home },
    { href: '/pwa/vet/queue', label: 'Fila', icon: Users },
    { href: '/pwa/vet/results', label: 'Resultados', icon: FlaskConical },
    { href: '/pwa/vet/prescribe', label: 'Prescrever', icon: Pill },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg text-white text-sm font-bold flex items-center gap-2 ${toastMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-white p-4 pt-12 border-b border-slate-200 sticky top-0 z-30">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Resultados</h1>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('lab')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'lab' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Laboratório
          </button>
          <button 
            onClick={() => setActiveTab('img')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'img' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Imagem
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {activeTab === 'lab' && (
          <div className="space-y-4">
            {labResults.map(result => (
              <div key={result.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{result.patient}</h3>
                  {result.status === 'NOVO' && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold">
                      NOVO
                    </span>
                  )}
                </div>
                <p className="text-slate-600 font-medium">{result.exam}</p>
                <p className="text-slate-400 text-sm mb-4">{result.date}</p>
                
                {expandedLab === result.id ? (
                  <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                      {result.details}
                    </pre>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <button 
                    onClick={() => setExpandedLab(expandedLab === result.id ? null : result.id)}
                    className="flex-1 h-10 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-1 active:bg-slate-50 transition-colors"
                  >
                    {expandedLab === result.id ? (
                      <><ChevronUp size={18} /> Ocultar</>
                    ) : (
                      <><ChevronDown size={18} /> Ver Resumo</>
                    )}
                  </button>
                  <button 
                    onClick={() => handleDownloadPdf(`${result.patient} - ${result.exam}`)}
                    className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center active:bg-indigo-100"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'img' && (
          <div className="space-y-4">
            {imageResults.map(result => (
              <div key={result.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-1">{result.patient}</h3>
                <p className="text-slate-600 font-medium">{result.exam}</p>
                <p className="text-slate-500 text-sm">{result.partner}</p>
                <p className="text-slate-400 text-sm mb-4">{result.date}</p>

                <button 
                  onClick={() => handleDownloadPdf(`${result.patient} - ${result.exam}`)}
                  className="w-full h-12 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <FileText size={20} />
                  Ver PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-18 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40 pb-safe">
        {navItems.map(item => {
          const isActive = item.href === '/pwa/vet/results';
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
              <item.icon size={24} />
              <span className="text-xs font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
