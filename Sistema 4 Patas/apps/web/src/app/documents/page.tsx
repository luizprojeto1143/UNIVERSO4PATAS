"use client";

import React, { useState } from 'react';
import { FileText, Printer, Download, Plus, Search, CheckCircle, Stethoscope, Syringe, Pill, Loader2, Check } from 'lucide-react';

export default function DocumentsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleExportPDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [medicamentos, setMedicamentos] = useState([
    { nome: 'Amoxicilina 250mg', dose: '1 comprimido a cada 12h por 7 dias', color: 'blue' },
    { nome: 'Meloxicam 0,5mg/ml', dose: '2ml uma vez ao dia por 3 dias', color: 'orange' }
  ]);

  const handleSaveModal = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
      {/* Toast Notification */}
      <div 
        className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'} z-50`}
      >
        <Check size={20} />
        <span className="font-medium">PDF Gerado com sucesso!</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Documentos e Prescrições
          </h1>
          <p className="text-gray-500 mt-1">Gerar e imprimir documentos médicos</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors shadow-sm active:scale-95">
            <Plus size={18} />
            Novo Documento
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors shadow-sm active:scale-95">
            <Printer size={18} />
            Imprimir
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:opacity-90 font-medium transition-all shadow-md shadow-teal-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download size={18} />
                Exportar PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls / Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Configurações do Documento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 p-3 bg-teal-50 border-2 border-teal-500 text-teal-700 rounded-xl font-medium">
                    <FileText size={18} />
                    Receita
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 bg-gray-50 border-2 border-transparent text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                    <Stethoscope size={18} />
                    Pedido de Exame
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar paciente..." 
                    defaultValue="Luna (Golden Retriever)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicamentos</label>
                <div className="space-y-2">
                  {medicamentos.length === 0 ? (
                    <div className="p-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-sm text-gray-500">Nenhum registro encontrado</p>
                    </div>
                  ) : (
                    medicamentos.map((med, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <div className={`p-2 bg-${med.color}-50 text-${med.color}-600 rounded-lg`}>
                          {med.color === 'blue' ? <Pill size={16} /> : <Syringe size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800">{med.nome}</p>
                          <p className="text-xs text-gray-500">{med.dose}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl hover:border-teal-400 hover:text-teal-600 transition-colors">
                    <Plus size={18} />
                    <span className="font-medium">Adicionar Medicamento</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Veterinário</label>
                <select className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-shadow text-gray-700">
                  <option>Dr. Sarah Jenkins (CRMV-SP 12345)</option>
                  <option>Dr. Michael Chen (CRMV-SP 54321)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview */}
        <div className="lg:col-span-8">
          <div className="bg-gray-100 p-8 rounded-3xl flex items-center justify-center min-h-[800px] shadow-inner">
            {/* A4 Paper Mockup */}
            <div className="bg-white w-full max-w-[210mm] aspect-[1/1.414] shadow-xl p-12 flex flex-col relative overflow-hidden">
              {/* Header */}
              <div className="border-b-2 border-teal-600 pb-6 mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-teal-800">Clínica VetCare</h2>
                  <p className="text-sm text-gray-500 mt-1">Rua das Patas, 123 • (11) 91234-5678</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle size={32} />
                </div>
              </div>

              {/* Patient Info */}
              <div className="mb-10 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-700">Paciente:</span> Luna
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Espécie/Raça:</span> Canina / Golden Retriever
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Tutor:</span> João Silva
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Data:</span> {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-10">
                <h3 className="text-xl font-bold uppercase tracking-widest text-gray-800">Receita</h3>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-8">
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-teal-700">1.</span>
                    <span className="font-bold text-gray-800">Amoxicilina 250mg -------------------------------- 1 caixa</span>
                  </div>
                  <p className="pl-6 text-gray-600 italic">Dar 1 comprimido a cada 12 horas por 7 dias. Dar com comida.</p>
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-teal-700">2.</span>
                    <span className="font-bold text-gray-800">Meloxicam 0,5mg/ml ------------------------------ 1 frasco</span>
                  </div>
                  <p className="pl-6 text-gray-600 italic">Dar 2ml via oral uma vez ao dia por 3 dias. Agite bem antes de usar.</p>
                </div>
              </div>

              <div className="mt-16 pt-8 flex justify-end">
                <div className="text-center w-64">
                  <div className="border-b border-gray-400 mb-2"></div>
                  <p className="font-bold text-gray-800">Dr. Sarah Jenkins</p>
                  <p className="text-sm text-gray-500">Veterinária • CRMV-SP 12345</p>
                </div>
              </div>

              {/* Watermark (Visual flourish) */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                <Stethoscope size={400} className="rotate-[-20deg]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Novo Documento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Novo Documento</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload de Arquivo (Opcional)</label>
                <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-500">Clique ou arraste o arquivo aqui</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Template</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none">
                  <option>Receituário Padrão</option>
                  <option>Pedido de Exame de Sangue</option>
                  <option>Atestado de Saúde</option>
                  <option>Termo de Consentimento</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveModal}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                {isSaving ? "Criando..." : "Criar Documento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
