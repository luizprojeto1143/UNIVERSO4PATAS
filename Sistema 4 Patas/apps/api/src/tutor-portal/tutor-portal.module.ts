import { Module } from '@nestjs/common';
import { TutorPortalService } from './tutor-portal.service';
import { TutorPortalController } from './tutor-portal.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TutorPortalService],
  controllers: [TutorPortalController],
})
export class TutorPortalModule {}
