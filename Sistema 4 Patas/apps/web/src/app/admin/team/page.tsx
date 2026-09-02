'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  UserPlus, 
  Search, 
  Shield, 
  ShieldAlert, 
  Check, 
  Edit3, 
  ShieldCheck, 
  Laptop, 
  Users, 
  Stethoscope, 
  DollarSign, 
  Package, 
  CalendarClock,
  Loader2,
  Syringe,
  Activity,
  FileSpreadsheet,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

// Lista completa e categorizada de permissões do sistema
const PERMISSION_CATEGORIES = [
  {
    category: 'Atendimento & Recepção',
    icon: <Users className="w-5 h-5 text-indigo-500" />,
    items: [
      { action: 'view_appointments', label: 'Visualizar Agenda & Fila', desc: 'Permite ver as consultas e a lista de espera do dia' },
      { action: 'manage_appointments', label: 'Agendar & Cancelar Consultas', desc: 'Permite criar, remarcar ou cancelar horários de atendimento' },
      { action: 'tutors:manage', label: 'Cadastrar Tutores & Pets', desc: 'Permite incluir e editar fichas de clientes e animais' },
    ]
  },
  {
    category: 'Atendimento Clínico & Prontuário',
    icon: <Stethoscope className="w-5 h-5 text-rose-500" />,
    items: [
      { action: 'clinical_records:read', label: 'Visualizar Prontuários Médicos', desc: 'Permite ler o histórico clínico dos pacientes' },
      { action: 'clinical_records:write', label: 'Escrever Prontuário, Anamnese & Exames', desc: 'Permite registrar evolução médica, SOAP e solicitar exames' },
      { action: 'prescriptions:write', label: 'Emitir Receitas & Documentos', desc: 'Permite gerar prescrições com assinatura e atestados' },
    ]
  },
  {
    category: 'UTI & Internação Hospitalar',
    icon: <Activity className="w-5 h-5 text-amber-500" />,
    items: [
      { action: 'hospitalization:read', label: 'Visualizar Mapa de Leitos', desc: 'Permite ver os pacientes internados em baias e gaiolas' },
      { action: 'hospitalization:write', label: 'Admitir, Prescrever & Checar Doses', desc: 'Permite dar entrada na UTI, criar aprazamento e checar medicações' },
      { action: 'plantao:manage', label: 'Passagem de Plantão & Check-in', desc: 'Permite registrar resumo de turno e checar pontos de enfermagem' },
    ]
  },
  {
    category: 'Estoque, Lotes & Controlados',
    icon: <Package className="w-5 h-5 text-emerald-500" />,
    items: [
      { action: 'inventory:read', label: 'Consultar Saldo de Estoque', desc: 'Permite consultar a quantidade de produtos e medicamentos' },
      { action: 'inventory:write', label: 'Dar Entrada em Lotes & Livro SIVISA', desc: 'Permite lançar compras, validade e movimentar medicação controlada' },
    ]
  },
  {
    category: 'Financeiro, Vendas & Caixa',
    icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
    items: [
      { action: 'financial:read', label: 'Visualizar Relatórios Financeiros & DRE', desc: 'Permite ver faturamento da clínica, caixa e extrato de comissões' },
      { action: 'financial:write', label: 'Operar Caixa (PDV) & Cobranças', desc: 'Permite fechar vendas na recepção, receber pagamentos e emitir NF' },
    ]
  },
  {
    category: 'Administração & Segurança',
    icon: <ShieldAlert className="w-5 h-5 text-purple-600" />,
    items: [
      { action: 'admin', label: 'Administrador Mestre (Acesso Total)', desc: 'Garante acesso irrestrito a todas as funções da plataforma' },
      { action: 'manage_users', label: 'Gerenciar Equipe & Permissões', desc: 'Permite cadastrar novos funcionários e editar seus acessos' },
    ]
  }
];

