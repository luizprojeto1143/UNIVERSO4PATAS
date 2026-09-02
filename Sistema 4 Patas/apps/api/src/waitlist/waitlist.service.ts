import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateWaitlistDto {
  patientId: string;
  tutorId: string;
  preferredDate?: string;
  notes?: string;
}

@Injectable()
export class WaitlistService {
  constructor(private prisma: PrismaService) {}

  async getWaitlist(organizationId: string) {
    const list = await this.prisma.waitlistEntry.findMany({
      where: { organizationId, status: 'pending' },
      include: {
        patient: { include: { species: true } },
        tutor: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return list.map((item) => ({
      id: item.id,
      patientId: item.patient.id,
      patientName: item.patient.name,
      patientSpecies: item.patient.species.name,
      tutorId: item.tutor.id,
      tutorName: item.tutor.name,
      tutorPhone: item.tutor.phone,
      preferredDate: item.preferredDate,
      notes: item.notes,
      status: item.status,
    }));
  }

  async addEntry(organizationId: string, dto: CreateWaitlistDto) {
    return this.prisma.waitlistEntry.create({
      data: {
        organizationId,
        patientId: dto.patientId,
        tutorId: dto.tutorId,
        preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : null,
        notes: dto.notes,
        status: 'pending',
      },
    });
  }

  async updateStatus(organizationId: string, id: string, status: string) {
    return this.prisma.waitlistEntry.update({
      where: { id, organizationId },
      data: { status },
    });
  }
}
