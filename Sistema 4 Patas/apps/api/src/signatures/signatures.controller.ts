import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  // Criar documento a ser assinado (Requer Auth)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  createDocument(@Req() req: any, @Body() data: any) {
    return this.signaturesService.createDocument(req.user.organizationId, data);
  }

  // Listar documentos (Requer Auth)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  getDocuments(@Req() req: any) {
    return this.signaturesService.getDocumentsByOrganization(
      req.user.organizationId,
    );
  }

  // --- PUBLIC ENDPOINTS PARA O APP DO TUTOR ---

  // O Tutor acessa o documento através do Token Mágico (Sem Auth)
  @Get('public/:token')
  getPublicDocument(@Param('token') token: string) {
    return this.signaturesService.getDocumentByToken(token);
  }

  // O Tutor envia a assinatura
  @Patch('public/:token/sign')
  signPublicDocument(
    @Param('token') token: string,
    @Body() body: { signatureData: string },
    @Req() req: any,
  ) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '0.0.0.0';
    return this.signaturesService.signDocument(
      token,
      body.signatureData,
      ipAddress as string,
    );
  }
}
