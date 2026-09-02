import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.tutorsService.findAll(req.user.organizationId);
  }

  @Post()
  createTutor(@Req() req: any, @Body() data: any) {
    return this.tutorsService.createTutor(req.user.organizationId, data);
  }

  @Get(':id')
  getTutor(@Req() req: any, @Param('id') id: string) {
    return this.tutorsService.getTutor(req.user.organizationId, id);
  }

  @Patch(':id')
  updateTutor(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.tutorsService.updateTutor(req.user.organizationId, id, data);
  }
}
