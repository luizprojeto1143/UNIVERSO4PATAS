import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('manage_users')
  getUsers(@Request() req: any) {
    return this.usersService.getUsers(req.user.organizationId);
  }

  @Post()
  @RequirePermissions('manage_users')
  createUser(
    @Request() req: any,
    @Body()
    body: {
      email: string;
      password?: string;
      roleId?: string;
      crmv?: string;
      uf?: string;
      specialties?: string;
    },
  ) {
    return this.usersService.createUser(req.user.organizationId, body);
  }
}
