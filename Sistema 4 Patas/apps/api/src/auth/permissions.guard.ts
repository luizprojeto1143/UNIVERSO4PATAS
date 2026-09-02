import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.permissions) {
      throw new ForbiddenException(
        'Usuário sem permissões registradas no token',
      );
    }

    // Superadmin / Admin bypass - Administrador da clínica tem acesso total
    if (
      user.permissions.includes('admin') ||
      user.permissions.includes('superadmin') ||
      user.permissions.includes('*')
    ) {
      return true;
    }

    // Verifica se possui pelo menos uma das permissões exigidas
    const hasPermission = requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Acesso negado. Requer uma destas permissões: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
