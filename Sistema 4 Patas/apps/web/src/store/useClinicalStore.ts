import { create } from 'zustand';

export type AppointmentStatus = 'Aguardando Triagem' | 'Aguardando Consulta' | 'Em Consulta' | 'Finalizado';

export interface TriageData {
  weight: number;
  temp: number;
  heartRate: number;
  respRate: number;
  painLevel: number;
  reason: string;
}

export interface Appointment {
  id: string;
  petName: string;
  breed: string;
  ownerName: string;
  type: string;
  time: string;
  status: AppointmentStatus;
  triageData?: TriageData;
  vetId?: string;
}

interface ClinicalState {
  appointments: Appointment[];
  updateTriage: (id: string, data: TriageData) => void;
  updateStatus: (id: string, status: AppointmentStatus) => void;
}

const mockInitialAppointments: Appointment[] = [
  { id: '1', petName: 'Thor', breed: 'Golden Retriever', ownerName: 'Maria Silva', type: 'Consulta de Rotina', time: '14:00', status: 'Aguardando Triagem' },
  { id: '2', petName: 'Mel', breed: 'Poodle', ownerName: 'João Santos', type: 'Retorno', time: '14:30', status: 'Aguardando Triagem' },
  { id: '3', petName: 'Luna', breed: 'SRD', ownerName: 'Ana Clara', type: 'Vacinação', time: '15:00', status: 'Aguardando Triagem' },
  { id: '4', petName: 'Bolinha', breed: 'Bulldog', ownerName: 'Carlos Oliveira', type: 'Dermatologia', time: '10:00', status: 'Aguardando Consulta', triageData: { weight: 12, temp: 38.5, heartRate: 110, respRate: 30, painLevel: 2, reason: 'Coceira crônica.' } }
];

export const useClinicalStore = create<ClinicalState>((set) => ({
  appointments: mockInitialAppointments,
  
  updateTriage: (id, data) => set((state) => ({
    appointments: state.appointments.map(app => 
      app.id === id 
        ? { ...app, triageData: data, status: 'Aguardando Consulta' } 
        : app
    )
  })),

  updateStatus: (id, status) => set((state) => ({
    appointments: state.appointments.map(app => 
      app.id === id ? { ...app, status } : app
    )
  })),
}));
