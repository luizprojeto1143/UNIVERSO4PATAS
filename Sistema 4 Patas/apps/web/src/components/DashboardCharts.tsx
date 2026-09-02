"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DashboardCharts({ chartData }: { chartData: any[] }) {
  // inverter para mostrar de cronologicamente (do mais antigo pro mais recente)
  const data = [...chartData].reverse();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8 mb-8 hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Fluxo de Atendimentos (Últimos 7 dias)</h2>
        <p className="text-sm text-gray-500">Acompanhamento de volume na clínica</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: '#F3F4F6'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="concluidos" name="Concluídos" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
            <Bar dataKey="agendados" name="Agendados" stackId="a" fill="#3B82F6" />
            <Bar dataKey="cancelados" name="Cancelados" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