export default function CustomPermissionsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showModal, setShowModal] = useState(false);

  // Formulário de novo funcionário
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newCrmv, setNewCrmv] = useState('');
  const [newSpecialties, setNewSpecialties] = useState('');

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      if (Array.isArray(res.data)) {
        setUsers(res.data);
        if (res.data.length > 0) {
          setSelectedUser((current: any) => {
            if (!current) return res.data[0];
            const found = res.data.find((u: any) => u.id === current.id);
            return found || res.data[0];
          });
        }
      }
    } catch (err) {
      console.error('Erro ao buscar lista de usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/users', {
        email: newEmail,
        password: newPassword,
        crmv: newCrmv || undefined,
        specialties: newSpecialties || undefined,
      });

      const createdUser = res.data;

      showToastMsg('Novo funcionário cadastrado com sucesso!');
      setShowModal(false);
      setNewEmail('');
      setNewPassword('123456');
      setNewCrmv('');
      setNewSpecialties('');

      if (createdUser && createdUser.id) {
        setUsers(prev => [createdUser, ...prev.filter(u => u.id !== createdUser.id)]);
        setSelectedUser(createdUser);
      }
      await fetchUsers();
    } catch (err: any) {
      showToastMsg(err.response?.data?.message || 'Erro ao cadastrar funcionário', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePermission = async (permAction: string) => {
    if (!selectedUser || !selectedUser.id) return;

    // Extrair lista atual de permissões do usuário
    const currentActions: string[] = (selectedUser.permissions || []).map(
      (up: any) => (typeof up === 'string' ? up : up.permission?.action || '')
    ).filter(Boolean);

    let updatedActions: string[];
    if (currentActions.includes(permAction)) {
      updatedActions = currentActions.filter(a => a !== permAction);
    } else {
      updatedActions = [...currentActions, permAction];
    }

    // Atualização otimista na tela
    const updatedUser = {
      ...selectedUser,
      permissions: updatedActions.map(action => ({ permission: { action } })),
    };
    setSelectedUser(updatedUser);
    setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));

    // Gravação no Banco de Dados SQLite/Prisma
    try {
      await api.put(`/roles/users/${selectedUser.id}/permissions`, {
        permissions: updatedActions,
      });
      showToastMsg('Permissão atualizada com sucesso!');
    } catch (err) {
      showToastMsg('Erro ao salvar permissão no banco', 'error');
      fetchUsers();
    }
  };

  const hasPermission = (action: string) => {
    if (!selectedUser || !selectedUser.permissions) return false;
    return selectedUser.permissions.some((up: any) => {
      const act = typeof up === 'string' ? up : up.permission?.action;
      return act === action || act === 'admin';
    });
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="pb-12 max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-900 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400" /> Permissões Personalizadas da Equipe
            </h1>
            <p className="text-slate-400 font-medium mt-1">
              Defina individualmente o que cada funcionário da sua clínica pode acessar.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowModal(true)} 
          className="font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl gap-2 px-5 py-2.5 shadow-lg shadow-indigo-900/50"
        >
          <UserPlus className="w-5 h-5" /> Novo Funcionário
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Painel Esquerdo: Lista de Funcionários */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 border border-slate-800 bg-slate-800/80 rounded-3xl flex flex-col">
            <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Equipe ({filteredUsers.length})
            </h2>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input 
                type="text"
                placeholder="Buscar por e-mail..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-8 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" /> Carregando equipe...
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => {
                  const isSelected = selectedUser?.id === user.id;
                  const totalPerms = (user.permissions || []).length;
                  const isAdmin = user.permissions?.some((p: any) => (p.permission?.action || p) === 'admin');

                  return (
                    <div 
                      key={user.id} 
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'border-indigo-500 bg-indigo-950/60 shadow-lg' : 'border-slate-700/70 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm ${isAdmin ? 'bg-rose-600' : 'bg-indigo-600'}`}>
                          {user.email.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm truncate max-w-[180px]" title={user.email}>{user.email}</h3>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">
                            {isAdmin ? <span className="text-rose-400 font-bold">Administrador Mestre</span> : `${totalPerms} permissões ativas`}
                          </p>
                        </div>
                      </div>
                      <Edit3 className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm text-center py-6">Nenhum funcionário encontrado.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Painel Direito: Matriz Personalizada por Funcionário */}
        <div className="lg:col-span-8">
          {selectedUser ? (
            <Card className="border border-slate-800 bg-slate-800 rounded-3xl overflow-hidden p-6 space-y-6">
              
              {/* Header do Usuário Selecionado */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-700/80 gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Configurando permissões individuais de:</span>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2 mt-1">
                    {selectedUser.email}
                  </h2>
                  {selectedUser.staffProfile?.crmv && (
                    <p className="text-xs text-indigo-400 font-semibold mt-1">
                      Veterinário CRMV: {selectedUser.staffProfile.crmv} ({selectedUser.staffProfile.specialties})
                    </p>
                  )}
                </div>

                <div className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-2xl flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-200 block">Modo Personalizado Ativo</span>
                    <span className="text-slate-400">Clique nas caixas abaixo para ligar/desligar acessos</span>
                  </div>
                </div>
              </div>

              {/* Categorias de Permissões com Toggles */}
              <div className="space-y-8">
                {PERMISSION_CATEGORIES.map(cat => (
                  <div key={cat.category} className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-slate-700/60 pb-2">
                      {cat.icon} {cat.category}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cat.items.map(item => {
                        const active = hasPermission(item.action);

                        return (
                          <div 
                            key={item.action}
                            onClick={() => handleTogglePermission(item.action)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${active ? 'border-indigo-500 bg-indigo-950/40 shadow-sm' : 'border-slate-700/60 bg-slate-900/60 opacity-65 hover:opacity-100'}`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {active ? (
                                <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-600 bg-slate-800"></div>
                              )}
                            </div>

                            <div>
                              <h4 className={`font-bold text-sm ${active ? 'text-white' : 'text-slate-300'}`}>
                                {item.label}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1 leading-snug">
                                {item.desc}
                              </p>
                              <span className="text-[10px] font-mono text-slate-500 block mt-1.5">
                                action: {item.action}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8 bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-3xl">
              <ShieldCheck className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum Funcionário Selecionado</h3>
              <p className="text-slate-400 max-w-sm text-sm">
                Selecione um membro da equipe na lista ao lado para ligar ou desligar suas permissões personalizadas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL CADASTRAR NOVO FUNCIONÁRIO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-slate-100">
            <div className="bg-indigo-600 px-6 py-5">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Cadastrar Novo Funcionário
              </h2>
            </div>
            
            <form onSubmit={handleCreateMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">E-mail do Funcionário</label>
                <Input 
                  required 
                  type="email"
                  placeholder="funcionario@clinica.com.br"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Senha de Acesso Inicial</label>
                <Input 
                  required 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">CRMV (Se Veterinário)</label>
                  <Input 
                    placeholder="CRMV-SP 12345"
                    value={newCrmv}
                    onChange={(e) => setNewCrmv(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Especialidade</label>
                  <Input 
                    placeholder="Clínica Geral, Cirurgia..."
                    value={newSpecialties}
                    onChange={(e) => setNewSpecialties(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="border-slate-700 text-slate-300 hover:bg-slate-700">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6">
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Funcionário'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-50 text-white font-bold ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <ShieldCheck className="w-6 h-6" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
