import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DocumentsService, CreateTemplateDto } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('templates')
  getTemplates(@Req() req: any) {
    return this.documentsService.getTemplates(req.user.organizationId);
  }

  @Post('templates')
  createTemplate(@Req() req: any, @Body() dto: CreateTemplateDto) {
    return this.documentsService.createTemplate(req.user.organizationId, dto);
  }
}
