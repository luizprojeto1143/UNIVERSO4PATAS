import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  AppointmentsService,
  CreateAppointmentDto,
} from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  getAppointments(@Req() req: any) {
    return this.appointmentsService.getAppointments(req.user.organizationId);
  }

  @Post()
  createAppointment(@Req() req: any, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(
      req.user.organizationId,
      dto,
    );
  }

  @Patch(':id')
  updateAppointment(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    // Para atualizar data e veterinário (Drag and Drop)
    const updateData: any = {};
    if (body.date) updateData.date = new Date(body.date);
    if (body.veterinarianId) updateData.veterinarianId = body.veterinarianId;
    if (body.status) updateData.status = body.status;
    
    return this.appointmentsService.updateAppointment(
      req.user.organizationId,
      id,
      updateData,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.appointmentsService.updateStatus(
      req.user.organizationId,
      id,
      status,
    );
  }

  @Patch(':id/reminder')
  toggleReminder(@Req() req: any, @Param('id') id: string) {
    return this.appointmentsService.toggleReminder(req.user.organizationId, id);
  }
}
