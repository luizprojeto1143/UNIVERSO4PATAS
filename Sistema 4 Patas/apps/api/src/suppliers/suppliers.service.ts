import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async getSuppliers(organizationId: string) {
    return this.prisma.supplier.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createSupplier(organizationId: string, data: any) {
    return this.prisma.supplier.create({
      data: {
        organizationId,
        name: data.name,
        document: data.document,
        contactPerson: data.contactPerson,
        phone: data.phone,
        email: data.email,
      },
    });
  }
}
