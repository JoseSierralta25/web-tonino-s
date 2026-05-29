'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/products', label: 'Productos', icon: '🍕' },
  { href: '/admin/categories', label: 'Categorías', icon: '📂' },
  { href: '/admin/promotions', label: 'Promociones', icon: '🏷️' },
  { href: '/admin/locations', label: 'Locales', icon: '📍' },
  { href: '/admin/settings', label: 'Configuración', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-64 bg-[#111] border-r border-white/10 flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-['Sora'] font-extrabold text-white text-xl tracking-wide">
          TONINO&apos;S<span className="text-[#C62828]">.</span>
        </h1>
        <p className="text-[#666] text-xs mt-1">Panel de administración</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#C62828]/20 text-white border border-[#C62828]/30'
                  : 'text-[#A0A0A0] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#A0A0A0] hover:bg-white/5 hover:text-white transition-all mb-1"
        >
          <span>🌐</span> Ver sitio web
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#A0A0A0] hover:bg-red-900/20 hover:text-red-400 transition-all"
        >
          <span>↩</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
