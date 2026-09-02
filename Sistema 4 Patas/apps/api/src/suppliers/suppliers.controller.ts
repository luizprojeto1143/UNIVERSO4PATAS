import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  getSuppliers(@Req() req: any) {
    return this.suppliersService.getSuppliers(req.user.organizationId);
  }

  @Post()
  createSupplier(@Req() req: any, @Body() dto: any) {
    return this.suppliersService.createSupplier(req.user.organizationId, dto);
  }
}
