import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SYSTEM_PERMISSIONS = [
  { action: 'admin', description: 'Administrador Mestre - Acesso Total ao Sistema' },
  { action: 'manage_users', description: 'Gerenciar Usuários e Equipe da Clínica' },
  { action: 'manage_roles', description: 'Gerenciar Cargos e Permissões' },
  { action: 'view_appointments', description: 'Visualizar Agenda e Consultas' },
  { action: 'manage_appointments', description: 'Agendar, Editar e Cancelar Consultas' },
  { action: 'clinical_records:read', description: 'Visualizar Prontuário Clínico' },
  { action: 'clinical_records:write', description: 'Criar e Editar Prontuário, Anamnese e Prescrições' },
  { action: 'hospitalization:read', description: 'Visualizar Internação e Mapa de Leitos' },
  { action: 'hospitalization:write', description: 'Admitir Paciente, Prescrever e Checar Doses em UTI' },
  { action: 'inventory:read', description: 'Visualizar Estoque, Lotes e Medicamentos' },
  { action: 'inventory:write', description: 'Lançar Lotes, Movimentações e Livro de Controlados' },
  { action: 'financial:read', description: 'Visualizar Caixa, DRE e Relatórios Financeiros' },
  { action: 'financial:write', description: 'Emitir Cobranças, Recebimentos e Notas Fiscais' },
];

async function main() {
  console.log('--- SEEDING CARGOS, PERMISSÕES E MÉDICOS DA CLÍNICA ---');

  for (const permData of SYSTEM_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { action: permData.action },
      update: { description: permData.description },
      create: permData,
    });
  }

  let org = await prisma.organization.findFirst({
    where: { name: 'Clínica 4 Patas' },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: 'Clínica 4 Patas',
        cnpj: '12.345.678/0001-90',
        environment: 'homologation',
        isActive: true,
      },
    });
  }

  let unit = await prisma.unit.findFirst({
    where: { organizationId: org.id },
  });

  if (!unit) {
    unit = await prisma.unit.create({
      data: {
        organizationId: org.id,
        name: 'Unidade Principal - 4 Patas',
        address: 'Rua Principal, 100',
        isActive: true,
      },
    });
  }

  const defaultRoles = [
    { name: 'Administrador Mestre', description: 'Gestão completa da clínica', permissions: SYSTEM_PERMISSIONS.map(p => p.action) },
    { name: 'Médico Veterinário', description: 'Consultas e prontuários', permissions: ['view_appointments', 'manage_appointments', 'clinical_records:read', 'clinical_records:write', 'hospitalization:read', 'hospitalization:write'] },
    { name: 'Recepcionista', description: 'Atendimento e agendamento', permissions: ['view_appointments', 'manage_appointments', 'financial:read', 'financial:write'] },
  ];

  const roleMap: Record<string, string> = {};
  for (const roleDef of defaultRoles) {
    let role = await prisma.role.findFirst({
      where: { name: roleDef.name, organizationId: org.id },
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          organizationId: org.id,
          name: roleDef.name,
          description: roleDef.description,
        },
      });
    }
    roleMap[roleDef.name] = role.id;
  }

  const passwordHash = await bcrypt.hash('admin123456', 10);

  // 1. Administrador Mestre
  const adminUser = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: org.id, email: 'admin@4patas.com.br' } },
    update: { passwordHash, isActive: true },
    create: {
      organizationId: org.id,
      email: 'admin@4patas.com.br',
      passwordHash,
      isActive: true,
    },
  });

  // 2. Dr. Nogueira
  const drNogueira = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: org.id, email: 'dr.nogueira@4patas.com.br' } },
    update: { passwordHash, isActive: true },
    create: {
      organizationId: org.id,
      email: 'dr.nogueira@4patas.com.br',
      passwordHash,
      isActive: true,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: drNogueira.id },
    update: { crmv: 'CRMV-SP 45120', uf: 'SP', specialties: 'Clínica Geral, Cirurgia Veterinária' },
    create: { userId: drNogueira.id, crmv: 'CRMV-SP 45120', uf: 'SP', specialties: 'Clínica Geral, Cirurgia Veterinária' },
  });

  // 3. Dra. Jéssica
  const draJessica = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: org.id, email: 'dra.jessica@4patas.com.br' } },
    update: { passwordHash, isActive: true },
    create: {
      organizationId: org.id,
      email: 'dra.jessica@4patas.com.br',
      passwordHash,
      isActive: true,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: draJessica.id },
    update: { crmv: 'CRMV-SP 52180', uf: 'SP', specialties: 'Dermatologia, Pediatria Vet' },
    create: { userId: draJessica.id, crmv: 'CRMV-SP 52180', uf: 'SP', specialties: 'Dermatologia, Pediatria Vet' },
  });

  console.log('✓ Dr. Nogueira e Dra. Jéssica cadastrados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
