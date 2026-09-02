import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class CreateInvoiceDto {
  tutorId: string;
  totalAmount: number;
  items: { description: string; unitPrice: number; quantity: number }[];
}

export class CheckoutPdvDto {
  tutorId?: string;
  clinicalRecordId?: string;
  totalAmount: number;
  discount: number;
  notes?: string;
  items: {
    type: 'product' | 'service' | 'combo';
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  payments: {
    method: string;
    amount: number;
  }[];
}

@Injectable()
export class FinancialService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getDashboard(organizationId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { organizationId },
      include: {
        tutor: true,
        clinicalRecord: {
          include: { patient: true },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let toReceive = 0;
    let received = 0;
    const overdue = 0;

    const mappedInvoices = invoices.map((inv) => {
      if (inv.status === 'pending') toReceive += inv.totalAmount;
      if (inv.status === 'paid') received += inv.totalAmount;

      return {
        id: inv.id,
        tutor: inv.tutor.name,
        description: inv.clinicalRecord
          ? `Serviços - Paciente: ${inv.clinicalRecord.patient.name}`
          : 'Serviços/Produtos Avulsos',
        amount: inv.totalAmount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        date: inv.createdAt.toLocaleDateString('pt-BR'),
        status:
          inv.status === 'pending'
            ? 'Pendente'
            : inv.status === 'paid'
              ? 'Pago'
              : 'Cancelado',
      };
    });

    return {
      summary: {
        toReceive: toReceive.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        received: received.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        overdue: overdue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
      invoices: mappedInvoices,
    };
  }

  async createInvoice(organizationId: string, dto: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: {
        organizationId,
        tutorId: dto.tutorId,
        totalAmount: dto.totalAmount,
        status: 'pending',
        items: {
          create: dto.items.map((item) => ({
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.unitPrice * item.quantity,
            // Armazenando description caso seja genérico sem produto cadastrado
            // idealmente isso estaria no modelo de schema.prisma mas para mock
            // no banco vamos apenas deixar sem ou salvar no observation, mas
            // Service/Product não são obrigatórios
          })),
        },
      },
    });
  }

  async payInvoice(organizationId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.update({
      where: { id: invoiceId, organizationId },
      data: { status: 'paid' },
    });

    // Dispara o evento para emissão automática (Zero-Click)
    this.eventEmitter.emit('invoice.paid', {
      organizationId,
      invoiceId,
    });

    return invoice;
  }

  async checkoutPdv(organizationId: string, dto: CheckoutPdvDto) {
    // Transação para garantir consistência: cria fatura, baixa estoque e cria pagamentos
    return this.prisma.$transaction(async (tx) => {
      // 1. Cria a fatura e os itens
      const invoice = await tx.invoice.create({
        data: {
          organizationId,
          tutorId: dto.tutorId || 'unknown', // Simplificação para o MVP (ideal seria obrigar tutor ou criar um genérico)
          clinicalRecordId: dto.clinicalRecordId,
          totalAmount: dto.totalAmount,
          discount: dto.discount,
          notes: dto.notes,
          status: 'paid', // Assumindo que no PDV pagou na hora
          items: {
            create: dto.items.map((item) => ({
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              ...(item.type === 'product' && { productId: item.id }),
              ...(item.type === 'service' && { serviceId: item.id }),
              ...(item.type === 'combo' && { comboId: item.id }),
            })),
          },
          payments: {
            create: dto.payments.map((p) => ({
              amount: p.amount,
              method: p.method,
            })),
          },
        },
      });

      // 2. Baixa de estoque
      for (const item of dto.items) {
        if (item.type === 'product') {
          await tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.quantity } },
          });
        }

        if (item.type === 'combo') {
          // Busca o combo para ver quais produtos tem dentro
          const combo = await tx.combo.findUnique({
            where: { id: item.id },
            include: { products: true },
          });

          if (combo && combo.products.length > 0) {
            for (const cp of combo.products) {
              await tx.product.update({
                where: { id: cp.productId },
                data: { stock: { decrement: cp.quantity * item.quantity } },
              });
            }
          }
        }
      }

      // 3. Marca o clinical record como faturado (se houver)
      if (dto.clinicalRecordId) {
        await tx.clinicalRecord.update({
          where: { id: dto.clinicalRecordId },
          data: { status: 'billed' },
        });
      }

      // Emite evento de NF
      this.eventEmitter.emit('invoice.paid', {
        organizationId,
        invoiceId: invoice.id,
      });

      return invoice;
    });
  }
}
