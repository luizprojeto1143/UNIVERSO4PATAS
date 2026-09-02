import { Module } from '@nestjs/common';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TutorsController],
  providers: [TutorsService],
})
export class TutorsModule {}
