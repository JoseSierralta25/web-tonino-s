import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function toggleProduct(id: string, current: boolean) {
  'use server';
  await prisma.product.update({ where: { id }, data: { isActive: !current } });
  revalidatePath('/admin/products');
  revalidatePath('/');
}

async function deleteProduct(id: string) {
  'use server';
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    include: { category: true, sizes: { orderBy: { size: 'asc' } } },
  });

  const grouped = products.reduce<Record<string, typeof products>>((acc, p) => {
    const cat = p.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-['Sora'] font-bold text-white">Productos</h1>
          <p className="text-[#A0A0A0] mt-1">{products.length} productos en total</p>
        </div>
        <Link href="/admin/products/new" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold px-6 py-3 rounded-lg transition-all font-['Sora'] text-sm">
          + Nuevo producto
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([categoryName, items]) => (
          <div key={categoryName} className="bg-[#222] rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-[#1e1e1e]">
              <h2 className="font-['Sora'] font-bold text-white">{categoryName}</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Producto</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Precios</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Destacado</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-[#666] mt-1 max-w-xs truncate">{product.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#A0A0A0]">
                      {product.sizes.map((s) => (
                        <span key={s.size} className="mr-2">{s.size}: <span className="text-white">${s.price}</span></span>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      {product.isFavorite && (
                        <span className="text-xs bg-[#FFC107]/20 text-[#FFC107] px-2 py-1 rounded-full font-bold">★ Favorito</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.isActive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/products/${product.id}`} className="text-xs text-[#A0A0A0] hover:text-white px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all">
                          Editar
                        </Link>
                        <form action={toggleProduct.bind(null, product.id, product.isActive)}>
                          <button className="text-xs text-[#A0A0A0] hover:text-[#FFC107] px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all">
                            {product.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                        </form>
                        <form action={deleteProduct.bind(null, product.id)}>
                          <button className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1 rounded bg-white/5 hover:bg-red-900/20 transition-all">
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 text-[#666]">
          No hay productos. <Link href="/admin/products/new" className="text-[#C62828] hover:underline">Crea el primero.</Link>
        </div>
      )}
    </div>
  );
}
