import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getStats() {
  const [products, categories, promotions, locations] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.promotion.count({ where: { isActive: true } }),
    prisma.location.count({ where: { isActive: true } }),
  ]);
  return { products, categories, promotions, locations };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Productos activos', value: stats.products, href: '/admin/products', icon: '🍕', color: 'border-[#C62828]/30' },
    { label: 'Categorías', value: stats.categories, href: '/admin/categories', icon: '📂', color: 'border-[#FFC107]/30' },
    { label: 'Promociones activas', value: stats.promotions, href: '/admin/promotions', icon: '🏷️', color: 'border-green-600/30' },
    { label: 'Locales activos', value: stats.locations, href: '/admin/locations', icon: '📍', color: 'border-blue-600/30' },
  ];

  const quickLinks = [
    { href: '/admin/products/new', label: 'Agregar producto', icon: '➕' },
    { href: '/admin/promotions/new', label: 'Nueva promoción', icon: '🏷️' },
    { href: '/admin/settings', label: 'Editar configuración', icon: '⚙️' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-['Sora'] font-bold text-white">Dashboard</h1>
        <p className="text-[#A0A0A0] mt-1">Vista general de Tonino&apos;s Pizza</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`bg-[#222] rounded-xl p-6 border ${card.color} hover:bg-[#2a2a2a] transition-all group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-[#A0A0A0] text-xs group-hover:text-white transition-colors">Ver →</span>
            </div>
            <p className="text-4xl font-['Sora'] font-bold text-white mb-1">{card.value}</p>
            <p className="text-[#A0A0A0] text-sm">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-[#222] rounded-xl p-6 border border-white/10 max-w-md">
        <h2 className="font-['Sora'] font-bold text-white mb-4">Acciones rápidas</h2>
        <div className="flex flex-col gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#2a2a2a] hover:bg-[#C62828]/20 hover:border-[#C62828]/30 border border-transparent text-sm font-semibold text-[#A0A0A0] hover:text-white transition-all"
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
