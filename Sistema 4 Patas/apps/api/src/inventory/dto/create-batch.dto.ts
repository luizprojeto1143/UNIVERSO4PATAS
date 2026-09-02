export class CreateBatchDto {
  productId: string;
  batchNumber: string;
  manufacturingDate?: string;
  expirationDate: string;
  quantity: number;
  costPrice?: number;
}
