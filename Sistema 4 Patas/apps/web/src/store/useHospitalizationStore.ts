import { create } from 'zustand';

export interface VitalRecord {
  id: string;
  timestamp: string;
  temperature: number; // °C
  heartRate: number; // bpm
  respRate: number; // mpm
  bloodPressure: string; // e.g. "120/80"
  crt: string; // TPC (ex: "<2s", "3s")
  mucousMembranes: string; // Normocorada, Pálida, Cianótica, Ictérica, Congesta
  glucose: number; // mg/dL
  painScore: number; // 0 a 24 (Glasgow)
  notes?: string;
  recordedBy: string;
}

export interface MedicationTimeSlot {
  time: string;
  status: 'pending' | 'done' | 'late' | 'suspended';
  signedBy?: string | null;
  checkedAt?: string | null;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  route: 'IV' | 'SC' | 'IM' | 'PO' | 'Inalação' | 'Tópico';
  frequency: string; // '4/4h', '6/6h', '8/8h', '12/12h', '24/24h', 'Contínuo', 'Dose Única'
  times: MedicationTimeSlot[];
  notes?: string;
  prescribedBy: string;
}

export interface FluidTherapy {
  hasFluids: boolean;
  solution: string;
  volumeTotalMl: number;
  rateMlH: number;
  dropsPerMin: number;
  startedAt?: string;
  estimatedEnd?: string;
}

export interface KennelPatient {
  id: string;
  kennelId: string;
  name: string;
  species: 'Cão' | 'Gato' | 'Silvestre' | 'Outro';
  breed: string;
  tutor: string;
  tutorPhone?: string;
  weight: number; // kg
  diagnosis: string;
  attendingVet: string;
  admissionDate: string;
  critical: boolean;
  status: 'occupied' | 'cleaning' | 'free';
  ward: 'dogs' | 'cats' | 'icu' | 'isolation';
  wardLabel: string;
  notes: string;
  dietNotes?: string;
  fluids: FluidTherapy;
  medications: Medication[];
  vitalRecords: VitalRecord[];
}

export interface HandoverRecord {
  id: string;
  date: string;
  shift: 'diurno' | 'noturno';
  outgoingVet: string;
  incomingVet: string;
  censusSummary: {
    totalPatients: number;
    criticalCount: number;
    pendingMedsCount: number;
  };
  cleaningChecks: Record<string, boolean>;
  orgChecks: Record<string, boolean>;
  equipChecks: Record<string, boolean>;
  trashChecks: Record<string, boolean>;
  intercurrences: string;
  otherNotes: string;
  signatureConfirmed: boolean;
  createdAt: string;
}

interface HospitalizationState {
  kennels: KennelPatient[];
  handovers: HandoverRecord[];
  activeDoctors: string[];
  
  // Actions
  admitPatient: (data: Omit<KennelPatient, 'id' | 'vitalRecords' | 'status'>) => void;
  dischargePatient: (kennelId: string) => void;
  setKennelCleaning: (kennelId: string) => void;
  setKennelFree: (kennelId: string) => void;
  
  addVitalRecord: (kennelId: string, record: Omit<VitalRecord, 'id' | 'timestamp'>) => void;
  addMedication: (kennelId: string, med: Omit<Medication, 'id'>) => void;
  toggleMedicationSlot: (kennelId: string, medId: string, timeIndex: number, signedBy?: string, customStatus?: 'pending' | 'done' | 'late' | 'suspended') => void;
  updateFluidTherapy: (kennelId: string, fluids: FluidTherapy) => void;
  updatePatientNotes: (kennelId: string, notes: string, dietNotes?: string) => void;
  submitHandover: (handover: Omit<HandoverRecord, 'id' | 'createdAt'>) => void;
}

