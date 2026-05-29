import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function updatePromotion(id: string, formData: FormData) {
  'use server';
  await prisma.promotion.update({
    where: { id },
    data: {
      name: (formData.get('name') as string).trim(),
      description: (formData.get('description') as string)?.trim() || null,
      label: (formData.get('label') as string)?.trim() || null,
      price: parseFloat(formData.get('price') as string),
      imageUrl: (formData.get('imageUrl') as string)?.trim() || null,
      sortOrder: Number(formData.get('sortOrder') ?? 0),
    },
  });
  revalidatePath('/admin/promotions');
  revalidatePath('/');
  redirect('/admin/promotions');
}

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const promo = await prisma.promotion.findUnique({ where: { id } });
  if (!promo) notFound();

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/promotions" className="text-[#A0A0A0] hover:text-white transition-colors">← Volver</Link>
        <h1 className="text-3xl font-['Sora'] font-bold text-white">Editar promoción</h1>
      </div>

      <form action={updatePromotion.bind(null, id)} className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Nombre *</label>
          <input name="name" required defaultValue={promo.name} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Descripción</label>
          <textarea name="description" rows={3} defaultValue={promo.description ?? ''} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Etiqueta</label>
            <input name="label" defaultValue={promo.label ?? ''} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Precio *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]">$</span>
              <input name="price" type="number" step="0.01" min="0" required defaultValue={promo.price} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-7 pr-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">URL de imagen</label>
          <input name="imageUrl" type="url" defaultValue={promo.imageUrl ?? ''} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Orden</label>
          <input name="sortOrder" type="number" defaultValue={promo.sortOrder} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
        </div>
        <button type="submit" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-3 rounded-lg transition-all font-['Sora']">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
