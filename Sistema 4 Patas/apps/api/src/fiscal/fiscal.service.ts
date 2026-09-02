import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FiscalService {
  private readonly logger = new Logger(FiscalService.name);

  constructor(private prisma: PrismaService) {}

  async getSettings(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        cnpj: true,
        stateRegistration: true,
        municipalRegistration: true,
        taxRegime: true,
        environment: true,
        accountantEmail: true,
        autoEmitNotes: true,
      },
    });
    return org;
  }

  async updateSettings(organizationId: string, data: any) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data,
    });
  }

  async getNotes(organizationId: string) {
    return this.prisma.fiscalNote.findMany({
      where: { organizationId },
      include: { invoice: { include: { tutor: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @OnEvent('invoice.paid')
  async handleInvoicePaid(payload: {
    organizationId: string;
    invoiceId: string;
  }) {
    this.logger.log(
      `Evento recebido: Fatura ${payload.invoiceId} paga. Checando automação fiscal...`,
    );
    const settings = await this.getSettings(payload.organizationId);

    if (settings?.autoEmitNotes) {
      try {
        await this.emitNoteForInvoice(
          payload.organizationId,
          payload.invoiceId,
        );
      } catch (err: any) {
        this.logger.error(
          `Falha ao emitir nota automaticamente para ${payload.invoiceId}: ${err.message}`,
        );
      }
    }
  }

  // O "Motor" que emite a nota na SEFAZ Mockada
  async emitNoteForInvoice(organizationId: string, invoiceId: string) {
    // 1. Verifica se já existe nota
    const existing = await this.prisma.fiscalNote.findUnique({
      where: { invoiceId },
    });
    if (existing) {
      throw new Error('Nota fiscal já emitida para esta fatura');
    }

    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: { include: { product: true, service: true } } },
    });

    if (!invoice || invoice.organizationId !== organizationId) {
      throw new Error('Fatura não encontrada');
    }

    // Identifica se é Produto (NFC-e) ou Serviço (NFS-e)
    const hasProducts = invoice.items.some((i) => i.productId);
    const hasServices = invoice.items.some((i) => i.serviceId);

    // Simplificando o Split para o exemplo: Pega o tipo majoritário ou NFE padrão
    const type = hasServices && !hasProducts ? 'NFSE' : 'NFCE';

    // Cria a nota em estado de processamento
    const note = await this.prisma.fiscalNote.create({
      data: {
        organizationId,
        invoiceId,
        type,
        status: 'PROCESSING',
      },
    });

    // Simula a ida à SEFAZ (Demora 2 segundos)
    setTimeout(async () => {
      this.logger.log(`Processando envio para SEFAZ da Fatura ${invoiceId}...`);

      const accessKey = this.generateRandomAccessKey();
      const protocol = Date.now().toString();

      await this.prisma.fiscalNote.update({
        where: { id: note.id },
        data: {
          status: 'AUTHORIZED',
          number: Math.floor(Math.random() * 10000).toString(),
          series: '1',
          accessKey,
          protocol,
          xmlData: '<nfeProc><NFe>MOCK XML NFE AUTOMATICA</NFe></nfeProc>',
        },
      });
      this.logger.log(
        `Nota ${note.id} autorizada com sucesso! Chave: ${accessKey}`,
      );
    }, 2000);

    return note;
  }

  private generateRandomAccessKey() {
    let key = '';
    for (let i = 0; i < 44; i++) {
      key += Math.floor(Math.random() * 10).toString();
    }
    return key;
  }
}
