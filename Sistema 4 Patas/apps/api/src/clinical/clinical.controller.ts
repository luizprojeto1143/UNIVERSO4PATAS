import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import {
  ClinicalService,
  CreateTimelineEventDto,
  CreateClinicalRecordDto,
  CreateVaccineDto,
  AddInvoiceItemDto,
  CreatePrescriptionDto,
  CreateAnamnesisDto,
  CreatePhysicalExamDto,
} from './clinical.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('clinical')
export class ClinicalController {
  constructor(private readonly clinicalService: ClinicalService) {}

  @Get('patient/:id/timeline')
  getPatientTimeline(@Req() req: any, @Param('id') patientId: string) {
    return this.clinicalService.getPatientTimeline(
      req.user.organizationId,
      patientId,
    );
  }

  @Post('records')
  createRecord(@Req() req: any, @Body() dto: CreateClinicalRecordDto) {
    return this.clinicalService.createClinicalRecord(
      req.user.organizationId,
      req.user.userId || req.user.id,
      dto,
    );
  }

  @Get('records')
  getAllClinicalRecords(@Req() req: any) {
    return this.clinicalService.getAllClinicalRecords(req.user.organizationId);
  }

  @Get('records/:id')
  getClinicalRecordDetails(@Req() req: any, @Param('id') id: string) {
    return this.clinicalService.getClinicalRecordDetails(
      req.user.organizationId,
      id,
    );
  }

  @Patch('records/:id/finish')
  finishRecord(@Req() req: any, @Param('id') id: string) {
    return this.clinicalService.finishClinicalRecord(
      req.user.organizationId,
      id,
    );
  }

  @Post('records/:id/items')
  addItemToRecordInvoice(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AddInvoiceItemDto,
  ) {
    return this.clinicalService.addItemToRecordInvoice(
      req.user.organizationId,
      id,
      dto,
    );
  }

  @Post('transcribe')
  transcribeAudio(@Body() body: { audioData?: string }) {
    return this.clinicalService.transcribeAudioMock(body.audioData);
  }

  @Post(':id/events')
  addEventToTimeline(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: CreateTimelineEventDto,
  ) {
    return this.clinicalService.addEventToTimeline(
      id,
      req.user.userId || req.user.id,
      dto,
    );
  }

  @Post(':id/exams')
  requestExam(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { type: string },
  ) {
    return this.clinicalService.requestExam(
      req.user.organizationId,
      id,
      req.user.userId || req.user.id,
      body.type,
    );
  }

  @Patch('exams/:examId/result')
  simulateExamResult(@Req() req: any, @Param('examId') examId: string) {
    return this.clinicalService.simulateExamResult(
      req.user.organizationId,
      examId,
      req.user.userId || req.user.id,
    );
  }

  @Post(':id/documents')
  generateDocument(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { templateId: string },
  ) {
    return this.clinicalService.generateDocument(
      req.user.organizationId,
      id,
      body.templateId,
    );
  }

  @Post('vaccines')
  createVaccine(@Req() req: any, @Body() dto: CreateVaccineDto) {
    return this.clinicalService.createVaccine(req.user.organizationId, dto);
  }

  @Post('prescription')
  createPrescription(@Req() req: any, @Body() dto: CreatePrescriptionDto) {
    return this.clinicalService.createPrescription(
      req.user.organizationId,
      req.user.userId || req.user.id,
      dto,
    );
  }

  @Post('anamnesis')
  createAnamnesis(@Req() req: any, @Body() dto: CreateAnamnesisDto) {
    return this.clinicalService.createAnamnesis(
      req.user.organizationId,
      req.user.userId || req.user.id,
      dto,
    );
  }

  @Post('exam-physical')
  createPhysicalExam(@Req() req: any, @Body() dto: CreatePhysicalExamDto) {
    return this.clinicalService.createPhysicalExam(
      req.user.organizationId,
      req.user.userId || req.user.id,
      dto,
    );
  }
}
