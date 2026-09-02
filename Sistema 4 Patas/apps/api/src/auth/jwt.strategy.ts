import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-temp-key-for-dev',
    });
  }

  async validate(payload: any) {
    // Esse objeto será injetado em request.user pelas rotas protegidas
    return {
      userId: payload.sub,
      email: payload.email,
      organizationId: payload.organizationId,
      permissions: payload.permissions || [],
    };
  }
}
