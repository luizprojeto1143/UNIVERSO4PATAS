import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async getPatients(organizationId: string) {
    return this.prisma.patient.findMany({
      where: { organizationId },
      include: { species: true, breed: true, tutor: true },
    });
  }

  async createPatient(organizationId: string, dto: any) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Resolver ou criar Tutor
      let tutorId = dto.tutorId;
      if (!tutorId) {
        let tutor = await tx.tutor.findFirst({
          where: { email: dto.tutorEmail || 'tutor@clinica.com.br', organizationId },
        });
        if (!tutor) {
          tutor = await tx.tutor.create({
            data: {
              organizationId,
              name: dto.tutorName || 'Tutor Padrão',
              email: dto.tutorEmail || null,
              phone: dto.tutorPhone || '(11) 99999-9999',
              cpf: dto.tutorCpf || null,
            },
          });
        }
        tutorId = tutor.id;
      }

      // 2. Resolver ou criar Espécie
      const speciesName = dto.speciesName || dto.species || 'Cão';
      let species = await tx.species.findFirst({
        where: { name: speciesName, organizationId },
      });
      if (!species) {
        species = await tx.species.create({
          data: { name: speciesName, organizationId },
        });
      }

      // 3. Resolver ou criar Raça
      const breedName = dto.breedName || dto.breed;
      let breed = null;
      if (breedName) {
        breed = await tx.breed.findFirst({
          where: { name: breedName, speciesId: species.id },
        });
        if (!breed) {
          breed = await tx.breed.create({
            data: {
              name: breedName,
              speciesId: species.id,
              organizationId,
            },
          });
        }
      }

      // 4. Criar Paciente
      const patientName = dto.name || dto.patientName || 'Pet';
      const patient = await tx.patient.create({
        data: {
          organizationId,
          tutorId,
          speciesId: species.id,
          breedId: breed?.id,
          name: patientName,
          weight: parseFloat(dto.weight) || 5.0,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        },
        include: {
          tutor: true,
          species: true,
          breed: true,
        },
      });

      return patient;
    });
  }

  async getPatient(organizationId: string, id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id, organizationId },
      include: {
        tutor: true,
        species: true,
        breed: true,
        alerts: true,
        vaccines: true,
        records: {
          include: {
            veterinarian: true,
            events: {
              include: { user: true },
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: { startedAt: 'desc' },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return patient;
  }

  async updatePatient(organizationId: string, id: string, data: any) {
    const patient = await this.prisma.patient.findUnique({
      where: { id, organizationId },
    });
    
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.birthDate !== undefined) {
      updateData.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    }

    return this.prisma.patient.update({
      where: { id },
      data: updateData,
    });
  }

  async addVaccine(organizationId: string, patientId: string, data: any) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, organizationId },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    return this.prisma.vaccine.create({
      data: {
        patientId,
        name: data.name,
        dose: data.dose,
        dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
        nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
      },
    });
  }

  async addAlert(organizationId: string, patientId: string, data: any) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, organizationId },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    return this.prisma.patientAlert.create({
      data: {
        patientId,
        description: data.description,
        severity: data.severity || 'low',
      },
    });
  }
}
