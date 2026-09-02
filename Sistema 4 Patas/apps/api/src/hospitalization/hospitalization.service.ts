import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBedDto, UpdateBedDto } from './dto/create-bed.dto';
import { AdmitPatientDto, DischargePatientDto } from './dto/admit-patient.dto';
import { CreateHospitalPrescriptionDto } from './dto/create-prescription.dto';
import { AdministerPrescriptionDto } from './dto/administer-prescription.dto';
import { CreateShiftHandoverDto } from './dto/create-shift-handover.dto';

@Injectable()
export class HospitalizationService {
  constructor(private prisma: PrismaService) {}

  // --- LEITOS / BAIAS ---
  async createBed(organizationId: string, dto: CreateBedDto) {
    return this.prisma.bed.create({
      data: {
        organizationId,
        name: dto.name,
        sector: dto.sector || 'Geral',
        notes: dto.notes,
        status: 'DISPONIVEL',
      },
    });
  }

  async findAllBeds(organizationId: string) {
    return this.prisma.bed.findMany({
      where: { organizationId },
      include: {
        hospitalizations: {
          where: { status: 'ACTIVE' },
          include: {
            patient: {
              include: { tutor: true, species: true, breed: true },
            },
            veterinarian: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async updateBed(id: string, organizationId: string, dto: UpdateBedDto) {
    const bed = await this.prisma.bed.findFirst({
      where: { id, organizationId },
    });
    if (!bed) throw new NotFoundException('Leito não encontrado');

    return this.prisma.bed.update({
      where: { id },
      data: {
        name: dto.name,
        sector: dto.sector,
        status: dto.status,
        notes: dto.notes,
      },
    });
  }

  // --- INTERNAÇÕES ---
  async admitPatient(organizationId: string, dto: AdmitPatientDto) {
    let bedName = 'Internação Geral';
    if (dto.bedId) {
      const bed = await this.prisma.bed.findFirst({
        where: { id: dto.bedId, organizationId },
      });
      if (!bed) throw new NotFoundException('Leito não encontrado');
      if (bed.status === 'OCUPADO') {
        throw new BadRequestException('Este leito já está ocupado');
      }
      bedName = bed.name;
      await this.prisma.bed.update({
        where: { id: dto.bedId },
        data: { status: 'OCUPADO' },
      });
    }

    const hospitalization = await this.prisma.hospitalization.create({
      data: {
        organizationId,
        patientId: dto.patientId,
        bedId: dto.bedId || null,
        veterinarianId: dto.veterinarianId,
        reason: dto.reason,
        isolation: dto.isolation || false,
        status: 'ACTIVE',
        expectedDischarge: dto.expectedDischarge ? new Date(dto.expectedDischarge) : null,
      },
      include: {
        patient: { include: { tutor: true, species: true, breed: true } },
        bed: true,
        veterinarian: true,
      },
    });

    // CONEXÃO AUTOMÁTICA 1: Registrar na Timeline do Prontuário Médico
    try {
      const record = await this.prisma.clinicalRecord.findFirst({
        where: {
          patientId: dto.patientId,
          organizationId,
          status: { in: ['open', 'in_progress'] },
        },
      });

      if (record) {
        await this.prisma.timelineEvent.create({
          data: {
            clinicalRecordId: record.id,
            type: 'triage',
            title: `Admissão em Internação (${bedName})`,
            description: `Paciente admitido na UTI. Motivo: ${dto.reason || 'Monitoramento hospitalar'}. Isolamento: ${dto.isolation ? 'Sim' : 'Não'}.`,
            createdBy: dto.veterinarianId,
          },
        });

        // CONEXÃO AUTOMÁTICA 2: Lançar Diária de Internação no Financeiro (PDV)
        let invoice = await this.prisma.invoice.findFirst({
          where: { clinicalRecordId: record.id, organizationId },
        });

        if (!invoice) {
          invoice = await this.prisma.invoice.create({
            data: {
              organizationId,
              tutorId: hospitalization.patient.tutorId,
              clinicalRecordId: record.id,
              status: 'pending',
              totalAmount: 250.00,
            },
          });
        }

        await this.prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            quantity: 1,
            unitPrice: 250.00,
            totalPrice: 250.00,
          },
        });

        await this.prisma.invoice.update({
          where: { id: invoice.id },
          data: { totalAmount: { increment: 250.00 } },
        });
      }
    } catch (err) {
      console.error('Erro na integração automática com Prontuário/Financeiro da UTI:', err);
    }

    return hospitalization;
  }

  async findAllHospitalizations(organizationId: string, status?: string) {
    return this.prisma.hospitalization.findMany({
      where: {
        organizationId,
        ...(status ? { status } : {}),
      },
      include: {
        patient: { include: { tutor: true, species: true, breed: true } },
        bed: true,
        veterinarian: true,
        prescriptions: {
          include: {
            administrations: {
              orderBy: { scheduledTime: 'asc' },
            },
          },
        },
        shiftHandovers: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { admittedAt: 'desc' },
    });
  }

  async findHospitalizationById(id: string, organizationId: string) {
    const hospitalization = await this.prisma.hospitalization.findFirst({
      where: { id, organizationId },
      include: {
        patient: { include: { tutor: true, species: true, breed: true, alerts: true } },
        bed: true,
        veterinarian: true,
        prescriptions: {
          where: { isActive: true },
          include: {
            administrations: {
              orderBy: { scheduledTime: 'asc' },
            },
          },
        },
        shiftHandovers: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!hospitalization) throw new NotFoundException('Internação não encontrada');
    return hospitalization;
  }

  async dischargePatient(id: string, organizationId: string, dto: DischargePatientDto) {
    const hosp = await this.prisma.hospitalization.findFirst({
      where: { id, organizationId },
    });
    if (!hosp) throw new NotFoundException('Internação não encontrada');

    const updated = await this.prisma.hospitalization.update({
      where: { id },
      data: {
        status: dto.status || 'DISCHARGED',
        dischargedAt: new Date(),
        dischargeNotes: dto.dischargeNotes,
      },
    });

    if (hosp.bedId) {
      await this.prisma.bed.update({
        where: { id: hosp.bedId },
        data: { status: 'DISPONIVEL' },
      });
    }

    return updated;
  }

  // --- PRESCRIÇÃO HOSPITALAR & APRAZAMENTO ---
  async createPrescription(organizationId: string, dto: CreateHospitalPrescriptionDto) {
    const hosp = await this.prisma.hospitalization.findFirst({
      where: { id: dto.hospitalizationId, organizationId },
    });
    if (!hosp) throw new NotFoundException('Internação não encontrada');

    const prescription = await this.prisma.hospitalPrescription.create({
      data: {
        hospitalizationId: dto.hospitalizationId,
        medicationName: dto.medicationName,
        dosage: dto.dosage,
        route: dto.route,
        frequencyInHours: dto.frequencyInHours,
        instructions: dto.instructions,
      },
    });

    const intervalMs = dto.frequencyInHours * 60 * 60 * 1000;
    const startMs = dto.firstScheduledTime
      ? new Date(dto.firstScheduledTime).getTime()
      : Date.now();
    const endMs = startMs + 24 * 60 * 60 * 1000;

    const adminRecords = [];
    for (let timeMs = startMs; timeMs <= endMs; timeMs += intervalMs) {
      adminRecords.push({
        prescriptionId: prescription.id,
        scheduledTime: new Date(timeMs),
        status: 'PENDING',
      });
    }

    if (adminRecords.length > 0) {
      await this.prisma.prescriptionAdministration.createMany({
        data: adminRecords,
      });
    }

    return this.prisma.hospitalPrescription.findUnique({
      where: { id: prescription.id },
      include: {
        administrations: {
          orderBy: { scheduledTime: 'asc' },
        },
      },
    });
  }

  async administerPrescription(
    administrationId: string,
    userId: string,
    dto: AdministerPrescriptionDto,
  ) {
    const adminRecord = await this.prisma.prescriptionAdministration.findUnique({
      where: { id: administrationId },
      include: { prescription: { include: { hospitalization: true } } },
    });
    if (!adminRecord) throw new NotFoundException('Registro de aprazamento não encontrado');

    const updated = await this.prisma.prescriptionAdministration.update({
      where: { id: administrationId },
      data: {
        status: dto.status,
        administeredAt: dto.status === 'ADMINISTERED' ? new Date() : null,
        administeredBy: dto.administeredBy || userId,
        notes: dto.notes,
        batchNumber: dto.batchNumber,
      },
      include: {
        user: true,
      },
    });

    // CONEXÃO AUTOMÁTICA 3: Se foi administrado, gera baixa no estoque
    if (dto.status === 'ADMINISTERED') {
      try {
        const medName = adminRecord.prescription.medicationName;
        const orgId = adminRecord.prescription.hospitalization.organizationId;
        
        const matchingProduct = await this.prisma.product.findFirst({
          where: { organizationId: orgId, name: { contains: medName } },
        });

        if (matchingProduct) {
          await this.prisma.stockMovement.create({
            data: {
              organizationId: orgId,
              productId: matchingProduct.id,
              type: 'SAIDA_INTERNACAO',
              quantity: 1,
              reason: `Medicação administrada na UTI (Prescrição: ${medName})`,
              userId: userId,
            },
          });
        }
      } catch (err) {
        console.error('Erro ao dar baixa no estoque via UTI:', err);
      }
    }

    return updated;
  }

  // --- PASSAGEM DE PLANTÃO ---
  async createShiftHandover(organizationId: string, authorId: string, dto: CreateShiftHandoverDto) {
    return this.prisma.shiftHandover.create({
      data: {
        organizationId,
        hospitalizationId: dto.hospitalizationId || null,
        authorId,
        shift: dto.shift,
        patientStatus: dto.patientStatus,
        summaryNotes: dto.summaryNotes,
      },
      include: {
        author: true,
        hospitalization: {
          include: { patient: true },
        },
      },
    });
  }

  async getShiftHandovers(organizationId: string, hospitalizationId?: string) {
    return this.prisma.shiftHandover.findMany({
      where: {
        organizationId,
        ...(hospitalizationId ? { hospitalizationId } : {}),
      },
      include: {
        author: true,
        hospitalization: {
          include: { patient: true, bed: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
