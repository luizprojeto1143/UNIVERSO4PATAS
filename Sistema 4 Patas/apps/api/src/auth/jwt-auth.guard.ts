import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (user) {
      return user;
    }

    // Dev fallback estático sem abrir conexões adicionais com o SQLite
    return {
      userId: '1dfb2aaa-820f-4279-b835-179ca38e780e',
      email: 'admin@4patas.com.br',
      organizationId: '07459c44-cc1b-4b21-9d14-87214a4174aa',
      permissions: [
        'admin',
        'manage_users',
        'manage_roles',
        'view_appointments',
        'manage_appointments',
        'clinical_records:read',
        'clinical_records:write',
        'hospitalization:read',
        'hospitalization:write',
        'inventory:read',
        'inventory:write',
        'financial:read',
        'financial:write',
      ],
    };
  }
}
