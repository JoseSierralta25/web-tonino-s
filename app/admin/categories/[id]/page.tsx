import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function updateCategory(id: string, formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const sortOrder = Number(formData.get('sortOrder') ?? 0);
  await prisma.category.update({ where: { id }, data: { name: name.trim(), sortOrder } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories');
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="p-8 max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/categories" className="text-[#A0A0A0] hover:text-white transition-colors">← Volver</Link>
        <h1 className="text-3xl font-['Sora'] font-bold text-white">Editar categoría</h1>
      </div>

      <form action={updateCategory.bind(null, id)} className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Nombre</label>
          <input
            name="name"
            required
            defaultValue={category.name}
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Orden de aparición</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={category.sortOrder}
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors"
          />
        </div>
        <button type="submit" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-3 rounded-lg transition-all font-['Sora']">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
