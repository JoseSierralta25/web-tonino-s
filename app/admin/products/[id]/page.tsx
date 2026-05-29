import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function updateProduct(id: string, formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const isFavorite = formData.get('isFavorite') === 'on';
  const sortOrder = Number(formData.get('sortOrder') ?? 0);

  const newSizes = ['P', 'R', 'XL', 'UNICO'].map((s) => {
    const val = formData.get(`price_${s}`) as string;
    return val ? { size: s, price: parseFloat(val) } : null;
  }).filter(Boolean) as { size: string; price: number }[];

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        categoryId,
        imageUrl: imageUrl?.trim() || null,
        isFavorite,
        sortOrder,
      },
    }),
    prisma.productSize.deleteMany({ where: { productId: id } }),
    prisma.productSize.createMany({
      data: newSizes.map((s) => ({ ...s, productId: id })),
    }),
  ]);

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { sizes: true },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  if (!product) notFound();

  const priceMap = Object.fromEntries(product.sizes.map((s) => [s.size, s.price]));

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-[#A0A0A0] hover:text-white transition-colors">← Volver</Link>
        <h1 className="text-3xl font-['Sora'] font-bold text-white">Editar producto</h1>
      </div>

      <form action={updateProduct.bind(null, id)} className="flex flex-col gap-6">
        <div className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          <h2 className="font-['Sora'] font-bold text-white">Información básica</h2>

          <div>
            <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Nombre *</label>
            <input name="name" required defaultValue={product.name} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Descripción</label>
            <textarea name="description" rows={3} defaultValue={product.description ?? ''} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Categoría *</label>
              <select name="categoryId" required defaultValue={product.categoryId} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Orden</label>
              <input name="sortOrder" type="number" defaultValue={product.sortOrder} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">URL de imagen</label>
            <input name="imageUrl" type="url" defaultValue={product.imageUrl ?? ''} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" placeholder="https://..." />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input name="isFavorite" type="checkbox" defaultChecked={product.isFavorite} className="w-4 h-4 accent-[#C62828]" />
            <span className="text-sm text-[#A0A0A0]">Marcar como <span className="text-[#FFC107] font-bold">Favorito</span></span>
          </label>
        </div>

        <div className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          <h2 className="font-['Sora'] font-bold text-white">Precios por tamaño</h2>
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
                    defaultValue={priceMap[size] ?? ''}
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-7 pr-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-4 rounded-lg transition-all font-['Sora']">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
