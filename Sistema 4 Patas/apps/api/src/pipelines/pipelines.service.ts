import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PipelinesService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, data: any) {
    return this.prisma.pipeline.create({
      data: {
        organizationId,
        name: data.name,
        color: data.color,
        stages: {
          create: data.stages.map((s: any, index: number) => ({
            name: s.name,
            color: s.color || 'gray',
            order: index
          }))
        }
      },
      include: {
        stages: true
      }
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.pipeline.findMany({
      where: { organizationId },
      include: {
        stages: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.pipeline.findUnique({
      where: { id },
      include: {
        stages: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  async update(id: string, data: any) {
    // Para simplificar: deleta os estágios antigos e cria os novos.
    if (data.stages) {
      await this.prisma.pipelineStage.deleteMany({
        where: { pipelineId: id }
      });
      
      return this.prisma.pipeline.update({
        where: { id },
        data: {
          name: data.name,
          color: data.color,
          stages: {
            create: data.stages.map((s: any, index: number) => ({
              name: s.name,
              color: s.color || 'gray',
              order: index
            }))
          }
        },
        include: {
          stages: true
        }
      });
    }

    return this.prisma.pipeline.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color,
      }
    });
  }

  async remove(id: string) {
    // Prisma delete cascade usually needs to be set in schema, but we can do it manually here for safety.
    await this.prisma.pipelineStage.deleteMany({
      where: { pipelineId: id }
    });
    
    return this.prisma.pipeline.delete({
      where: { id }
    });
  }
}
