import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateAppointmentDto {
  patientId: string;
  tutorId: string;
  veterinarianId: string;
  date: string; // ISO String
  type?: string;
  durationInMinutes?: number;
  notes?: string;
  recurrence?: string; // 'none', 'weekly', 'monthly'
  recurrencesCount?: number;
  pipelineId?: string;
  stageId?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async getAppointments(organizationId: string) {
    const list = await this.prisma.appointment.findMany({
      where: { organizationId },
      include: {
        patient: { include: { species: true, breed: true } },
        tutor: true,
        veterinarian: true,
      },
      orderBy: { date: 'asc' },
    });

    return list.map((item) => ({
      id: item.id,
      patientId: item.patient.id,
      patientName: item.patient.name,
      patientSpecies: item.patient.species?.name || 'Pet',
      tutorId: item.tutor.id,
      tutorName: item.tutor.name,
      tutorPhone: item.tutor.phone,
      veterinarianId: item.veterinarian.id,
      veterinarianName: item.veterinarian.email.includes('dr.nogueira') 
        ? 'Dr. Nogueira' 
        : item.veterinarian.email.includes('dra.jessica') 
        ? 'Dra. Jéssica' 
        : `Dr(a). ${item.veterinarian.email.split('@')[0]}`,
      date: item.date,
      type: item.type,
      durationInMinutes: item.durationInMinutes,
      whatsappReminderSent: item.whatsappReminderSent,
      status: item.status,
      notes: item.notes,
      pipelineId: item.pipelineId,
      stageId: item.stageId,
    }));
  }

  async createAppointment(organizationId: string, dto: CreateAppointmentDto) {
    const isRecurring = dto.recurrence && dto.recurrence !== 'none' && dto.recurrencesCount && dto.recurrencesCount > 1;
    const groupId = isRecurring ? Math.random().toString(36).substring(7) : null;
    const count = isRecurring ? dto.recurrencesCount! : 1;
    
    const createdAppointments = [];
    let currentDate = new Date(dto.date);

    for (let i = 0; i < count; i++) {
      const appt = await this.prisma.appointment.create({
        data: {
          organizationId,
          patientId: dto.patientId,
          tutorId: dto.tutorId,
          veterinarianId: dto.veterinarianId,
          date: currentDate,
          type: dto.type || 'consulta',
          durationInMinutes: dto.durationInMinutes ? Number(dto.durationInMinutes) : 30,
          notes: dto.notes,
          status: 'scheduled',
          groupId,
          pipelineId: dto.pipelineId,
          stageId: dto.stageId,
        },
      });
      createdAppointments.push(appt);

      if (isRecurring) {
        if (dto.recurrence === 'weekly') {
          currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        } else if (dto.recurrence === 'monthly') {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
    }

    const firstAppt = createdAppointments[0];

    // CONEXÃO AUTOMÁTICA 1: Auto-criar Prontuário Médico se não existir aberto
    try {
      const existingRecord = await this.prisma.clinicalRecord.findFirst({
        where: {
          patientId: dto.patientId,
          organizationId,
          status: { in: ['open', 'in_progress'] },
        },
      });

      let clinicalRecordId = existingRecord?.id;
      if (!existingRecord) {
        const newRecord = await this.prisma.clinicalRecord.create({
          data: {
            organizationId,
            veterinarianId: dto.veterinarianId,
            patientId: dto.patientId,
            status: 'open',
          },
        });
        clinicalRecordId = newRecord.id;
      }

      // Adicionar evento na Timeline
      if (clinicalRecordId) {
        await this.prisma.timelineEvent.create({
          data: {
            clinicalRecordId,
            type: 'triage',
            title: `Agendamento Criado (${dto.type || 'Consulta'})`,
            description: `Consulta agendada para ${new Date(dto.date).toLocaleString('pt-BR')}. Notas: ${dto.notes || 'Sem observações'}.`,
            createdBy: dto.veterinarianId,
          },
        });

        // CONEXÃO AUTOMÁTICA 2: Auto-criar Fatura no Financeiro (PDV)
        let invoice = await this.prisma.invoice.findFirst({
          where: { clinicalRecordId, organizationId },
        });

        if (!invoice) {
          invoice = await this.prisma.invoice.create({
            data: {
              organizationId,
              tutorId: dto.tutorId,
              clinicalRecordId,
              status: 'pending',
              totalAmount: 150.00, // Valor base da consulta médica
            },
          });

          // Lançar item de consulta na fatura do PDV
          await this.prisma.invoiceItem.create({
            data: {
              invoiceId: invoice.id,
              quantity: 1,
              unitPrice: 150.00,
              totalPrice: 150.00,
            },
          });
        }
      }
    } catch (err) {
      console.error('Erro na integração automática com Prontuário/Financeiro:', err);
    }
    
    return firstAppt;
  }

  async updateAppointment(organizationId: string, id: string, data: any) {
    return this.prisma.appointment.update({
      where: { id, organizationId },
      data,
    });
  }

  async updateStatus(organizationId: string, id: string, status: string) {
    const updated = await this.prisma.appointment.update({
      where: { id, organizationId },
      data: { status },
    });

    // Se o status mudar para concluído, fecha o prontuário também
    if (status === 'completed') {
      try {
        const record = await this.prisma.clinicalRecord.findFirst({
          where: {
            patientId: updated.patientId,
            organizationId,
            status: { in: ['open', 'in_progress'] },
          },
        });
        if (record) {
          await this.prisma.clinicalRecord.update({
            where: { id: record.id },
            data: { status: 'completed', finishedAt: new Date() },
          });
        }
      } catch (err) {
        console.error('Erro ao encerrar prontuário automaticamente:', err);
      }
    }

    return updated;
  }

  async toggleReminder(organizationId: string, id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new Error("Not found");
    
    return this.prisma.appointment.update({
      where: { id, organizationId },
      data: { whatsappReminderSent: !appointment.whatsappReminderSent },
    });
  }
}
