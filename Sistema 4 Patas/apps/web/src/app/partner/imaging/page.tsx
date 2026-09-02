"use client";

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Search, X } from 'lucide-react';
import { useImagingStore } from '@/store/useImagingStore';

export default function PartnerUploadDashboard() {
  const addReport = useImagingStore(state => state.addReport);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockPatients = [
    { id: '1', name: 'Thor', species: 'Canina', breed: 'Golden Retriever' },
    { id: '2', name: 'Mia', species: 'Felina', breed: 'Persa' },
    { id: '3', name: 'Rex', species: 'Canina', breed: 'Pastor Alemão' },
    { id: '4', name: 'Luna', species: 'Felina', breed: 'Siamês' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedPatient) return;

    setIsSubmitting(true);
    
    // Simulate upload and attach
    setTimeout(() => {
      const patient = mockPatients.find(p => p.id === selectedPatient);
      if (patient) {
        addReport({
          id: `new-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          fileName: file.name,
          provider: 'Centro Radiológico Vet',
          date: new Date().toISOString().split('T')[0],
          modality: file.name.toLowerCase().includes('usg') ? 'Ultrassonografia' : 'Radiologia'
        });
      }

      setIsSubmitting(false);
      setToastMessage('Laudo anexado com sucesso à ficha do paciente!');
      setFile(null);
      setSelectedPatient('');
      
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <UploadCloud size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Portal do Parceiro</h1>
            <p className="text-sm text-gray-500">Envio Expresso de Laudos (Radiologia / USG)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
            PR
          </div>
          <span>Centro Radiológico Vet</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          
          {!file ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Novo Laudo</h2>
              <p className="text-gray-500 mb-8">Faça o upload do laudo em PDF para anexar à ficha clínica.</p>
              
              {/* Massive Dropzone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-4 border-dashed rounded-3xl flex flex-col items-center justify-center py-24 px-10 cursor-pointer transition-all duration-300 ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden" 
                />
                
                <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 text-indigo-500">
                  <UploadCloud size={48} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Arraste e solte o Laudo aqui</h3>
                <p className="text-gray-500 font-medium">ou clique para procurar no computador</p>
                <p className="text-sm text-gray-400 mt-4">Formatos suportados: PDF, JPEG, PNG (Máx 25MB)</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Vincular Laudo</h2>
                <button 
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* File Info Card */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-center gap-5 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm text-indigo-600">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg truncate max-w-sm">{file.name}</h3>
                  <p className="text-indigo-600 font-medium text-sm">Pronto para ser anexado</p>
                </div>
              </div>

              {/* Patient Selection */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  De qual Paciente é este Laudo?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <select 
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-lg appearance-none transition-all"
                    required
                  >
                    <option value="" disabled>Selecione um paciente na base...</option>
                    {mockPatients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.species} {p.breed}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedPatient}
                className="w-full py-5 px-6 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Anexando à Ficha...
                  </>
                ) : (
                  <>
                    <CheckCircle size={24} />
                    Anexar à Ficha do Paciente
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
