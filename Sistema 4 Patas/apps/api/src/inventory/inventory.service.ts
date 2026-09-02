import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { StockMovementDto } from './dto/stock-movement.dto';
import { CreateControlledLogDto } from './dto/controlled-log.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // --- LOTES & VALIDADE ---
  async createBatch(dto: CreateBatchDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const batch = await this.prisma.productBatch.create({
      data: {
        productId: dto.productId,
        batchNumber: dto.batchNumber,
        manufacturingDate: dto.manufacturingDate ? new Date(dto.manufacturingDate) : null,
        expirationDate: new Date(dto.expirationDate),
        quantity: dto.quantity,
        costPrice: dto.costPrice || product.costPrice || 0,
      },
    });

    // Atualiza saldo total do produto
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: {
        stock: { increment: Math.round(dto.quantity) },
      },
    });

    return batch;
  }

  async findBatchesByProduct(productId: string) {
    return this.prisma.productBatch.findMany({
      where: { productId },
      orderBy: { expirationDate: 'asc' },
    });
  }

  async getExpiringBatches(organizationId: string, daysAhead = 60) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return this.prisma.productBatch.findMany({
      where: {
        product: { organizationId },
        expirationDate: { lte: targetDate },
        quantity: { gt: 0 },
      },
      include: { product: true },
      orderBy: { expirationDate: 'asc' },
    });
  }

  // --- MOVIMENTAÇÃO DE ESTOQUE ---
  async registerStockMovement(organizationId: string, userId: string, dto: StockMovementDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, organizationId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');

    let qtyChange = dto.quantity;
    if (dto.type.startsWith('SAIDA') || dto.type === 'PERDA') {
      qtyChange = -Math.abs(dto.quantity);
      if (!product.allowsNegativeStock && product.stock + qtyChange < 0) {
        throw new BadRequestException(`Estoque insuficiente. Saldo atual: ${product.stock}`);
      }
    } else if (dto.type === 'ENTRADA') {
      qtyChange = Math.abs(dto.quantity);
    }

    const movement = await this.prisma.stockMovement.create({
      data: {
        organizationId,
        productId: dto.productId,
        batchId: dto.batchId || null,
        userId,
        type: dto.type,
        quantity: dto.quantity,
        reason: dto.reason,
      },
      include: { product: true, batch: true, user: true },
    });

    // Atualiza saldo do produto
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { stock: { increment: Math.round(qtyChange) } },
    });

    // Se houver lote vinculado, atualiza quantidade do lote
    if (dto.batchId) {
      await this.prisma.productBatch.update({
        where: { id: dto.batchId },
        data: { quantity: { increment: qtyChange } },
      });
    }

    return movement;
  }

  async getStockMovements(organizationId: string, productId?: string) {
    return this.prisma.stockMovement.findMany({
      where: {
        organizationId,
        ...(productId ? { productId } : {}),
      },
      include: { product: true, batch: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // --- LIVRO DE MEDICAMENTOS CONTROLADOS ---
  async createControlledLog(organizationId: string, dto: CreateControlledLogDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, organizationId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const lastLog = await this.prisma.controlledSubstanceLog.findFirst({
      where: { productId: dto.productId, organizationId },
      orderBy: { createdAt: 'desc' },
    });

    let previousBalance = lastLog ? lastLog.balanceAfter : product.stock;
    let balanceAfter = dto.type === 'ENTRADA' 
      ? previousBalance + dto.quantity 
      : previousBalance - dto.quantity;

    if (balanceAfter < 0) {
      throw new BadRequestException('Saldo de produto controlado não pode ser negativo');
    }

    return this.prisma.controlledSubstanceLog.create({
      data: {
        organizationId,
        productId: dto.productId,
        type: dto.type,
        quantity: dto.quantity,
        balanceAfter,
        prescriptionNumber: dto.prescriptionNumber,
        vetName: dto.vetName,
        vetCrmv: dto.vetCrmv,
        tutorName: dto.tutorName,
        notes: dto.notes,
      },
      include: { product: true },
    });
  }

  async getControlledLogs(organizationId: string, productId?: string) {
    return this.prisma.controlledSubstanceLog.findMany({
      where: {
        organizationId,
        ...(productId ? { productId } : {}),
      },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
