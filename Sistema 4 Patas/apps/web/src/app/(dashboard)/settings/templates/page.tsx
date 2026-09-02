'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, Folder, CheckCircle, Plus, 
  Stethoscope, FileSignature, AlertTriangle, 
  Calculator, FlaskConical, ScrollText, 
  Award, LayoutTemplate, PenTool
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentTemplatesDashboard() {
  const categories = [
    { name: 'Avaliação', templates: 11, icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Receitas', templates: 2, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Receita Controlada', templates: 2, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Orçamentos', templates: 3, icon: Calculator, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Exames', templates: 6, icon: FlaskConical, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
    { name: 'Termos', templates: 26, icon: ScrollText, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Certificados', templates: 0, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { name: 'Outros', templates: 0, icon: LayoutTemplate, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Rascunhos', templates: 4, icon: PenTool, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Modelos de Documentos</h1>
          <p className="text-slate-500">Gerencie suas categorias e modelos de atestados, termos e receitas</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-6 border-slate-200">
            <Folder className="w-4 h-4 mr-2 text-slate-500" />
            Modelos Antigos
          </Button>
          <Link href="/settings/templates/new/edit">
            <Button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200">
              <Plus className="w-4 h-4 mr-2" />
              Novo Modelo
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total</p>
              <p className="text-3xl font-black text-slate-900">50</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
              <Folder className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Categorias</p>
              <p className="text-3xl font-black text-slate-900">8</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ativos</p>
              <p className="text-3xl font-black text-slate-900">5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-6">
          <Folder className="w-4 h-4" />
          Categorias
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="group border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer overflow-hidden">
              <CardContent className="p-6 flex items-start gap-4 relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.bg} ${category.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{category.templates} modelos</p>
                  
                  <div className="mt-4 flex items-center text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                    Ver modelos &rarr;
                  </div>
                </div>
                
                {/* Visual Indicator of count */}
                {category.templates > 0 && (
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400">
                    {category.templates}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
