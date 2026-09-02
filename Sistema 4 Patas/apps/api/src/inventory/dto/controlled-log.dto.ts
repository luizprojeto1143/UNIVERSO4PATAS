export class CreateControlledLogDto {
  productId: string;
  type: string; // ENTRADA, SAIDA
  quantity: number;
  prescriptionNumber?: string;
  vetName?: string;
  vetCrmv?: string;
  tutorName?: string;
  notes?: string;
}
