import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateTemplateDto {
  title: string;
  content: string;
}

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async getTemplates(organizationId: string) {
    return this.prisma.documentTemplate.findMany({
      where: { organizationId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTemplate(organizationId: string, dto: CreateTemplateDto) {
    return this.prisma.documentTemplate.create({
      data: {
        organizationId,
        title: dto.title,
        content: dto.content,
      },
    });
  }
}
