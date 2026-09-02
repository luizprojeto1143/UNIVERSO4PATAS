import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('manage_users')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getRoles(@Req() req: any) {
    return this.rolesService.getRoles(req.user.organizationId);
  }

  @Get('permissions')
  getAllPermissions() {
    return this.rolesService.getAllPermissions();
  }

  @Post('permissions')
  createPermission(@Body() data: { action: string; description: string }) {
    return this.rolesService.createCustomPermission(data);
  }

  @Get('users')
  getUsersWithPermissions(@Req() req: any) {
    return this.rolesService.getUsersWithPermissions(req.user.organizationId);
  }

  @Put('users/:userId/roles')
  updateUserRoles(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body() data: { roleIds: string[] },
  ) {
    return this.rolesService.updateUserRoles(
      userId,
      req.user.organizationId,
      data.roleIds,
    );
  }

  @Put('users/:userId/permissions')
  updateUserPermissions(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body() data: { permissions: string[] },
  ) {
    return this.rolesService.updateUserPermissions(
      userId,
      req.user.organizationId,
      data.permissions,
    );
  }

  @Post()
  createRole(
    @Req() req: any,
    @Body() data: { name: string; description?: string; permissions: string[] },
  ) {
    return this.rolesService.createRole(req.user.organizationId, data);
  }

  @Put(':id/permissions')
  updatePermissions(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: { permissions: string[] },
  ) {
    return this.rolesService.updateRolePermissions(
      id,
      req.user.organizationId,
      data.permissions,
    );
  }
}
