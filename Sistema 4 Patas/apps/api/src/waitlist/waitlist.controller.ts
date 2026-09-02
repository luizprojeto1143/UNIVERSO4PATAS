import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { WaitlistService, CreateWaitlistDto } from './waitlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Get()
  @RequirePermissions('view_appointments')
  getWaitlist(@Req() req: any) {
    return this.waitlistService.getWaitlist(req.user.organizationId);
  }

  @Post()
  @RequirePermissions('manage_appointments')
  addEntry(@Req() req: any, @Body() body: CreateWaitlistDto) {
    return this.waitlistService.addEntry(req.user.organizationId, body);
  }

  @Patch(':id/status')
  @RequirePermissions('manage_appointments')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.waitlistService.updateStatus(req.user.organizationId, id, status);
  }
}
