import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

export class CreateClinicalRecordDto {
  patientId: string;
}

export class CreateTimelineEventDto {
  type: string; // 'triage', 'anamnesis', 'prescription', 'exam', 'consent'
  title: string;
  description: string;
  data?: string; // JSON
}

export class CreateVaccineDto {
  patientId: string;
  name: string;
  dose?: string;
  dateApplied?: string;
  nextDueDate?: string;
}

export class CreatePrescriptionDto {
  clinicalRecordId: string;
  items: Array<{ name: string; dose?: string; route?: string; frequency?: string }>;
  notes?: string;
}

export class CreateAnamnesisDto {
  clinicalRecordId: string;
  description: string;
}

export class CreatePhysicalExamDto {
  clinicalRecordId: string;
  weight?: string;
  temperature?: string;
  heartRate?: string;
  respiratoryRate?: string;
  notes?: string;
}

export class AddInvoiceItemDto {
  name: string;
  quantity: number;
  unitPrice: number;
  type: 'service' | 'product' | 'combo';
  itemId?: string;
}

@Injectable()
export class ClinicalService {
  constructor(private prisma: PrismaService) {}

  async createClinicalRecord(
    organizationId: string,
    veterinarianId: string,
    dto: CreateClinicalRecordDto,
  ) {
    return this.prisma.clinicalRecord.create({
      data: {
        organizationId,
        veterinarianId,
        patientId: dto.patientId,
        status: 'open',
      },
    });
  }

  async getClinicalRecordDetails(organizationId: string, recordId: string) {
    const record = await this.prisma.clinicalRecord.findUnique({
      where: { id: recordId, organizationId },
      include: {
        patient: {
          include: {
            tutor: true,
            species: true,
            breed: true,
            alerts: true,
            vaccines: true,
          },
        },
        events: {
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          include: { items: true },
        },
      },
    });
    if (!record) throw new NotFoundException('Prontuário não encontrado');
    return record;
  }

