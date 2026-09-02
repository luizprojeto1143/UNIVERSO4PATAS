export class AdministerPrescriptionDto {
  status: string; // ADMINISTERED, SKIPPED, CANCELLED
  administeredBy?: string;
  notes?: string;
  batchNumber?: string;
}
