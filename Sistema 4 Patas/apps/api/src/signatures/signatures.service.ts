import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SignaturesService {
  constructor(private prisma: PrismaService) {}

  async createDocument(organizationId: string, data: any) {
    return this.prisma.signatureDocument.create({
      data: {
        organizationId,
        patientId: data.patientId,
        tutorId: data.tutorId,
        clinicalRecordId: data.clinicalRecordId,
        title: data.title,
        content: data.content,
        status: 'PENDING',
        magicToken: uuidv4(),
      },
    });
  }

  async getDocumentsByOrganization(organizationId: string) {
    return this.prisma.signatureDocument.findMany({
      where: { organizationId },
      include: {
        patient: true,
        tutor: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Public endpoint for Tutor App
  async getDocumentByToken(token: string) {
    const doc = await this.prisma.signatureDocument.findUnique({
      where: { magicToken: token },
      include: {
        organization: { select: { name: true } },
        patient: {
          select: { name: true, species: { select: { name: true } } },
        },
        tutor: { select: { name: true, cpf: true } },
      },
    });

    if (!doc) {
      throw new NotFoundException('Documento não encontrado ou token inválido');
    }

    return doc;
  }

  // Public endpoint for Tutor App to sign
  async signDocument(token: string, signatureData: string, ipAddress: string) {
    const doc = await this.prisma.signatureDocument.findUnique({
      where: { magicToken: token },
    });

    if (!doc) throw new NotFoundException('Documento não encontrado');
    if (doc.status === 'SIGNED')
      throw new BadRequestException('Este documento já foi assinado');

    return this.prisma.signatureDocument.update({
      where: { id: doc.id },
      data: {
        status: 'SIGNED',
        signatureData,
        signedAt: new Date(),
        ipAddress,
      },
    });
  }
}
