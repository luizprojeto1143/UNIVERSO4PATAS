import { Module } from '@nestjs/common';
import { TutorAuthController } from './tutor-auth.controller';
import { TutorAuthService } from './tutor-auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '7d' }, // Sessão longa para o app
    }),
  ],
  controllers: [TutorAuthController],
  providers: [TutorAuthService],
})
export class TutorAuthModule {}
