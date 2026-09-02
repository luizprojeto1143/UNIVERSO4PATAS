'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('admin@4patas.com.br');
  const [password, setPassword] = useState('admin123456');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Real API Login Call to NestJS Backend
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.accessToken) {
        throw new Error(data.message || 'E-mail ou senha incorretos');
      }

      // Save real JWT token and user info
      Cookies.set('token', data.accessToken, { expires: 7 });
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      showToast('Login realizado com sucesso!', 'success');
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err: any) {
      console.error('Erro de Login:', err);
      showToast(err.message || 'Erro ao autenticar com o servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sistema 4 Patas</h2>
            </div>
            <h2 className="mt-8 text-3xl font-extrabold text-gray-900">
              Acesso Administrador
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Faça login para gerenciar sua clínica e cadastrar sua equipe.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-mail do Administrador
                </label>
                <div className="mt-1">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1">
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg text-xs text-indigo-900 font-medium">
                <strong>Credenciais de Administrador da Clínica:</strong>
                <p>E-mail: <span className="font-bold">admin@4patas.com.br</span></p>
                <p>Senha: <span className="font-bold">admin123456</span></p>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Lado Direito - Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-800 to-purple-900 flex flex-col justify-between p-12">
          <div className="text-white max-w-lg z-10">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6">
              Plataforma 4 Patas.
            </h1>
            <p className="text-xl text-indigo-100 font-light leading-relaxed">
              Gestão clínica, internação, estoque e equipe unificados em uma única plataforma.
            </p>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg text-white font-bold z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
