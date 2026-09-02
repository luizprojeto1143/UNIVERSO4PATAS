import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  FinancialService,
  CreateInvoiceDto,
  CheckoutPdvDto,
} from './financial.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('manage_financial')
@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get('dashboard')
  getDashboard(@Req() req: any) {
    return this.financialService.getDashboard(req.user.organizationId);
  }

  @Post('invoices')
  createInvoice(@Req() req: any, @Body() dto: CreateInvoiceDto) {
    return this.financialService.createInvoice(req.user.organizationId, dto);
  }

  @Patch('invoices/:id/pay')
  payInvoice(@Req() req: any, @Param('id') invoiceId: string) {
    return this.financialService.payInvoice(req.user.organizationId, invoiceId);
  }

  @Post('pdv/checkout')
  checkoutPdv(@Req() req: any, @Body() dto: CheckoutPdvDto) {
    return this.financialService.checkoutPdv(req.user.organizationId, dto);
  }
}
