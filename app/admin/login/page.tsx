'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-['Sora'] font-extrabold text-white tracking-wide">
            TONINO&apos;S<span className="text-[#C62828]">.</span>
          </h1>
          <p className="text-[#A0A0A0] mt-2 text-sm">Panel de administración</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#222222] rounded-xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 font-['Sora']">Iniciar sesión</h2>

          {error && (
            <div className="bg-[#C62828]/20 border border-[#C62828]/40 text-[#ff8a8a] text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#C62828] transition-colors"
                placeholder="admin@toninospizza.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#C62828] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#C62828] hover:bg-[#b02323] disabled:opacity-50 disabled:cursor-not-allowed text-white font-['Sora'] font-bold py-3 rounded-lg transition-all"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
