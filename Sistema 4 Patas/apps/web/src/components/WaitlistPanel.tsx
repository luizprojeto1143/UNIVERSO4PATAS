"use client";

import { useState } from 'react';

const DEFAULT_PATIENTS = [
  { id: 'pat-1', name: 'Thor', tutor: { id: 'tut-1', name: 'Maria Silva' } },
  { id: 'pat-2', name: 'Mel', tutor: { id: 'tut-2', name: 'João Santos' } },
  { id: 'pat-3', name: 'Luna', tutor: { id: 'tut-3', name: 'Ana Clara' } }
];

export default function WaitlistPanel({ waitlist = [], patients = [], onAdd, onDropItem }: any) {
  const patientList = patients && patients.length > 0 ? patients : DEFAULT_PATIENTS;
  const waitlistItems = waitlist || [];

  const [showAdd, setShowAdd] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!selectedPatientId) return;
    const patient = patients.find((p: any) => p.id === selectedPatientId);
    if (!patient) return;

    onAdd({
      patientId: patient.id,
      tutorId: patient.tutor.id,
      notes
    });
    setShowAdd(false);
    setSelectedPatientId('');
    setNotes('');
  };

  const handleDragStart = (e: any, item: any) => {
    e.dataTransfer.setData('waitlistItem', JSON.stringify(item));
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Fila de Espera
          <span className="bg-indigo-100 text-indigo-700 text-xs py-0.5 px-2 rounded-full font-medium">{waitlistItems.length}</span>
        </h3>
        <button onClick={() => setShowAdd(!showAdd)} className="text-indigo-600 hover:text-indigo-800 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>

      {showAdd && (
        <div className="p-4 border-b border-gray-100 bg-indigo-50/50 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paciente</label>
            <select 
              className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {patientList.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} - {p.tutor?.name || 'Tutor'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notas (Opcional)</label>
            <input 
              type="text"
              placeholder="Ex: Prefere parte da tarde..."
              className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAdd}
            disabled={!selectedPatientId}
            className="w-full py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            Adicionar à Fila
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {waitlist.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            Nenhum paciente na fila de espera.
          </div>
        ) : (
          waitlist.map((item: any) => (
            <div 
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow hover:border-indigo-300 cursor-move transition-all"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm text-gray-900">{item.patientName}</span>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">Esperando</span>
              </div>
              <div className="text-xs text-gray-500">{item.patientSpecies}</div>
              <div className="text-xs text-gray-500 mt-1">Tutor: {item.tutorName}</div>
              {item.notes && <div className="text-xs text-orange-600 mt-2 bg-orange-50 p-1.5 rounded line-clamp-2">{item.notes}</div>}
              
              <div className="mt-3 text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center justify-center border border-dashed border-gray-300 rounded py-1 bg-gray-50">
                ↕ Arraste para a Agenda
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
