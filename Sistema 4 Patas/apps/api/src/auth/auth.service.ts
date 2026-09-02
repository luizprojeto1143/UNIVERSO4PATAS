import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, plainPassword: string) {
    if (!email || !plainPassword) {
      throw new UnauthorizedException('E-mail e senha são obrigatórios');
    }

    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        organization: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        permissions: {
          include: { permission: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    let isPasswordValid = false;

    if (user.passwordHash && user.passwordHash.startsWith('$2')) {
      isPasswordValid = await bcrypt.compare(plainPassword, user.passwordHash);
    } else {
      isPasswordValid = user.passwordHash === plainPassword;
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    // Extract unique permissions (Roles + Individual)
    const permissionsSet = new Set<string>();
    user.roles.forEach((ur) => {
      ur.role?.permissions?.forEach((rp) => {
        permissionsSet.add(rp.permission.action);
      });
    });
    user.permissions.forEach((up) => {
      permissionsSet.add(up.permission.action);
    });
    const permissions = Array.from(permissionsSet);

    const payload = {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      permissions,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        organizationId: user.organizationId,
        permissions,
      },
    };
  }
}
