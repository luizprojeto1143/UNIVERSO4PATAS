import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getRoles(organizationId: string) {
    return this.prisma.role.findMany({
      where: { organizationId },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany();
  }

  async createCustomPermission(data: { action: string; description: string }) {
    return this.prisma.permission.upsert({
      where: { action: data.action },
      update: { description: data.description },
      create: data,
    });
  }

  async getUsersWithPermissions(organizationId: string) {
    return this.prisma.user.findMany({
      where: { organizationId },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        permissions: { include: { permission: true } },
        staffProfile: true,
      },
    });
  }

  async updateUserRoles(
    userId: string,
    organizationId: string,
    roleIds: string[],
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.prisma.userRole.deleteMany({ where: { userId } });

    if (roleIds && roleIds.length > 0) {
      await Promise.all(
        roleIds.map((roleId) =>
          this.prisma.userRole.create({
            data: { userId, roleId },
          }),
        ),
      );
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        permissions: { include: { permission: true } },
      },
    });
  }

  async updateUserPermissions(
    userId: string,
    organizationId: string,
    permissions: string[],
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.prisma.userPermission.deleteMany({ where: { userId } });

    if (permissions && permissions.length > 0) {
      await Promise.all(
        permissions.map((permAction) =>
          this.prisma.permission
            .findUnique({ where: { action: permAction } })
            .then((p) => {
              if (p) {
                return this.prisma.userPermission.create({
                  data: { userId, permissionId: p.id },
                });
              }
            }),
        ),
      );
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async createRole(
    organizationId: string,
    data: { name: string; description?: string; permissions: string[] },
  ) {
    const role = await this.prisma.role.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
      },
    });

    if (data.permissions && data.permissions.length > 0) {
      await Promise.all(
        data.permissions.map((permAction) =>
          this.prisma.permission
            .findUnique({ where: { action: permAction } })
            .then((p) => {
              if (p) {
                return this.prisma.rolePermission.create({
                  data: { roleId: role.id, permissionId: p.id },
                });
              }
            }),
        ),
      );
    }

    return this.prisma.role.findUnique({
      where: { id: role.id },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async updateRolePermissions(
    roleId: string,
    organizationId: string,
    permissions: string[],
  ) {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, organizationId },
    });
    if (!role) throw new NotFoundException('Cargo não encontrado');

    await this.prisma.rolePermission.deleteMany({ where: { roleId } });

    if (permissions && permissions.length > 0) {
      await Promise.all(
        permissions.map((permAction) =>
          this.prisma.permission
            .findUnique({ where: { action: permAction } })
            .then((p) => {
              if (p) {
                return this.prisma.rolePermission.create({
                  data: { roleId: role.id, permissionId: p.id },
                });
              }
            }),
        ),
      );
    }

    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: { include: { permission: true } } },
    });
  }
}
