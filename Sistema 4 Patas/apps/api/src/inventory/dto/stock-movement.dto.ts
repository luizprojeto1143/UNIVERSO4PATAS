export class StockMovementDto {
  productId: string;
  batchId?: string;
  type: string; // ENTRADA, SAIDA_CONSULTA, SAIDA_INTERNACAO, AJUSTE, PERDA
  quantity: number;
  reason?: string;
}
