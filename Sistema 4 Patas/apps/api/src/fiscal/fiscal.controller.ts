import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { FiscalService } from './fiscal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('manage_fiscal')
@Controller('fiscal')
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Get('settings')
  getSettings(@Req() req: any) {
    return this.fiscalService.getSettings(req.user.organizationId);
  }

  @Patch('settings')
  updateSettings(@Req() req: any, @Body() data: any) {
    return this.fiscalService.updateSettings(req.user.organizationId, data);
  }

  @Get('notes')
  getNotes(@Req() req: any) {
    return this.fiscalService.getNotes(req.user.organizationId);
  }

  @Post('emit/:invoiceId')
  emitNote(@Req() req: any, @Param('invoiceId') invoiceId: string) {
    return this.fiscalService.emitNoteForInvoice(
      req.user.organizationId,
      invoiceId,
    );
  }
}
