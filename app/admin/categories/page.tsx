import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function toggleCategory(id: string, current: boolean) {
  'use server';
  await prisma.category.update({ where: { id }, data: { isActive: !current } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

async function deleteCategory(id: string) {
  'use server';
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

async function createCategory(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const sortOrder = Number(formData.get('sortOrder') ?? 0);
  if (!name.trim()) return;
  await prisma.category.create({ data: { name: name.trim(), sortOrder } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories');
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-['Sora'] font-bold text-white">Categorías</h1>
          <p className="text-[#A0A0A0] mt-1">{categories.length} categorías en total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario nueva categoría */}
        <div className="bg-[#222] rounded-xl p-6 border border-white/10 h-fit">
          <h2 className="font-['Sora'] font-bold text-white mb-4">Nueva categoría</h2>
          <form action={createCategory} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Nombre</label>
              <input
                name="name"
                required
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#C62828] transition-colors"
                placeholder="Ej: Grupo 1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Orden de aparición</label>
              <input
                name="sortOrder"
                type="number"
                defaultValue="0"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#C62828] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-3 rounded-lg transition-all font-['Sora']"
            >
              Crear categoría
            </button>
          </form>
        </div>

        {/* Lista de categorías */}
        <div className="lg:col-span-2 bg-[#222] rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Nombre</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Productos</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Orden</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{cat.name}</td>
                  <td className="px-6 py-4 text-[#A0A0A0]">{cat._count.products}</td>
                  <td className="px-6 py-4 text-[#A0A0A0]">{cat.sortOrder}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat.isActive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                      {cat.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/categories/${cat.id}`} className="text-xs text-[#A0A0A0] hover:text-white px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all">
                        Editar
                      </Link>
                      <form action={toggleCategory.bind(null, cat.id, cat.isActive)}>
                        <button className="text-xs text-[#A0A0A0] hover:text-[#FFC107] px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all">
                          {cat.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                      </form>
                      {cat._count.products === 0 && (
                        <form action={deleteCategory.bind(null, cat.id)}>
                          <button className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1 rounded bg-white/5 hover:bg-red-900/20 transition-all">
                            Eliminar
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <p className="text-center text-[#666] py-12">No hay categorías aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
