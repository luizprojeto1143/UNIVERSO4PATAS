import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TutorAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(cpf: string, password?: string) {
    // Para simplificar o MVP, permitiremos login apenas pelo CPF
    // No futuro, podemos validar a senha
    const tutor = await this.prisma.tutor.findFirst({
      where: { cpf },
    });

    if (!tutor) {
      throw new UnauthorizedException('Tutor não encontrado com este CPF');
    }

    if (password && tutor.password && tutor.password !== password) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = {
      sub: tutor.id,
      email: tutor.email,
      name: tutor.name,
      role: 'tutor', // Important to distinguish from employee roles
      organizationId: tutor.organizationId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      tutor: {
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
      },
    };
  }
}