const initialKennels: KennelPatient[] = [
  {
    id: 'pat-1',
    kennelId: 'B01',
    name: 'Rex',
    species: 'Cão',
    breed: 'Pastor Alemão',
    tutor: 'Maria Oliveira',
    tutorPhone: '(11) 98765-4321',
    weight: 28.5,
    diagnosis: 'Pós-op Ortopédico (TPLO Joelho Esquerdo)',
    attendingVet: 'Dra. Fernanda Silva',
    admissionDate: '2026-08-25 09:30',
    critical: false,
    status: 'occupied',
    ward: 'dogs',
    wardLabel: 'CÃES',
    notes: 'Paciente alerta, alimentou-se bem. Curativo limpo e seco.',
    dietNotes: 'Ração Recovery úmida 150g a cada 8h',
    fluids: {
      hasFluids: true,
      solution: 'Ringer com Lactato',
      volumeTotalMl: 1000,
      rateMlH: 55,
      dropsPerMin: 18,
      startedAt: '08:00',
      estimatedEnd: '02:00'
    },
    medications: [
      {
        id: 'm1',
        name: 'Dipirona 500mg/ml',
        dose: '1.4 ml (25mg/kg)',
        route: 'IV',
        frequency: '8/8h',
        prescribedBy: 'Dra. Fernanda Silva',
        times: [
          { time: '06:00', status: 'done', signedBy: 'Enf. Carlos', checkedAt: '06:05' },
          { time: '14:00', status: 'done', signedBy: 'Enf. Beatriz', checkedAt: '14:00' },
          { time: '22:00', status: 'pending', signedBy: null }
        ]
      },
      {
        id: 'm2',
        name: 'Meloxicam 2mg/ml',
        dose: '1.4 ml (0.1mg/kg)',
        route: 'SC',
        frequency: '24/24h',
        prescribedBy: 'Dra. Fernanda Silva',
        times: [
          { time: '10:00', status: 'done', signedBy: 'Enf. Carlos', checkedAt: '10:00' }
        ]
      },
      {
        id: 'm3',
        name: 'Cefazolina 1g',
        dose: '2.8 ml IV reconstituído',
        route: 'IV',
        frequency: '8/8h',
        prescribedBy: 'Dra. Fernanda Silva',
        times: [
          { time: '08:00', status: 'done', signedBy: 'Enf. Carlos', checkedAt: '08:00' },
          { time: '16:00', status: 'pending', signedBy: null },
          { time: '00:00', status: 'pending', signedBy: null }
        ]
      }
    ],
    vitalRecords: [
      {
        id: 'v1',
        timestamp: '08:00',
        temperature: 38.6,
        heartRate: 98,
        respRate: 24,
        bloodPressure: '120/80',
        crt: '<2s',
        mucousMembranes: 'Normocorada',
        glucose: 95,
        painScore: 2,
        notes: 'Calmo, sem queixas álgicas agudas.',
        recordedBy: 'Enf. Carlos'
      },
      {
        id: 'v2',
        timestamp: '14:00',
        temperature: 38.4,
        heartRate: 104,
        respRate: 22,
        bloodPressure: '125/82',
        crt: '<2s',
        mucousMembranes: 'Normocorada',
        glucose: 102,
        painScore: 1,
        notes: 'Boa recuperação motora.',
        recordedBy: 'Enf. Beatriz'
      }
    ]
  },
  {
    id: 'pat-2',
    kennelId: 'B02',
    name: '',
    species: 'Cão',
    breed: '',
    tutor: '',
    weight: 0,
    diagnosis: '',
    attendingVet: '',
    admissionDate: '',
    critical: false,
    status: 'cleaning',
    ward: 'dogs',
    wardLabel: 'CÃES',
    notes: 'Aguardando higienização e esterilização com Quaternário de Amônio.',
    fluids: { hasFluids: false, solution: '', volumeTotalMl: 0, rateMlH: 0, dropsPerMin: 0 },
    medications: [],
    vitalRecords: []
  },
  {
    id: 'pat-3',
    kennelId: 'B03',
    name: '',
    species: 'Cão',
    breed: '',
    tutor: '',
    weight: 0,
    diagnosis: '',
    attendingVet: '',
    admissionDate: '',
    critical: false,
    status: 'free',
    ward: 'dogs',
    wardLabel: 'CÃES',
    notes: '',
    fluids: { hasFluids: false, solution: '', volumeTotalMl: 0, rateMlH: 0, dropsPerMin: 0 },
    medications: [],
    vitalRecords: []
  },
  {
    id: 'pat-4',
    kennelId: 'C01',
    name: 'Mimi',
    species: 'Gato',
    breed: 'Siamês',
    tutor: 'João Silva',
    tutorPhone: '(11) 97654-3210',
    weight: 4.2,
    diagnosis: 'DTUIF / Desobstrução Uretral',
    attendingVet: 'Dr. Lucas Mendes',
    admissionDate: '2026-08-25 18:00',
    critical: true,
    status: 'occupied',
    ward: 'cats',
    wardLabel: 'GATOS',
    notes: 'Sonda uretral fixada. Débito urinário 3.5 ml/kg/h. Urina levemente colúrica.',
    dietNotes: 'Sachê Renal diluído em água morna',
    fluids: {
      hasFluids: true,
      solution: 'NaCl 0.9% + KCl 20mEq/L',
      volumeTotalMl: 250,
      rateMlH: 15,
      dropsPerMin: 15,
      startedAt: '12:00',
      estimatedEnd: '04:00'
    },
    medications: [
      {
        id: 'mc1',
        name: 'Tramadol 50mg/ml',
        dose: '0.17 ml (2mg/kg)',
        route: 'SC',
        frequency: '8/8h',
        prescribedBy: 'Dr. Lucas Mendes',
        times: [
          { time: '08:00', status: 'done', signedBy: 'Enf. Carlos', checkedAt: '08:10' },
          { time: '16:00', status: 'late', signedBy: null },
          { time: '00:00', status: 'pending', signedBy: null }
        ]
      },
      {
        id: 'mc2',
        name: 'Prazosina 1mg (Manipulado)',
        dose: '1 cápsula PO',
        route: 'PO',
        frequency: '12/12h',
        prescribedBy: 'Dr. Lucas Mendes',
        times: [
          { time: '08:00', status: 'done', signedBy: 'Enf. Carlos', checkedAt: '08:00' },
          { time: '20:00', status: 'pending', signedBy: null }
        ]
      }
    ],
    vitalRecords: [
      {
        id: 'vc1',
        timestamp: '08:30',
        temperature: 37.8,
        heartRate: 180,
        respRate: 36,
        bloodPressure: '135/90',
        crt: '2s',
        mucousMembranes: 'Rosadas',
        glucose: 140,
        painScore: 7,
        notes: 'Desconforto na palpação hipogástrica.',
        recordedBy: 'Enf. Carlos'
      }
    ]
  },
  {
    id: 'pat-5',
    kennelId: 'UTI-01',
    name: 'Bolinha',
    species: 'Cão',
    breed: 'Bulldog Francês',
    tutor: 'Ana Souza',
    tutorPhone: '(11) 99888-7766',
    weight: 11.5,
    diagnosis: 'Edema Agudo de Pulmão / ICC Grau C',
    attendingVet: 'Dra. Camila Rocha (Intensivista)',
    admissionDate: '2026-08-26 04:15',
    critical: true,
    status: 'occupied',
    ward: 'icu',
    wardLabel: 'UTI',
    notes: 'Oxigenioterapia contínua em incubadora (FiO2 40%). Padrão respiratório restritivo.',
    dietNotes: 'Jejum relativo até estabilização do quadro respiratório',
    fluids: {
      hasFluids: true,
      solution: 'Solução de Manutenção com Bomba de Seringa',
      volumeTotalMl: 100,
      rateMlH: 8,
      dropsPerMin: 0,
      startedAt: '06:00',
      estimatedEnd: '18:00'
    },
    medications: [
      {
        id: 'mu1',
        name: 'Furosemida 10mg/ml',
        dose: '2.3 ml (2mg/kg) IV lento',
        route: 'IV',
        frequency: '6/6h',
        prescribedBy: 'Dra. Camila Rocha',
        times: [
          { time: '06:00', status: 'done', signedBy: 'Dra. Camila', checkedAt: '06:00' },
          { time: '12:00', status: 'done', signedBy: 'Dra. Camila', checkedAt: '12:00' },
          { time: '18:00', status: 'pending', signedBy: null },
          { time: '00:00', status: 'pending', signedBy: null }
        ]
      },
      {
        id: 'mu2',
        name: 'Pimobendan 1.25mg',
        dose: '2 comp PO',
        route: 'PO',
        frequency: '12/12h',
        prescribedBy: 'Dra. Camila Rocha',
        times: [
          { time: '08:00', status: 'done', signedBy: 'Dra. Camila', checkedAt: '08:00' },
          { time: '20:00', status: 'pending', signedBy: null }
        ]
      }
    ],
    vitalRecords: [
      {
        id: 'vu1',
        timestamp: '06:00',
        temperature: 37.6,
        heartRate: 165,
        respRate: 58,
        bloodPressure: '105/65',
        crt: '2.5s',
        mucousMembranes: 'Cianóticas',
        glucose: 110,
        painScore: 8,
        notes: 'Dispneia intensa e estertores bilaterais.',
        recordedBy: 'Dra. Camila Rocha'
      },
      {
        id: 'vu2',
        timestamp: '12:00',
        temperature: 38.2,
        heartRate: 135,
        respRate: 38,
        bloodPressure: '115/70',
        crt: '<2s',
        mucousMembranes: 'Normocorada',
        glucose: 105,
        painScore: 3,
        notes: 'Melhora expressiva do padrão respiratório.',
        recordedBy: 'Dra. Camila Rocha'
      }
    ]
  },
  {
    id: 'pat-6',
    kennelId: 'ISO-01',
    name: 'Thor',
    species: 'Cão',
    breed: 'SRD Filhote',
    tutor: 'Carlos Mendes',
    tutorPhone: '(11) 91234-5678',
    weight: 4.8,
    diagnosis: 'Gastroenterite Viral / Parvovirose Suspeita',
    attendingVet: 'Dr. Roberto Assis',
    admissionDate: '2026-08-26 01:20',
    critical: true,
    status: 'occupied',
    ward: 'isolation',
    wardLabel: 'ISOLAMENTO',
    notes: 'Acesso venoso central. Êmese e diarreia sanguinolenta controladas após Maropitant.',
    dietNotes: 'Suporte enteral microenteral 2ml a cada 2h',
    fluids: {
      hasFluids: true,
      solution: 'Ringer Lactato + Glicose 5% + KCl',
      volumeTotalMl: 500,
      rateMlH: 30,
      dropsPerMin: 30,
      startedAt: '08:00',
      estimatedEnd: '00:00'
    },
    medications: [
      {
        id: 'mi1',
        name: 'Ondansetrona 2mg/ml',
        dose: '1.2 ml IV',
        route: 'IV',
        frequency: '8/8h',
        prescribedBy: 'Dr. Roberto Assis',
        times: [
          { time: '07:00', status: 'done', signedBy: 'Enf. Beatriz', checkedAt: '07:00' },
          { time: '15:00', status: 'pending', signedBy: null },
          { time: '23:00', status: 'pending', signedBy: null }
        ]
      },
      {
        id: 'mi2',
        name: 'Metronidazol 5mg/ml',
        dose: '14.4 ml IV infusão lenta 30min',
        route: 'IV',
        frequency: '12/12h',
        prescribedBy: 'Dr. Roberto Assis',
        times: [
          { time: '09:00', status: 'done', signedBy: 'Enf. Beatriz', checkedAt: '09:00' },
          { time: '21:00', status: 'pending', signedBy: null }
        ]
      }
    ],
    vitalRecords: [
      {
        id: 'vi1',
        timestamp: '07:30',
        temperature: 37.2,
        heartRate: 140,
        respRate: 30,
        bloodPressure: '95/60',
        crt: '2.5s',
        mucousMembranes: 'Pálidas',
        glucose: 68,
        painScore: 5,
        notes: 'Hipoglicemia corrigida em bólus IV de glicose 25%.',
        recordedBy: 'Enf. Beatriz'
      }
    ]
  }
];

