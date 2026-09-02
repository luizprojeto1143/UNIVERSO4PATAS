
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found');
    return;
  }

  const permissionsList = [
    { action: 'manage_financial', description: 'Access to financial dashboard and invoices' },
    { action: 'manage_fiscal', description: 'Access to fiscal dashboard and settings' },
    { action: 'manage_users', description: 'Access to user and role settings' },
    { action: 'manage_inventory', description: 'Access to inventory and suppliers' },
    { action: 'manage_clinical', description: 'Access to patients, clinical records, agenda' }
  ];

  for (const p of permissionsList) {
    await prisma.permission.upsert({
      where: { action: p.action },
      update: {},
      create: p
    });
  }

  let role = await prisma.role.findFirst({ where: { name: 'Admin', organizationId: user.organizationId } });
  if (!role) {
    role = await prisma.role.create({
      data: {
        name: 'Admin',
        description: 'Administrator with full access',
        organizationId: user.organizationId
      }
    });
  }

  const allPerms = await prisma.permission.findMany();
  for (const perm of allPerms) {
    const existing = await prisma.rolePermission.findFirst({
      where: { roleId: role.id, permissionId: perm.id }
    });
    if (!existing) {
      await prisma.rolePermission.create({
        data: { roleId: role.id, permissionId: perm.id }
      });
    }
  }

  const existingUserRole = await prisma.userRole.findFirst({
    where: { userId: user.id, roleId: role.id }
  });

  if (!existingUserRole) {
    await prisma.userRole.create({
      data: { userId: user.id, roleId: role.id }
    });
  }

  console.log('Roles and permissions seeded successfully for user', user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());

