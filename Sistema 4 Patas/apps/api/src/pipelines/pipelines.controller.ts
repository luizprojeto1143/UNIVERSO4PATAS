import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';

@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Post()
  create(@Request() req: any, @Body() createPipelineDto: any) {
    const orgId = req.user.organizationId;
    return this.pipelinesService.create(orgId, createPipelineDto);
  }

  @Get()
  findAll(@Request() req: any) {
    const orgId = req.user.organizationId;
    return this.pipelinesService.findAll(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pipelinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePipelineDto: any) {
    return this.pipelinesService.update(id, updatePipelineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pipelinesService.remove(id);
  }
}