const initialHandovers: HandoverRecord[] = [
  {
    id: 'h-1',
    date: '2026-08-26',
    shift: 'diurno',
    outgoingVet: 'Dr. Lucas Mendes (CRMV 34.891)',
    incomingVet: 'Dra. Fernanda Silva (CRMV 42.109)',
    censusSummary: {
      totalPatients: 4,
      criticalCount: 3,
      pendingMedsCount: 6
    },
    cleaningChecks: {
      baias_ocupadas: true,
      baias_vazias: true,
      piso_internacao: true,
      piso_recepcao: true,
      consultorio: true,
      banheiros: true,
      bancadas: true,
      baldes: true,
      pias_tanques: true,
      vasilhas: true,
      bloco_cirurgico: true,
      sala_exames: true,
      corredores: true,
      roupas_lavadas: true,
      roupas_dobradas: true,
      int_nao_infectante_org: true,
      int_infectante_org: true
    },
    orgChecks: {
      baia_infectante: true,
      baia_nao_infectante: true,
      estoque: true,
      materiais_repostos: true,
      meds_organizados: true,
      geladeira_armarios: true,
      papel_toalha: true,
      cirurgicos_limpos: true,
      cirurgicos_esterelizados: true,
      papeis_temperatura: true
    },
    equipChecks: {
      raiox_guardado: true,
      rx_desligado: true,
      hemograma_conferida: true,
      oxigenio: true,
      ar_condicionado: true
    },
    trashChecks: {
      lixo_infectante: true,
      lixo_nao_infectante: true,
      lixo_consultorio: true,
      lixo_recepcao: true,
      lixo_bloco: true,
      lixo_banheiros: true,
      lixo_sustentacao: true,
      perfurocortantes: true
    },
    intercurrences: 'Bolinha (UTI) admitido de madrugada com edema pulmonar, respondeu muito bem à furosemida.',
    otherNotes: 'Solicitado novo estoque de Ringer com Lactato.',
    signatureConfirmed: true,
    createdAt: '2026-08-26 07:05'
  }
];

