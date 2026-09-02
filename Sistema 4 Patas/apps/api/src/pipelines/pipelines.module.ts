import { Module } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { PipelinesController } from './pipelines.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PipelinesController],
  providers: [PipelinesService, PrismaService],
})
export class PipelinesModule {}
