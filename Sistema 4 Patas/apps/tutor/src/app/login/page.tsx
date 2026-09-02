'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint } from 'lucide-react';

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/tutor-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, password })
      });

      if (!res.ok) {
        throw new Error('CPF ou senha inválidos');
      }

      const data = await res.json();
      localStorage.setItem('tutor_token', data.access_token);
      localStorage.setItem('tutor_data', JSON.stringify(data.tutor));
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="h-20 w-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl mb-4 transform rotate-12">
          <PawPrint className="h-10 w-10 text-white -rotate-12" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Portal do Tutor
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Acesse a carteirinha e histórico do seu pet
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/40 mx-4">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="cpf" className="block text-sm font-semibold text-slate-700">
                CPF do Titular
              </label>
              <div className="mt-1">
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  placeholder="Ex: 123.456.789-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg font-medium">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Acessar meus pets'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
