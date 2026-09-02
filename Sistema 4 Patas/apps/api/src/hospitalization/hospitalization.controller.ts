import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HospitalizationService } from './hospitalization.service';
import { CreateBedDto, UpdateBedDto } from './dto/create-bed.dto';
import { AdmitPatientDto, DischargePatientDto } from './dto/admit-patient.dto';
import { CreateHospitalPrescriptionDto } from './dto/create-prescription.dto';
import { AdministerPrescriptionDto } from './dto/administer-prescription.dto';
import { CreateShiftHandoverDto } from './dto/create-shift-handover.dto';

@UseGuards(JwtAuthGuard)
@Controller('hospitalization')
export class HospitalizationController {
  constructor(private readonly hospitalizationService: HospitalizationService) {}

  // --- LEITOS ---
  @Post('beds')
  createBed(@Request() req: any, @Body() dto: CreateBedDto) {
    return this.hospitalizationService.createBed(req.user.organizationId, dto);
  }

  @Get('beds')
  findAllBeds(@Request() req: any) {
    return this.hospitalizationService.findAllBeds(req.user.organizationId);
  }

  @Put('beds/:id')
  updateBed(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateBedDto) {
    return this.hospitalizationService.updateBed(id, req.user.organizationId, dto);
  }

  // --- INTERNAÇÕES ---
  @Post('admit')
  admitPatient(@Request() req: any, @Body() dto: AdmitPatientDto) {
    return this.hospitalizationService.admitPatient(req.user.organizationId, dto);
  }

  @Get()
  findAllHospitalizations(@Request() req: any, @Query('status') status?: string) {
    return this.hospitalizationService.findAllHospitalizations(req.user.organizationId, status);
  }

  @Get('shift-handovers')
  getShiftHandovers(@Request() req: any, @Query('hospitalizationId') hospitalizationId?: string) {
    return this.hospitalizationService.getShiftHandovers(req.user.organizationId, hospitalizationId);
  }

  @Get(':id')
  findHospitalizationById(@Request() req: any, @Param('id') id: string) {
    return this.hospitalizationService.findHospitalizationById(id, req.user.organizationId);
  }

  @Post(':id/discharge')
  dischargePatient(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: DischargePatientDto,
  ) {
    return this.hospitalizationService.dischargePatient(id, req.user.organizationId, dto);
  }

  // --- PRESCRIÇÃO E APRAZAMENTO ---
  @Post('prescriptions')
  createPrescription(@Request() req: any, @Body() dto: CreateHospitalPrescriptionDto) {
    return this.hospitalizationService.createPrescription(req.user.organizationId, dto);
  }

  @Post('administrations/:id')
  administerPrescription(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AdministerPrescriptionDto,
  ) {
    return this.hospitalizationService.administerPrescription(id, req.user.userId, dto);
  }

  // --- PASSAGEM DE PLANTÃO ---
  @Post('shift-handovers')
  createShiftHandover(@Request() req: any, @Body() dto: CreateShiftHandoverDto) {
    return this.hospitalizationService.createShiftHandover(req.user.organizationId, req.user.userId, dto);
  }
}