export const useHospitalizationStore = create<HospitalizationState>((set, get) => ({
  kennels: initialKennels,
  handovers: initialHandovers,
  activeDoctors: ['Dra. Fernanda Silva', 'Dra. Camila Rocha', 'Dr. Roberto Assis', 'Enf. Beatriz'],

  admitPatient: (data) => set((state) => {
    const existingIndex = state.kennels.findIndex(k => k.kennelId === data.kennelId);
    const newPatient: KennelPatient = {
      ...data,
      id: `pat-${Date.now()}`,
      status: 'occupied',
      vitalRecords: [],
      medications: data.medications || []
    };

    if (existingIndex >= 0) {
      const updated = [...state.kennels];
      updated[existingIndex] = newPatient;
      return { kennels: updated };
    }

    return { kennels: [...state.kennels, newPatient] };
  }),

  dischargePatient: (kennelId) => set((state) => ({
    kennels: state.kennels.map(k => {
      if (k.kennelId === kennelId) {
        return {
          ...k,
          name: '',
          species: k.ward === 'cats' ? 'Gato' : 'Cão',
          breed: '',
          tutor: '',
          weight: 0,
          diagnosis: '',
          attendingVet: '',
          admissionDate: '',
          critical: false,
          status: 'cleaning',
          notes: 'Paciente recebeu alta médica. Baia aguardando higienização.',
          fluids: { hasFluids: false, solution: '', volumeTotalMl: 0, rateMlH: 0, dropsPerMin: 0 },
          medications: [],
          vitalRecords: []
        };
      }
      return k;
    })
  })),

  setKennelCleaning: (kennelId) => set((state) => ({
    kennels: state.kennels.map(k => k.kennelId === kennelId ? { ...k, status: 'cleaning' } : k)
  })),

  setKennelFree: (kennelId) => set((state) => ({
    kennels: state.kennels.map(k => k.kennelId === kennelId ? { ...k, status: 'free', notes: '' } : k)
  })),

  addVitalRecord: (kennelId, record) => set((state) => {
    const newRecord: VitalRecord = {
      ...record,
      id: `v-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    return {
      kennels: state.kennels.map(k => {
        if (k.kennelId === kennelId) {
          return {
            ...k,
            vitalRecords: [newRecord, ...k.vitalRecords]
          };
        }
        return k;
      })
    };
  }),

  addMedication: (kennelId, med) => set((state) => {
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}`
    };

    return {
      kennels: state.kennels.map(k => {
        if (k.kennelId === kennelId) {
          return {
            ...k,
            medications: [...k.medications, newMed]
          };
        }
        return k;
      })
    };
  }),

  toggleMedicationSlot: (kennelId, medId, timeIndex, signedBy = 'Enf. Atual', customStatus) => set((state) => ({
    kennels: state.kennels.map(k => {
      if (k.kennelId === kennelId) {
        return {
          ...k,
          medications: k.medications.map(m => {
            if (m.id === medId) {
              const newTimes = [...m.times];
              const slot = newTimes[timeIndex];
              if (slot) {
                if (customStatus) {
                  slot.status = customStatus;
                  slot.signedBy = customStatus === 'done' ? signedBy : null;
                  slot.checkedAt = customStatus === 'done' ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null;
                } else if (slot.status === 'pending' || slot.status === 'late') {
                  slot.status = 'done';
                  slot.signedBy = signedBy;
                  slot.checkedAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                } else if (slot.status === 'done') {
                  slot.status = 'pending';
                  slot.signedBy = null;
                  slot.checkedAt = null;
                }
              }
              return { ...m, times: newTimes };
            }
            return m;
          })
        };
      }
      return k;
    })
  })),

  updateFluidTherapy: (kennelId, fluids) => set((state) => ({
    kennels: state.kennels.map(k => k.kennelId === kennelId ? { ...k, fluids } : k)
  })),

  updatePatientNotes: (kennelId, notes, dietNotes) => set((state) => ({
    kennels: state.kennels.map(k => k.kennelId === kennelId ? { ...k, notes, dietNotes: dietNotes ?? k.dietNotes } : k)
  })),

  submitHandover: (handover) => set((state) => ({
    handovers: [
      {
        ...handover,
        id: `handover-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      },
      ...state.handovers
    ]
  }))
}));
