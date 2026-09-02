export class CreateShiftHandoverDto {
  hospitalizationId?: string;
  shift: string; // MANHA, TARDE, NOITE
  patientStatus: string; // ESTAVEL, CRITICO, EM_OBSERVACAO, MELHORA
  summaryNotes: string;
}
