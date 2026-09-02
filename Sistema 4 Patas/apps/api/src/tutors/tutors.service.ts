import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TutorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.tutor.findMany({
      where: { organizationId, isActive: true },
      include: { patients: true },
      orderBy: { name: 'asc' },
    });
  }

  async createTutor(organizationId: string, data: any) {
    return this.prisma.tutor.create({
      data: {
        organizationId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || '',
        cpf: data.cpf || null,
        address: data.address || null,
      },
    });
  }

  async updateTutor(organizationId: string, id: string, data: any) {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id, organizationId },
    });
    
    if (!tutor) throw new Error('Tutor não encontrado');

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.cpf) updateData.cpf = data.cpf;
    if (data.address !== undefined) updateData.address = data.address;

    return this.prisma.tutor.update({
      where: { id },
      data: updateData,
    });
  }

  async getTutor(organizationId: string, id: string) {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id, organizationId },
      include: {
        patients: {
          include: { species: true, breed: true }
        }
      },
    });
    if (!tutor) throw new Error('Tutor não encontrado');
    return tutor;
  }
}
