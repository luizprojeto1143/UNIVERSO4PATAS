export class CreatePatientDto {
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  tutorCpf?: string;

  patientName: string;
  speciesName: string;
  breedName?: string;
  weight?: number;
  birthDate?: string; // ISO string
}
