"use client";
import { Button } from '@/components/ui/button';

import { Card } from '@/components/ui/card';
import { ArrowLeft, Beaker, CheckCircle2, AlertCircle, FileSignature, UploadCloud, Microscope, Activity, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useLabStore } from '@/store/useLabStore';

export default function LabPage() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSigning, setIsSigning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  const { exams, updateStatus } = useLabStore();
  
  // Exibir todos os exames (aguardando_confirmacao, em_andamento e pronto)
  const labExams = exams;
  const [selectedExamId, setSelectedExamId] = useState<string | null>(labExams[0]?.id || null);

  const selectedExam = labExams.find(e => e.id === selectedExamId) || labExams[0];

  const showToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleStartAnalysis = (id: string) => {
    updateStatus(id, 'em_andamento');
    showToast('Exame colocado em andamento!');
  };

  const handleSign = () => {
    if (!selectedExam) return;
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      updateStatus(selectedExam.id, 'pronto');
      showToast('Laudo assinado e liberado para o tutor!');
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      showToast(`Arquivo "${file.name}" anexado com sucesso!`);
    }
  };

  return (
    <div className="pb-12 max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50/50 relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Microscope className="w-8 h-8 text-indigo-600" /> LIS Lab Integrado
            </h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Sincronizado ao Vivo
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Fila de Validação */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-500" /> Fila de Exames
          </h2>
          
          {labExams.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">Nenhum exame no laboratório</p>
            </div>
          ) : (
            labExams.map(req => (
              <Card 
                key={req.id} 
                onClick={() => setSelectedExamId(req.id)}
                className={`p-4 cursor-pointer transition-all border-l-4 ${selectedExamId === req.id ? 'ring-2 ring-indigo-500' : ''} ${req.status === 'em_andamento' ? 'border-l-indigo-500 bg-indigo-50/50 shadow-md ring-1 ring-indigo-200' : 'border-l-slate-300 bg-white opacity-60'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{req.id}</span>
                  {req.status === 'em_andamento' ? (
                    <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">EM ANDAMENTO</span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> CONCLUÍDO</span>
                  )}
                </div>
                <p className="font-bold text-slate-800 text-sm">{req.patient} ({req.tutor})</p>
                <p className="text-sm font-medium text-slate-600 mb-2">{req.exam}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                  <Beaker className="w-3 h-3" /> Solicitante: {req.vet}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Interface de Liberação de Laudo */}
        <div className="lg:col-span-2">
          {selectedExam ? (
            <Card className="bg-white border-slate-200 shadow-xl rounded-3xl overflow-hidden">
             
              {/* Info do Aparelho */}
              <div className="p-6 bg-slate-800 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black">{selectedExam.exam}</h2>
                  <p className="text-slate-400 font-medium mt-1">Paciente: {selectedExam.patient} | Tutor: {selectedExam.tutor}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status LIS</p>
                  {selectedExam.status === 'pronto' ? (
                     <p className="font-black text-emerald-400 flex items-center justify-end gap-1"><CheckCircle2 className="w-4 h-4"/> LIBERADO</p>
                  ) : (
                     <p className="font-black text-amber-400 flex items-center justify-end gap-1">PROCESSANDO</p>
                  )}
                </div>
              </div>

              <div className="p-6">
                {selectedExam.status === 'em_andamento' && (
                  <div className="flex items-center gap-2 mb-6 bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-200 text-sm font-bold">
                    <AlertCircle className="w-5 h-5 shrink-0" /> Aguardando laudo do laboratório de apoio.
                  </div>
                )}

                {/* Área de Anexo de PDF */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 mb-6">
                  <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                  <h3 className="font-bold text-slate-700">Anexar Laudo Externo</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {uploadedFile ? `Arquivo anexado: ${uploadedFile}` : 'Faça o upload do PDF recebido pelo laboratório de apoio'}
                  </p>
                  <label className="cursor-pointer">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 shadow-sm text-sm">
                      <Paperclip className="w-4 h-4" /> Selecionar Arquivo PDF
                    </span>
                  </label>
                </div>

                {/* Ação de Liberação ou Início */}
                {selectedExam.status === 'aguardando_confirmacao' && (
                  <Button 
                    onClick={() => handleStartAnalysis(selectedExam.id)}
                    className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Microscope className="w-5 h-5" /> Confirmar Coleta e Iniciar Análise
                  </Button>
                )}

                {selectedExam.status === 'em_andamento' && (
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleSign}
                      disabled={isSigning}
                      className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                    >
                      {isSigning ? (
                        <span className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : (
                        <FileSignature className="w-5 h-5" />
                      )}
                      {isSigning ? 'Concluindo...' : 'Concluir Resultado e Liberar para o Tutor'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400">
               <Microscope className="w-16 h-16 mb-4 opacity-20" />
               <p className="font-bold">Selecione um exame na fila</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
