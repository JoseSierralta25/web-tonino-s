import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function togglePromotion(id: string, current: boolean) {
  'use server';
  await prisma.promotion.update({ where: { id }, data: { isActive: !current } });
  revalidatePath('/admin/promotions');
  revalidatePath('/');
}

async function deletePromotion(id: string) {
  'use server';
  await prisma.promotion.delete({ where: { id } });
  revalidatePath('/admin/promotions');
  revalidatePath('/');
}

export default async function PromotionsPage() {
  const promotions = await prisma.promotion.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-['Sora'] font-bold text-white">Promociones</h1>
          <p className="text-[#A0A0A0] mt-1">{promotions.length} promociones en total</p>
        </div>
        <Link href="/admin/promotions/new" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold px-6 py-3 rounded-lg transition-all font-['Sora'] text-sm">
          + Nueva promoción
        </Link>
      </div>

      <div className="bg-[#222] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Promoción</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Etiqueta</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Precio</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-white">{promo.name}</p>
                  {promo.description && <p className="text-xs text-[#666] mt-1 max-w-xs truncate">{promo.description}</p>}
                </td>
                <td className="px-6 py-4 text-sm text-[#A0A0A0]">{promo.label ?? '—'}</td>
                <td className="px-6 py-4 text-white font-bold">${promo.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${promo.isActive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                    {promo.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/promotions/${promo.id}`} className="text-xs text-[#A0A0A0] hover:text-white px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all">Editar</Link>
                    <form action={togglePromotion.bind(null, promo.id, promo.isActive)}>
                      <button className="text-xs text-[#A0A0A0] hover:text-[#FFC107] px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all">
                        {promo.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                    </form>
                    <form action={deletePromotion.bind(null, promo.id)}>
                      <button className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1 rounded bg-white/5 hover:bg-red-900/20 transition-all">Eliminar</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promotions.length === 0 && (
          <p className="text-center text-[#666] py-12">
            No hay promociones. <Link href="/admin/promotions/new" className="text-[#C62828] hover:underline">Crea la primera.</Link>
          </p>
        )}
      </div>
    </div>
  );
}
