import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(organizationId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. Faturamento Mensal (faturas pagas no mês)
    const invoices = await this.prisma.invoice.findMany({
      where: {
        organizationId,
        status: 'paid',
        updatedAt: { gte: firstDayOfMonth },
      },
    });
    const totalRevenue = invoices.reduce(
      (acc, inv) => acc + inv.totalAmount,
      0,
    );

    // 2. Agendamentos de Hoje (todos)
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);

    const todayAppointments = await this.prisma.appointment.findMany({
      where: {
        organizationId,
        date: { gte: today, lt: nextDay },
      },
      include: {
        patient: { include: { tutor: true, species: true } },
        veterinarian: true,
      },
      orderBy: { date: 'asc' },
    });

    const activeAppointments = todayAppointments.filter(
      (a) => a.status === 'scheduled',
    ).length;

    // 3. Novos Pacientes no mês
    const newPatients = await this.prisma.patient.count({
      where: {
        organizationId,
        createdAt: { gte: firstDayOfMonth },
      },
    });

    // 4. Chart Data: Últimos 7 dias de agendamentos
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayApps = await this.prisma.appointment.findMany({
        where: {
          organizationId,
          date: { gte: d, lt: nextD },
        },
      });

      chartData.push({
        date: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
        agendados: dayApps.filter((a) => a.status === 'scheduled').length,
        concluidos: dayApps.filter((a) => a.status === 'completed').length,
        cancelados: dayApps.filter((a) => a.status === 'canceled').length,
      });
    }

    return {
      kpis: {
        monthlyRevenue: totalRevenue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        activeAppointments: activeAppointments,
        newPatientsMonth: newPatients,
      },
      chartData,
      appointments: todayAppointments.map((record) => ({
        id: record.id,
        time: record.date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        tutor: record.patient.tutor.name,
        patient: `${record.patient.name} (${record.patient.species.name})`,
        type: 'Consulta Rotina',
        status:
          record.status === 'scheduled'
            ? 'Aguardando'
            : record.status === 'completed'
              ? 'Concluído'
              : 'Cancelado',
      })),
    };
  }
}
