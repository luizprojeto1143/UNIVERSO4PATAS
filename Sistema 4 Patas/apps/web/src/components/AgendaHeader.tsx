"use client";

import { useState } from "react";
import CreateAppointmentModal from "./CreateAppointmentModal";

const DEFAULT_PATIENTS = [
  { id: 'pet-1', name: 'Thor', tutor: { id: 'tut-1', name: 'Maria Silva' } },
  { id: 'pet-2', name: 'Mel', tutor: { id: 'tut-2', name: 'João Santos' } },
  { id: 'pet-3', name: 'Luna', tutor: { id: 'tut-3', name: 'Ana Clara' } }
];

const DEFAULT_TUTORS = [
  { id: 'tut-1', name: 'Maria Silva' },
  { id: 'tut-2', name: 'João Santos' },
  { id: 'tut-3', name: 'Ana Clara' }
];

const DEFAULT_VETS = [
  { id: 'vet-1', name: 'Dra. Jéssica' },
  { id: 'vet-2', name: 'Dr. Nogueira' },
  { id: 'vet-3', name: 'Dr. Roberto' }
];

export default function AgendaHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-outfit">Agenda</h1>
          <p className="text-gray-500 mt-1">Gerencie as consultas e compromissos da clínica.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Novo Agendamento</span>
        </button>
      </div>

      <CreateAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        patients={DEFAULT_PATIENTS}
        tutors={DEFAULT_TUTORS}
        vets={DEFAULT_VETS}
      />
    </>
  );
}
