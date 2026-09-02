"use client";
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Type, Hash, Calendar, Clock, 
  List, LayoutTemplate, Rows, Eye, Save,
  Search, Move, Trash2, Copy, AlignLeft,
  AlignCenter, AlignRight, FileSignature, Settings, Plus
} from 'lucide-react';
import Link from 'next/link';

export default function TemplateEditorPage() {
  const [activeTab, setActiveTab] = useState<'campo' | 'pagina'>('campo');

  const tools = [
    { name: 'Nova Linha', desc: 'Título de seção', icon: Rows, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Contêiner', desc: 'Agrupa campos em um bloco', icon: LayoutTemplate, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Texto', desc: 'Curto ou longo', icon: Type, color: 'text-slate-600', bg: 'bg-slate-100' },
    { name: 'Número', desc: 'Campo numérico', icon: Hash, color: 'text-slate-600', bg: 'bg-slate-100' },
    { name: 'Data', desc: 'Seletor de data', icon: Calendar, color: 'text-slate-600', bg: 'bg-slate-100' },
    { name: 'Data e Hora', desc: 'Data + hora', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
    { name: 'Lista Suspensa', desc: 'Seleção única', icon: List, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-8">
      {/* Topbar */}
      <div className="h-16 border-b bg-slate-900 text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/settings/templates">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700 flex items-center gap-2 text-sm font-bold min-w-[300px]">
              TERMO DE AUTORIZAÇÃO E RESPONSABIL...
            </div>
            <select className="bg-slate-800 border-none text-sm text-slate-300 rounded-lg px-3 py-2 outline-none">
              <option>Termos</option>
              <option>Receitas</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
             <Settings className="w-5 h-5" />
          </Button>
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          <Link href="/settings/templates/1/preview">
            <Button variant="outline" className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-slate-50">
        {/* Left Sidebar - Tools */}
        <div className="w-72 bg-white border-r flex flex-col shrink-0">
          <div className="p-4 border-b">
            <h2 className="font-bold text-slate-800 mb-1">Campos Disponíveis</h2>
            <p className="text-xs text-slate-500 mb-4">Clique ou arraste para adicionar ao formulário</p>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Buscar campo..." 
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {tools.map((tool, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 cursor-grab transition-all"
                draggable
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tool.bg} ${tool.color}`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700">{tool.name}</h3>
                  <p className="text-xs text-slate-500">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100/50">
          <div className="w-full max-w-[800px]">
            {/* Top Config */}
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-4 mb-6 shadow-sm">
              <Input 
                type="text" 
                placeholder="Descrição do formulário (opcional)"
                className="w-full text-slate-500 text-sm focus:outline-none bg-transparent"
              />
            </div>
            
            <div className="flex justify-center mb-6 text-sm font-bold text-indigo-600 bg-indigo-50 py-2 rounded-lg border border-dashed border-indigo-200 cursor-pointer hover:bg-indigo-100 transition-colors">
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Organizar em páginas
            </div>

            {/* A4 Sheet */}
            <div className="bg-white shadow-md border border-slate-200 min-h-[1000px] w-full mx-auto relative p-12">
              
              {/* Header Container Block */}
              <div className="mb-8 border border-dashed border-blue-200 p-1 group hover:border-blue-400 relative">
                
                <div className="absolute -top-4 -left-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <Move className="w-3 h-3" /> CONTÊINER
                </div>

                <div className="text-2xl font-black text-blue-700 uppercase mb-6 tracking-wide border-b-2 border-blue-100 pb-4">
                  Termo de Autorização e Responsabilidade Para Internação Veterinária
                </div>

                <div className="grid grid-cols-12 gap-4">
                  {/* Logo Block */}
                  <div className="col-span-4 border border-blue-100 bg-blue-50/20 rounded-lg p-3 relative group/block cursor-pointer hover:ring-2 hover:ring-blue-400">
                    <div className="flex justify-between items-center text-xs font-bold text-blue-400 mb-2">
                      <span>#smallLogo</span>
                      <div className="flex gap-2">
                        <AlignLeft className="w-3 h-3" />
                        <Copy className="w-3 h-3" />
                        <Trash2 className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="h-16 bg-slate-100 flex items-center justify-center text-slate-400 text-sm rounded border border-dashed border-slate-300">
                      LOGO EMPRESA
                    </div>
                  </div>

                  {/* Company Info Block */}
                  <div className="col-span-4 border border-blue-100 bg-blue-50/20 rounded-lg p-3 relative group/block cursor-pointer hover:ring-2 hover:ring-blue-400">
                    <div className="flex justify-between items-center text-xs font-bold text-blue-400 mb-2">
                      <span>Empresa</span>
                      <div className="flex gap-2">
                        <AlignLeft className="w-3 h-3" />
                        <Copy className="w-3 h-3" />
                        <Trash2 className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="text-sm font-mono text-slate-500 leading-relaxed bg-white p-2 border border-slate-100 rounded">
                      #fantasia<br/>
                      CNPJ #cnpj<br/>
                      #enderecoEmpresa<br/>
                      #bairroEmpresa, #cidadeEmpresa - #ufEmpresa
                    </div>
                  </div>

                  {/* Phone Block */}
                  <div className="col-span-4 border border-blue-100 bg-blue-50/20 rounded-lg p-3 relative group/block cursor-pointer hover:ring-2 hover:ring-blue-400">
                     <div className="flex justify-between items-center text-xs font-bold text-blue-400 mb-2">
                      <span>Telefone</span>
                      <div className="flex gap-2">
                        <AlignLeft className="w-3 h-3" />
                        <Copy className="w-3 h-3" />
                        <Trash2 className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="text-sm font-mono text-slate-500 bg-white p-2 border border-slate-100 rounded h-[76px]">
                      #telefoneEmpresa
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Block - Selected */}
              <div className="bg-blue-600 text-white p-4 rounded-lg flex justify-between items-center relative mb-6 shadow-md ring-2 ring-blue-300 ring-offset-2">
                <div className="flex items-center gap-3">
                  <Move className="w-5 h-5 opacity-50 cursor-move" />
                  <span className="font-bold">H</span>
                  <span className="text-sm">Nova Linha (Divisor)</span>
                </div>
                <div className="flex gap-3">
                  <Copy className="w-4 h-4 cursor-pointer hover:text-blue-200" />
                  <Trash2 className="w-4 h-4 cursor-pointer hover:text-rose-300" />
                </div>
              </div>

              {/* Data Grid Container */}
              <div className="border border-dashed border-slate-300 p-1 mb-8 hover:border-slate-400 transition-colors relative group">
                <div className="absolute -top-4 -left-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  CONTÊINER
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Tutor Block */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:border-indigo-300 cursor-pointer">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dados do Responsável</p>
                    <div className="space-y-1 font-mono text-sm text-slate-600">
                      <p>Nome: #nomeTutor</p>
                      <p>CPF: #cpfTutor</p>
                      <p>Endereço: #enderecoTutor</p>
                    </div>
                  </div>
                  {/* Animal Block */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:border-indigo-300 cursor-pointer">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dados do Animal</p>
                    <div className="space-y-1 font-mono text-sm text-slate-600">
                      <p>Nome: #nomePaciente</p>
                      <p>Espécie: #especie / Raça: #raca</p>
                      <p>Peso: #peso kg / Idade: #idade</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drag handle dropzone */}
              <div className="h-24 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-sm">
                Arraste os campos aqui
              </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l shrink-0 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-bold text-slate-800 mb-1">Propriedades</h2>
            <p className="text-xs text-slate-500">Configure o campo ou a página</p>
          </div>
          
          <div className="flex border-b">
            <Button 
              className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'campo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('campo')}
            >
              Campo
            </Button>
            <Button 
              className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'pagina' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('pagina')}
            >
              Página
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'campo' ? (
              <>
                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-medium border border-blue-100 flex gap-3">
                  <Rows className="w-5 h-5 shrink-0" />
                  Editando propriedades da <strong>Nova Linha (Divisor)</strong>.
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Título da Linha</label>
                    <Input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" value="H" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Cor de Fundo</label>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-blue-600 cursor-pointer ring-2 ring-offset-1 ring-blue-600"></div>
                      <div className="w-8 h-8 rounded bg-slate-800 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded bg-rose-600 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded bg-emerald-600 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-400">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Margem Superior (px)</label>
                    <Input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" value="24" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Margem Inferior (px)</label>
                    <Input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" value="24" />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                Configurações gerais da página, margens, tamanho do papel, e numeração.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
