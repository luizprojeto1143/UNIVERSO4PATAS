import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { TutorPortalService } from './tutor-portal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tutor-portal')
export class TutorPortalController {
  constructor(private readonly tutorPortalService: TutorPortalService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    return this.tutorPortalService.getDashboard(
      req.user.userId || req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('veterinarians')
  async getVeterinarians(@Req() req: any) {
    return this.tutorPortalService.getVeterinarians(req.user.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('appointments')
  async createAppointment(
    @Req() req: any,
    @Body()
    body: {
      patientId: string;
      veterinarianId: string;
      date: string;
      notes?: string;
    },
  ) {
    return this.tutorPortalService.createAppointment(
      req.user.userId || req.user.sub,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('signature/:token')
  async getSignatureDocument(@Req() req: any, @Param('token') token: string) {
    return this.tutorPortalService.getSignatureDocument(
      req.user.userId || req.user.sub,
      token,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('signature/:token/sign')
  async signDocument(
    @Req() req: any,
    @Param('token') token: string,
    @Body() body: { ipAddress: string },
  ) {
    return this.tutorPortalService.signDocument(
      req.user.userId || req.user.sub,
      token,
      body.ipAddress,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('patients')
  async createPatient(@Req() req: any, @Body() body: any) {
    return this.tutorPortalService.createPatient(
      req.user.userId || req.user.sub,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('species')
  async getSpecies(@Req() req: any) {
    return this.tutorPortalService.getSpecies(req.user.userId || req.user.sub);
  }
}
