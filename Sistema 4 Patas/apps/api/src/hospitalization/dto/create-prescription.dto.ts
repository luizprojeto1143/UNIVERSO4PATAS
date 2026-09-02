export class CreateHospitalPrescriptionDto {
  hospitalizationId: string;
  medicationName: string;
  dosage: string;
  route: string;
  frequencyInHours: number; // ex: 4, 6, 8, 12, 24
  instructions?: string;
  firstScheduledTime?: string; // Data/hora inicial para aprazamento
}
