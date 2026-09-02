import { create } from 'zustand';

export type ExamStatus = 'aguardando_confirmacao' | 'em_andamento' | 'pronto';

export interface ExamRecord {
  id: string;
  patient: string;
  tutor: string;
  exam: string;
  timestamp: string;
  status: ExamStatus;
  vet: string;
  daysSinceConsult: number; // For Tutor PWA rule
}

interface LabStore {
  exams: ExamRecord[];
  addExam: (exam: Omit<ExamRecord, 'id' | 'timestamp' | 'status'>) => string;
  updateStatus: (id: string, status: ExamStatus) => void;
}

export const useLabStore = create<LabStore>((set) => ({
  exams: [
    {
      id: 'HEMO-8821',
      patient: 'Thor',
      tutor: 'Maria',
      exam: 'Hemograma Completo',
      timestamp: 'Hoje, 09:14',
      status: 'pronto',
      vet: 'Dra. Silva',
      daysSinceConsult: 12
    },
    {
      id: 'URIN-9902',
      patient: 'Luna',
      tutor: 'Maria',
      exam: 'Urinálise',
      timestamp: '05/06/2026',
      status: 'pronto',
      vet: 'Dra. Lima',
      daysSinceConsult: 45
    }
  ],
  addExam: (examData) => {
    const newId = `EXAM-${Math.floor(Math.random() * 10000)}`;
    set((state) => ({
      exams: [
        {
          ...examData,
          id: newId,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'aguardando_confirmacao'
        },
        ...state.exams
      ]
    }));
    return newId;
  },
  updateStatus: (id, status) => set((state) => ({
    exams: state.exams.map(e => e.id === id ? { ...e, status } : e)
  }))
}));
