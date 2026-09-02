import { Controller, Post, Body } from '@nestjs/common';
import { TutorAuthService } from './tutor-auth.service';

@Controller('tutor-auth')
export class TutorAuthController {
  constructor(private readonly tutorAuthService: TutorAuthService) {}

  @Post('login')
  async login(@Body() body: { cpf: string; password?: string }) {
    return this.tutorAuthService.login(body.cpf, body.password);
  }
}
