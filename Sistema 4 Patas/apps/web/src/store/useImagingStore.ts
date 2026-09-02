import { create } from 'zustand';

export interface ImagingReport {
  id: string;
  patientId: string;
  patientName: string;
  fileName: string;
  provider: string;
  date: string;
  modality: 'Radiologia' | 'Ultrassonografia';
}

interface ImagingStore {
  reports: ImagingReport[];
  addReport: (report: ImagingReport) => void;
}

export const useImagingStore = create<ImagingStore>((set) => ({
  // Inicia com um laudo mockado para fins de demonstração
  reports: [
    {
      id: 'mock-1',
      patientId: '2', // Mia
      patientName: 'Mia',
      fileName: 'usg_abdominal_mia.pdf',
      provider: 'Centro Radiológico Vet',
      date: '2026-08-07',
      modality: 'Ultrassonografia'
    }
  ],
  addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
}));
