import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('clinic')
  getClinicSettings(@Req() req: any) {
    return this.settingsService.getClinicSettings(req.user.organizationId);
  }

  @Patch('clinic')
  updateClinicSettings(@Req() req: any, @Body() body: any) {
    return this.settingsService.updateClinicSettings(
      req.user.organizationId,
      body,
    );
  }
}
