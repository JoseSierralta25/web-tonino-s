import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function createProduct(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const isFavorite = formData.get('isFavorite') === 'on';
  const sortOrder = Number(formData.get('sortOrder') ?? 0);

  const sizes = ['P', 'R', 'XL', 'UNICO'].map((s) => {
    const val = formData.get(`price_${s}`) as string;
    return val ? { size: s, price: parseFloat(val) } : null;
  }).filter(Boolean) as { size: string; price: number }[];

  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      categoryId,
      imageUrl: imageUrl?.trim() || null,
      isFavorite,
      sortOrder,
      sizes: { create: sizes },
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect(`/admin/products/${product.id}`);
}

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-[#A0A0A0] hover:text-white transition-colors">← Volver</Link>
        <h1 className="text-3xl font-['Sora'] font-bold text-white">Nuevo producto</h1>
      </div>

      <form action={createProduct} className="flex flex-col gap-6">
        <div className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          <h2 className="font-['Sora'] font-bold text-white">Información básica</h2>

          <div>
            <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Nombre *</label>
            <input name="name" required className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" placeholder="Ej: Tonino's Dorangel" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Descripción</label>
            <textarea name="description" rows={3} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors resize-none" placeholder="Ingredientes y descripción del producto" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Categoría *</label>
              <select name="categoryId" required className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors">
                <option value="">Seleccionar...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Orden</label>
              <input name="sortOrder" type="number" defaultValue="0" className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">URL de imagen</label>
            <input name="imageUrl" type="url" className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" placeholder="https://..." />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input name="isFavorite" type="checkbox" className="w-4 h-4 accent-[#C62828]" />
            <span className="text-sm text-[#A0A0A0]">Marcar como <span className="text-[#FFC107] font-bold">Favorito</span> (aparece destacado en la web)</span>
          </label>
        </div>

        <div className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          <h2 className="font-['Sora'] font-bold text-white">Precios por tamaño</h2>
          <p className="text-xs text-[#666]">Deja en blanco los tamaños que no aplican para este producto.</p>
          <div className="grid grid-cols-2 gap-4">
            {['P', 'R', 'XL', 'UNICO'].map((size) => (
              <div key={size}>
                <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">
                  {size === 'UNICO' ? 'Precio único' : `Tamaño ${size}`}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]">$</span>
                  <input
                    name={`price_${size}`}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-7 pr-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-4 rounded-lg transition-all font-['Sora']">
          Crear producto
        </button>
      </form>
    </div>
  );
}
