export class CreateBedDto {
  name: string;
  sector?: string;
  notes?: string;
}

export class UpdateBedDto {
  name?: string;
  sector?: string;
  status?: string; // DISPONIVEL, OCUPADO, MANUTENCAO, HIGIENIZACAO
  notes?: string;
}
