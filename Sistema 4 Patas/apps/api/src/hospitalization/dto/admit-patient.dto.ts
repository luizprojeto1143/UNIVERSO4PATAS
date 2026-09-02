export class AdmitPatientDto {
  patientId: string;
  bedId?: string;
  veterinarianId: string;
  reason: string;
  isolation?: boolean;
  expectedDischarge?: string;
}

export class DischargePatientDto {
  dischargeNotes?: string;
  status?: string; // DISCHARGED, DECEASED, TRANSFERRED
}
