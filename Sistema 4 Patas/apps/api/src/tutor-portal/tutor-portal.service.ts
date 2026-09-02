import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TutorPortalService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(tutorId: string) {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id: tutorId },
      include: {
        patients: {
          include: {
            species: true,
            breed: true,
            vaccines: {
              orderBy: { nextDueDate: 'asc' },
            },
            alerts: true,
            records: {
              take: 5,
              orderBy: { startedAt: 'desc' },
            },
          },
        },
        signatureDocuments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        appointments: {
          where: { date: { gte: new Date() }, status: { not: 'canceled' } },
          orderBy: { date: 'asc' },
          include: {
            patient: true,
            veterinarian: true,
          },
        },
      },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor não encontrado');
    }

    return {
      tutor: {
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
        phone: tutor.phone,
      },
      patients: tutor.patients.map((p) => ({
        id: p.id,
        name: p.name,
        species: p.species?.name,
        breed: p.breed?.name,
        birthDate: p.birthDate,
        weight: p.weight,
        vaccines: p.vaccines,
        alerts: p.alerts,
        clinicalRecords: p.records,
      })),
      pendingSignatures: tutor.signatureDocuments.filter(
        (d) => d.status === 'PENDING',
      ),
      upcomingAppointments: tutor.appointments,
    };
  }

  async getVeterinarians(organizationId: string) {
    // Return staff that have veterinarian role or just active users for MVP
    return this.prisma.user.findMany({
      where: { organizationId, isActive: true },
      select: {
        id: true,
        email: true,
        staffProfile: { select: { crmv: true } },
      },
    });
  }

  async createAppointment(
    tutorId: string,
    data: {
      patientId: string;
      veterinarianId: string;
      date: string;
      notes?: string;
    },
  ) {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) throw new NotFoundException('Tutor não encontrado');

    return this.prisma.appointment.create({
      data: {
        organizationId: tutor.organizationId,
        tutorId,
        patientId: data.patientId,
        veterinarianId: data.veterinarianId,
        date: new Date(data.date),
        notes: data.notes,
        status: 'scheduled',
      },
    });
  }

  async getSignatureDocument(tutorId: string, token: string) {
    const doc = await this.prisma.signatureDocument.findUnique({
      where: { magicToken: token },
      include: { patient: true },
    });

    if (!doc || doc.tutorId !== tutorId) {
      throw new NotFoundException('Documento não encontrado ou sem permissão');
    }

    return {
      id: doc.id,
      title: doc.title,
      content: doc.content,
      status: doc.status,
      patientName: doc.patient?.name,
      createdAt: doc.createdAt,
    };
  }

  async signDocument(tutorId: string, token: string, ipAddress: string) {
    const doc = await this.prisma.signatureDocument.findUnique({
      where: { magicToken: token },
    });

    if (!doc || doc.tutorId !== tutorId) {
      throw new NotFoundException('Documento não encontrado ou sem permissão');
    }

    if (doc.status === 'SIGNED') {
      return doc; // Already signed
    }

    return this.prisma.signatureDocument.update({
      where: { id: doc.id },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
        ipAddress: ipAddress || 'unknown',
      },
    });
  }

  async createPatient(
    tutorId: string,
    data: {
      name: string;
      speciesId: string;
      breedId?: string;
      birthDate?: string;
      weight?: number;
      color?: string;
    },
  ) {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) throw new NotFoundException('Tutor não encontrado');

    return this.prisma.patient.create({
      data: {
        organizationId: tutor.organizationId,
        tutorId,
        name: data.name,
        speciesId: data.speciesId,
        breedId: data.breedId || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        weight: data.weight ? parseFloat(data.weight.toString()) : null,
      },
    });
  }

  async getSpecies(tutorId: string) {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) throw new NotFoundException('Tutor não encontrado');

    return this.prisma.species.findMany({
      where: { organizationId: tutor.organizationId },
      include: { breeds: true },
    });
  }
}
