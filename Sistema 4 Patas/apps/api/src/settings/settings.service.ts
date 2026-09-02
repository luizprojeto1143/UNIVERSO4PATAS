import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getClinicSettings(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        name: true,
        cnpj: true,
        accountantEmail: true,
        logoUrl: true,
      },
    });
    if (!org) throw new NotFoundException('Organização não encontrada');
    return org;
  }

  async updateClinicSettings(organizationId: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.cnpj !== undefined) updateData.cnpj = data.cnpj;
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: updateData,
    });
  }
}
