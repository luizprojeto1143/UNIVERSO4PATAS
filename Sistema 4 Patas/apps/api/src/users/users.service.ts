import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async resolveOrgId(orgId?: string): Promise<string> {
    if (orgId) return orgId;
    const firstOrg = await this.prisma.organization.findFirst();
    if (!firstOrg) {
      const newOrg = await this.prisma.organization.create({
        data: { name: 'Clínica 4 Patas', isActive: true },
      });
      return newOrg.id;
    }
    return firstOrg.id;
  }

  private formatUserName(email: string): string {
    if (email.includes('dr.nogueira')) return 'Dr. Nogueira';
    if (email.includes('dra.jessica')) return 'Dra. Jéssica';
    if (email.includes('admin')) return 'Dr. Carlos Nogueira (Admin)';
    const local = email.split('@')[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
  }

  async getUsers(organizationId?: string) {
    const orgId = await this.resolveOrgId(organizationId);
    const users = await this.prisma.user.findMany({
      where: { organizationId: orgId },
      include: {
        roles: { include: { role: true } },
        permissions: { include: { permission: true } },
        staffProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(u => ({
      ...u,
      name: this.formatUserName(u.email),
    }));
  }

  async createUser(
    organizationId: string | undefined,
    data: {
      email: string;
      password?: string;
      roleId?: string;
      crmv?: string;
      uf?: string;
      specialties?: string;
    },
  ) {
    const orgId = await this.resolveOrgId(organizationId);

    const existing = await this.prisma.user.findFirst({
      where: { email: data.email, organizationId: orgId },
    });

    if (existing) {
      throw new BadRequestException('Já existe um usuário cadastrado com este e-mail');
    }

    const plainPass = data.password || '123456';
    const passwordHash = await bcrypt.hash(plainPass, 10);

    const user = await this.prisma.user.create({
      data: {
        organizationId: orgId,
        email: data.email,
        passwordHash,
        isActive: true,
      },
    });

    if (data.roleId) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: data.roleId,
        },
      });
    }

    if (data.crmv || data.specialties) {
      await this.prisma.staffProfile.create({
        data: {
          userId: user.id,
          crmv: data.crmv || null,
          uf: data.uf || null,
          specialties: data.specialties || 'Atendimento Geral',
        },
      });
    }

    const created = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: { include: { role: true } },
        permissions: { include: { permission: true } },
        staffProfile: true,
      },
    });

    return {
      ...created,
      name: this.formatUserName(created!.email),
    };
  }
}
