import { Module } from '@nestjs/common';
import { HospitalizationService } from './hospitalization.service';
import { HospitalizationController } from './hospitalization.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HospitalizationController],
  providers: [HospitalizationService],
  exports: [HospitalizationService],
})
export class HospitalizationModule {}
