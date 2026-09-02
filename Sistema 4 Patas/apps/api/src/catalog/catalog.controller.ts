import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import {
  CatalogService,
  CreateItemDto,
  CreateProductDto,
  CreateComboDto,
} from './catalog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('services')
  getServices(@Req() req: any) {
    return this.catalogService.getServices(req.user.organizationId);
  }

  @Post('services')
  createService(@Req() req: any, @Body() dto: CreateItemDto) {
    return this.catalogService.createService(req.user.organizationId, dto);
  }

  @Post('services/import')
  importServices(@Req() req: any) {
    // Simulated AI extraction from PDF/Excel
    return [
      {
        name: 'Consulta Especialista - Simulação IA',
        basePrice: 250,
        description: 'Extraído do PDF',
      },
      {
        name: 'Hemograma Completo - Simulação IA',
        basePrice: 80,
        description: 'Extraído do PDF',
      },
      {
        name: 'Vacina V10 Importada - Simulação IA',
        basePrice: 150,
        description: 'Extraído do PDF',
      },
    ];
  }

  @Get('products')
  getProducts(@Req() req: any) {
    return this.catalogService.getProducts(req.user.organizationId);
  }

  @Post('products')
  createProduct(@Req() req: any, @Body() dto: CreateProductDto) {
    return this.catalogService.createProduct(req.user.organizationId, dto);
  }

  @Post('products/bulk')
  createProductsBulk(@Req() req: any, @Body() dtos: CreateProductDto[]) {
    return this.catalogService.createProductsBulk(
      req.user.organizationId,
      dtos,
    );
  }

  @Post('products/import')
  importProducts(@Req() req: any) {
    // Simulated AI extraction from PDF/Excel
    return [
      {
        name: 'Ração Premier Cães Adultos 15kg - IA',
        costPrice: 150,
        basePrice: 220,
        stock: 10,
      },
      {
        name: 'Bravecto 10-20kg - IA',
        costPrice: 120,
        basePrice: 180,
        stock: 5,
      },
      {
        name: 'Seringa 3ml - IA',
        costPrice: 0.5,
        basePrice: 2,
        stock: 500,
        isSupply: true,
      },
      { name: 'Cerenia 16mg - IA', costPrice: 80, basePrice: 140, stock: 8 },
    ];
  }

  @Get('combos')
  getCombos(@Req() req: any) {
    return this.catalogService.getCombos(req.user.organizationId);
  }

  @Post('combos')
  createCombo(@Req() req: any, @Body() dto: CreateComboDto) {
    return this.catalogService.createCombo(req.user.organizationId, dto);
  }
}
