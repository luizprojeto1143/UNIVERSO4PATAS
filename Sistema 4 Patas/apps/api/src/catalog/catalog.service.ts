import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateItemDto {
  name: string;
  description?: string;
  basePrice: number;
  products?: { productId: string; quantity: number }[];
}

export class CreateProductDto {
  sku?: string;
  barcode?: string;
  isSupply?: boolean;
  name: string;
  shortDescription?: string;
  sector?: string;
  group?: string;
  type?: string;
  unit?: string;
  costPrice?: number;
  previousCost?: number;
  basePrice: number;
  margin?: number;
  defaultWarehouse?: string;
  weight?: number;
  minStock?: number;
  maxStock?: number;
  validityDays?: number;
  webDescription?: string;
  labelMessage?: string;
  imageUrl?: string;
  stock?: number;

  isActive?: boolean;
  receivesNotification?: boolean;
  controlsBatchAndValidity?: boolean;
  specialControl?: boolean;
  allowsNegativeStock?: boolean;
  requiresDoubleCheck?: boolean;
  requiresPhotoOnCount?: boolean;
  allowsFractionalCount?: boolean;

  icms?: number;
  icmsReduction?: number;
  ipi?: number;
  ipiReturn?: number;
  pis?: number;
  cofins?: number;
  cstCsosn?: string;
  cfopInsideState?: string;
  cfopOutsideState?: string;
  icmsSt?: number;
  ncm?: string;
  mva?: number;
  taxSubstitution?: boolean;
  ncmDescription?: string;
}

export class CreateComboDto {
  name: string;
  description?: string;
  price: number;
  productPercentage: number;
  servicePercentage: number;
  services?: { serviceId: string; quantity: number }[];
  products?: { productId: string; quantity: number }[];
}

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getServices(organizationId: string) {
    return this.prisma.service.findMany({
      where: { organizationId, isActive: true },
      include: {
        serviceProducts: {
          include: { product: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createService(organizationId: string, dto: CreateItemDto) {
    let calculatedCost = 0;

    // Calculate cost based on products
    if (dto.products && dto.products.length > 0) {
      for (const item of dto.products) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (product && product.costPrice) {
          calculatedCost += product.costPrice * item.quantity;
        }
      }
    }

    return this.prisma.service.create({
      data: {
        organizationId,
        name: dto.name,
        description: dto.description,
        basePrice: dto.basePrice,
        costPrice: calculatedCost,
        serviceProducts: dto.products
          ? {
              create: dto.products.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
              })),
            }
          : undefined,
      },
      include: {
        serviceProducts: {
          include: { product: true },
        },
      },
    });
  }

  async getProducts(organizationId: string) {
    return this.prisma.product.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createProduct(organizationId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        organizationId,
        ...dto,
      },
    });
  }

  async createProductsBulk(organizationId: string, dtos: CreateProductDto[]) {
    // using createMany for bulk performance
    const data = dtos.map((dto) => ({
      organizationId,
      ...dto,
    }));
    return this.prisma.product.createMany({
      data,
    });
  }

  async getCombos(organizationId: string) {
    return this.prisma.combo.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: 'asc' },
      include: {
        services: {
          include: { service: true },
        },
        products: {
          include: { product: true },
        },
      },
    });
  }

  async createCombo(organizationId: string, dto: CreateComboDto) {
    return this.prisma.combo.create({
      data: {
        organizationId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        productPercentage: dto.productPercentage,
        servicePercentage: dto.servicePercentage,
        services: dto.services
          ? {
              create: dto.services.map((s) => ({
                serviceId: s.serviceId,
                quantity: s.quantity,
              })),
            }
          : undefined,
        products: dto.products
          ? {
              create: dto.products.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
              })),
            }
          : undefined,
      },
    });
  }
}
