import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  createPatient(@Req() req: any, @Body() dto: CreatePatientDto) {
    return this.patientsService.createPatient(req.user.organizationId, dto);
  }

  @Get()
  getPatients(@Req() req: any) {
    return this.patientsService.getPatients(req.user.organizationId);
  }

  @Get(':id')
  getPatient(@Req() req: any, @Param('id') id: string) {
    return this.patientsService.getPatient(req.user.organizationId, id);
  }

  @Patch(':id')
  updatePatient(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.patientsService.updatePatient(req.user.organizationId, id, data);
  }

  @Post(':id/vaccines')
  addVaccine(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.patientsService.addVaccine(req.user.organizationId, id, data);
  }

  @Post(':id/alerts')
  addAlert(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.patientsService.addAlert(req.user.organizationId, id, data);
  }
}