  async getAllClinicalRecords(organizationId: string) {
    return this.prisma.clinicalRecord.findMany({
      where: {
        organizationId,
        status: { not: 'billed' },
      },
      include: {
        patient: {
          include: { tutor: true },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });
  }

  async finishClinicalRecord(organizationId: string, recordId: string) {
    return this.prisma.clinicalRecord.update({
      where: { id: recordId, organizationId },
      data: {
        status: 'completed',
        finishedAt: new Date(),
      },
    });
  }

  async addEventToTimeline(
    clinicalRecordId: string,
    veterinarianId: string,
    dto: CreateTimelineEventDto,
  ) {
    const record = await this.prisma.clinicalRecord.findUnique({
      where: { id: clinicalRecordId },
      include: { patient: true },
    });

    if (!record) throw new NotFoundException('Atendimento não encontrado');

    const event = await this.prisma.timelineEvent.create({
      data: {
        clinicalRecordId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        data: dto.data,
        createdBy: veterinarianId,
      },
    });

    if (dto.type === 'consent') {
      const magicToken = randomUUID();
      await this.prisma.signatureDocument.create({
        data: {
          organizationId: record.organizationId,
          patientId: record.patientId,
          tutorId: record.patient.tutorId,
          clinicalRecordId: record.id,
          title: dto.title,
          content: dto.description,
          status: 'PENDING',
          magicToken: magicToken,
        },
      });
    }

    return event;
  }

  async addItemToRecordInvoice(
    organizationId: string,
    recordId: string,
    dto: AddInvoiceItemDto,
  ) {
    const record = await this.prisma.clinicalRecord.findUnique({
      where: { id: recordId, organizationId },
      include: { patient: true },
    });

    if (!record) throw new NotFoundException('Prontuário não encontrado');

    // Find or create an invoice for this record
    let invoice = await this.prisma.invoice.findFirst({
      where: { clinicalRecordId: recordId, organizationId },
    });

    if (!invoice) {
      invoice = await this.prisma.invoice.create({
        data: {
          organizationId,
          tutorId: record.patient.tutorId,
          clinicalRecordId: recordId,
          status: 'pending',
          totalAmount: 0,
        },
      });
    }

    // Create generic service or product if not provided ID (for MVP)
    let serviceId = null;
    let productId = null;
    let comboId = null;

    if (dto.itemId) {
      if (dto.type === 'service') serviceId = dto.itemId;
      else if (dto.type === 'product') productId = dto.itemId;
      else if (dto.type === 'combo') comboId = dto.itemId;
    } else {
      if (dto.type === 'service') {
        const service = await this.prisma.service.create({
          data: {
            organizationId,
            name: dto.name,
            basePrice: dto.unitPrice,
          },
        });
        serviceId = service.id;
      } else if (dto.type === 'product') {
        const product = await this.prisma.product.create({
          data: {
            organizationId,
            name: dto.name,
            basePrice: dto.unitPrice,
          },
        });
        productId = product.id;
      }
    }

    const totalPrice = dto.quantity * dto.unitPrice;
    await this.prisma.invoiceItem.create({
      data: {
        invoiceId: invoice.id,
        serviceId,
        productId,
        comboId,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        totalPrice: totalPrice,
      },
    });

    // Update invoice total
    await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        totalAmount: { increment: totalPrice },
      },
    });
  }

  async transcribeAudioMock(audioData?: string) {
    // Simula uma IA transcrevendo o audio e separando as falas
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          tutorReport:
            'O tutor relatou que o animal vomitou três vezes hoje de manhã e está sem comer desde ontem à noite. Está bem quieto no canto.',
          anamnesis:
            'Paciente chegou apresentando letargia e hiporexia há 24h. Mucosas normocoradas, desidratação leve (cerca de 5%). Abdome sensível à palpação cranial. Sugere-se exame de sangue para descartar infecção e ultrassom abdominal.',
        });
      }, 1500);
    });
  }

  // ... (getPatientTimeline and createVaccine omitted for brevity, will put back below)
  async getPatientTimeline(organizationId: string, patientId: string) {
    const records = await this.prisma.clinicalRecord.findMany({
      where: { patientId, organizationId },
      include: {
        events: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
        veterinarian: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    return records.map((record) => ({
      recordId: record.id,
      status: record.status,
      startedAt: record.startedAt,
      veterinarian: `Dr(a). ${record.veterinarian.email.split('@')[0]}`,
      events: record.events.map((event) => {
        let metrics = undefined;
        if (event.data) {
          try {
            metrics = JSON.parse(event.data);
            if (metrics.temperature)
              metrics.temperature = `${metrics.temperature}°C`;
            if (metrics.weight) metrics.weight = `${metrics.weight}kg`;
            if (metrics.heartRate)
              metrics.heartRate = `${metrics.heartRate} bpm`;
          } catch (e) {}
        }
        return {
          id: event.id,
          type: event.type.toLowerCase(),
          title: event.title,
          time: event.createdAt.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: event.createdAt.toLocaleDateString('pt-BR'),
          professional: `Dr(a). ${event.user.email.split('@')[0]}`,
          description: event.description,
          metrics,
          color:
            event.type.toLowerCase() === 'triage'
              ? 'green'
              : event.type.toLowerCase() === 'consent'
                ? 'amber'
                : 'indigo',
        };
      }),
    }));
  }

  async createVaccine(organizationId: string, dto: CreateVaccineDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId, organizationId },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    return this.prisma.vaccine.create({
      data: {
        patientId: dto.patientId,
        name: dto.name,
        dose: dto.dose,
        dateApplied: dto.dateApplied ? new Date(dto.dateApplied) : new Date(),
        nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : null,
      },
    });
  }

  async requestExam(
    organizationId: string,
    recordId: string,
    veterinarianId: string,
    type: string,
  ) {
    const record = await this.prisma.clinicalRecord.findUnique({
      where: { id: recordId, organizationId },
    });
    if (!record) throw new NotFoundException('Atendimento não encontrado');

    const exam = await this.prisma.examRequest.create({
      data: {
        clinicalRecordId: record.id,
        type: type,
        status: 'pending',
      },
    });

    // Registra na timeline
    await this.prisma.timelineEvent.create({
      data: {
        clinicalRecordId: record.id,
        type: 'exam',
        title: `Exame Solicitado: ${type}`,
        description: 'Aguardando coleta/resultado do laboratório.',
        createdBy: veterinarianId,
      },
    });

    return exam;
  }

  async simulateExamResult(
    organizationId: string,
    examId: string,
    veterinarianId: string,
  ) {
    const exam = await this.prisma.examRequest.findUnique({
      where: { id: examId },
      include: { clinicalRecord: true },
    });
    if (!exam || exam.clinicalRecord.organizationId !== organizationId) {
      throw new NotFoundException('Exame não encontrado');
    }

    const updatedExam = await this.prisma.examRequest.update({
      where: { id: examId },
      data: {
        status: 'completed',
        results:
          'Parâmetros dentro da normalidade. Leucócitos: 8.500/uL, Hemácias: 6.2 milhões/uL. (Laudo Simulado)',
      },
    });

    // Registra na timeline o laudo pronto
    await this.prisma.timelineEvent.create({
      data: {
        clinicalRecordId: exam.clinicalRecordId,
        type: 'exam_result',
        title: `Resultado Recebido: ${exam.type}`,
        description: updatedExam.results,
        createdBy: veterinarianId,
      },
    });

    return updatedExam;
  }

  async generateDocument(
    organizationId: string,
    recordId: string,
    templateId: string,
  ) {
    const record = await this.prisma.clinicalRecord.findUnique({
      where: { id: recordId, organizationId },
      include: { patient: { include: { tutor: true } }, veterinarian: true },
    });
    if (!record) throw new NotFoundException('Atendimento não encontrado');

    const template = await this.prisma.documentTemplate.findUnique({
      where: { id: templateId, organizationId },
    });
    if (!template) throw new NotFoundException('Template não encontrado');

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    let content = template.content;

    // String replacement magic
    content = content.replace(/\{\{PATIENT_NAME\}\}/g, record.patient.name);
    content = content.replace(/\{\{TUTOR_NAME\}\}/g, record.patient.tutor.name);
    content = content.replace(
      /\{\{TUTOR_CPF\}\}/g,
      record.patient.tutor.cpf || 'NÃO INFORMADO',
    );
    content = content.replace(
      /\{\{VET_NAME\}\}/g,
      `Dr(a). ${record.veterinarian.email.split('@')[0]}`,
    );
    content = content.replace(
      /\{\{DATE\}\}/g,
      new Date().toLocaleDateString('pt-BR'),
    );

    if (org?.logoUrl) {
      content = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
          <img src="${org.logoUrl}" alt="Logo Clínica" style="max-width: 250px; max-height: 120px; object-fit: contain;" />
          <h2 style="margin: 15px 0 0 0; color: #334155; font-size: 24px;">${org.name}</h2>
        </div>
        ${content}
      `;
    } else {
      content = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
          <h2 style="margin: 0; color: #334155; font-size: 28px;">${org?.name || 'Clínica Veterinária'}</h2>
        </div>
        ${content}
      `;
    }

    const magicToken = randomUUID();
    const doc = await this.prisma.signatureDocument.create({
      data: {
        organizationId,
        patientId: record.patientId,
        tutorId: record.patient.tutorId,
        clinicalRecordId: record.id,
        title: template.title,
        content: content,
        status: 'PENDING',
        magicToken: magicToken,
      },
    });

    return doc;
  }

  async createPrescription(
    organizationId: string,
    veterinarianId: string,
    dto: CreatePrescriptionDto,
  ) {
    const formattedItems = (dto.items || [])
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.name}${i.dose ? ` — Dose: ${i.dose}` : ''}${i.frequency ? ` (${i.frequency})` : ''}`,
      )
      .join('\n');

    return this.prisma.timelineEvent.create({
      data: {
        clinicalRecordId: dto.clinicalRecordId,
        type: 'PRESCRIPTION',
        title: 'Receituário Veterinário Emitido',
        description: `${formattedItems}${dto.notes ? `\nObs: ${dto.notes}` : ''}`,
        data: JSON.stringify(dto.items || []),
        createdBy: veterinarianId,
      },
    });
  }

  async createAnamnesis(
    organizationId: string,
    veterinarianId: string,
    dto: CreateAnamnesisDto,
  ) {
    return this.prisma.timelineEvent.create({
      data: {
        clinicalRecordId: dto.clinicalRecordId,
        type: 'NOTE',
        title: 'Anamnese e Queixa Principal',
        description: dto.description,
        createdBy: veterinarianId,
      },
    });
  }

  async createPhysicalExam(
    organizationId: string,
    veterinarianId: string,
    dto: CreatePhysicalExamDto,
  ) {
    return this.prisma.timelineEvent.create({
      data: {
        clinicalRecordId: dto.clinicalRecordId,
        type: 'EXAM',
        title: 'Triagem e Exame Físico',
        description: dto.notes || 'Sinais vitais registrados com sucesso.',
        data: JSON.stringify({
          weight: dto.weight,
          temperature: dto.temperature,
          heartRate: dto.heartRate,
          respiratoryRate: dto.respiratoryRate,
        }),
        createdBy: veterinarianId,
      },
    });
  }
}
