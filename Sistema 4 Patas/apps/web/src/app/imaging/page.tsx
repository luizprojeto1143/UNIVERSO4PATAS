"use client";

import React, { useState } from 'react';
import { Search, ZoomIn, ZoomOut, Move, Contrast, Ruler, Save, Image as ImageIcon, FileText, ChevronLeft, ChevronRight, Settings, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useImagingStore } from '@/store/useImagingStore';

export default function ImagingCenter() {
  const storeReports = useImagingStore(state => state.reports);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('Todos');

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  };

  const handleToolClick = (label: string) => {
    showToast(`Ferramenta ativa: ${label}`);
  };

  const handleSaveReport = () => {
    showToast("Laudo assinado e salvo com sucesso!");
  };

  const handleSaveModal = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(false);
      showToast("Novo exame criado com sucesso!");
    }, 1500);
  };

  // Scans reais vindos do Portal do Parceiro via Zustand
  const partnerScans = storeReports.map((r, idx) => ({
    id: 1000 + idx,
    type: `${r.modality} - ${r.fileName}`,
    date: r.date,
    modality: r.modality === 'Radiologia' ? 'CR' : 'US',
    status: 'Laudo Recebido',
    patient: r.patientName,
    provider: r.provider,
  }));

  const staticScans = [
    { id: 1, type: 'Radiologia - Tórax', date: '2023-10-24', modality: 'CR', status: 'Aguardando Laudo', patient: 'Max', provider: 'Interno' },
    { id: 2, type: 'Ultrassonografia - Abdominal', date: '2023-10-22', modality: 'US', status: 'Aguardando Laudo', patient: 'Belinha', provider: 'Interno' },
  ];

  const scans = [...partnerScans, ...staticScans];
  const filteredScans = filter === 'Todos' ? scans : scans.filter(s => s.status === filter);

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-300 font-sans relative">
      {/* Toast Notification */}
      <div 
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-xl shadow-lg transition-all duration-300 ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <CheckCircle2 size={18} className="text-emerald-400" />
        <span className="text-sm font-medium">{toast.message}</span>
      </div>

      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-neutral-900 border-b border-neutral-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            <ImageIcon size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white leading-tight">Centro de Imagem</h1>
            <p className="text-xs text-neutral-400">Visualizador DICOM e Laudos</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-neutral-400">
            Paciente Atual: <span className="font-semibold text-neutral-200">Max (Golden Retriever, 5 anos)</span>
          </div>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => showToast("Configurações abertas")}
            className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-white"
          >
            <Settings size={20} />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Scans List */}
        <aside className="w-80 bg-neutral-900/50 border-r border-neutral-800 flex flex-col">
          <div className="p-4 border-b border-neutral-800 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
              <Input
                type="text"
                placeholder="Buscar exames..."
                className="w-full bg-neutral-950 border border-neutral-800 text-sm rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-neutral-200 placeholder-neutral-600 transition-all"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {['Todos', 'Aguardando Laudo', 'Laudo Recebido'].map(f => (
                <Button
                  key={f}
                  variant="ghost"
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 h-auto text-xs whitespace-nowrap rounded-lg border ${
                    filter === f 
                      ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700 hover:text-white' 
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300'
                  }`}
                >
                  {f}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md h-auto"
            >
              <Plus size={16} />
              Novo Exame
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredScans.map((scan) => (
              <Button
                key={scan.id}
                variant="ghost"
                onClick={() => showToast(`Exame carregado: ${scan.type}`)}
                className={`w-full h-auto text-left flex flex-col items-stretch p-3 rounded-xl transition-all duration-200 ${
                  scan.id === 1 ? 'bg-blue-900/20 border border-blue-800/50 shadow-sm' : 'hover:bg-neutral-800 border border-transparent bg-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1 w-full">
                  <span className="font-medium text-neutral-200 text-sm">{scan.type}</span>
                  <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700 shrink-0 ml-2">
                    {scan.modality}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-500 mt-2 w-full">
                  <span>{scan.date}</span>
                  <span className={scan.status.includes('Aguardando') ? 'text-amber-400 font-medium' : scan.status === 'Laudo Recebido' ? 'text-emerald-400 font-medium' : 'text-blue-400 font-medium'}>
                    {scan.status}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </aside>

        {/* Center - Image Viewer */}
        <main className="flex-1 flex flex-col bg-black">
          {/* Viewer Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800">
            <div className="flex items-center gap-1">
              {[
                { icon: ZoomIn, label: 'Aumentar Zoom' },
                { icon: ZoomOut, label: 'Diminuir Zoom' },
                { icon: Move, label: 'Mover' },
                { icon: Contrast, label: 'Contraste' },
                { icon: Ruler, label: 'Medir' },
              ].map((tool, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToolClick(tool.label)}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors tooltip"
                  title={tool.label}
                >
                  <tool.icon size={18} />
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <span className="font-medium">Imagem 1 de 4</span>
              <div className="flex gap-1">
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => showToast("Imagem anterior")}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors hover:text-white"
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => showToast("Próxima imagem")}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors hover:text-white"
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Area */}
          <div className="flex-1 relative flex items-center justify-center p-6">
            <div className="absolute top-6 left-6 text-xs text-neutral-400 font-mono space-y-1 z-10 drop-shadow-md">
              <p>Nome do Paciente: Max</p>
              <p>ID: 987654321</p>
              <p>Data de Nasc.: 2018-05-12</p>
            </div>
            <div className="absolute top-6 right-6 text-xs text-neutral-400 font-mono space-y-1 text-right z-10 drop-shadow-md">
              <p>Data do Exame: 2023-10-24</p>
              <p>Tórax LAT Direita</p>
              <p>kV: 80 mAs: 10</p>
            </div>
            <div className="absolute bottom-6 right-6 text-xs text-neutral-400 font-mono z-10 drop-shadow-md">
              <p>W: 4095 L: 2048</p>
            </div>
            
            {/* Simulated X-Ray Placeholder */}
            <div className="w-full h-full max-w-3xl max-h-[85%] border border-neutral-800 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden shadow-2xl">
               <div className="text-neutral-600 font-medium text-lg flex flex-col items-center gap-4">
                 <ImageIcon size={56} className="opacity-40" />
                 <span>Visualizador de Raio-X de Tórax</span>
               </div>
               
               {/* Decorative elements simulating a scan */}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-neutral-950/40 to-black/90 pointer-events-none"></div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Reporting */}
        <aside className="w-[340px] bg-neutral-900/50 border-l border-neutral-800 flex flex-col">
          <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-400" />
            <h2 className="font-semibold text-neutral-100">Laudo Radiológico</h2>
          </div>
          <div className="flex-1 p-5 flex flex-col gap-5 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Achados</label>
              <textarea 
                className="w-full h-48 bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all"
                placeholder="Insira os achados radiológicos aqui..."
                defaultValue="Silhueta cardíaca dentro dos limites da normalidade. Vasculatura pulmonar normal. Sem sinais de edema pulmonar ou derrame pleural. Traqueia na linha média e de diâmetro normal. Contorno diafragmático intacto."
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Impressões</label>
              <textarea 
                className="w-full h-28 bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all"
                placeholder="Insira as impressões aqui..."
                defaultValue="1. Radiografias torácicas sem alterações."
              ></textarea>
            </div>
            
            <div className="mt-auto pt-4 flex gap-3">
              <Button 
                variant="outline"
                onClick={() => showToast("Rascunho do laudo salvo")}
                className="flex-1 py-2.5 px-4 h-auto bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-xl transition-all duration-200 border border-neutral-700 hover:border-neutral-600 shadow-sm"
              >
                Rascunho
              </Button>
              <Button 
                onClick={handleSaveReport}
                className="flex-[2] py-2.5 px-4 h-auto bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Save size={16} />
                Assinar Laudo
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal - Novo Exame */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 text-neutral-900">
            <h2 className="text-2xl font-bold mb-6">Novo Exame</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-neutral-700">Paciente</label>
                <Input 
                  type="text" 
                  placeholder="Nome do paciente" 
                  className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-neutral-700">Tipo de Exame</label>
                <select className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option value="">Selecione o tipo</option>
                  <option value="raio-x">Raio-X (Radiologia)</option>
                  <option value="usg">Ultrassom (Ultrassonografia)</option>
                  <option value="tc">Tomografia</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-neutral-700">Urgência</label>
                <select className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option value="normal">Normal</option>
                  <option value="urgente">Urgente</option>
                  <option value="emergencia">Emergência</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 h-auto rounded-lg border border-gray-200 text-neutral-700 hover:bg-neutral-50 font-medium transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveModal}
                className="px-5 py-2 h-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
