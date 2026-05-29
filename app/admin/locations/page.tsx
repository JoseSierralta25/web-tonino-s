import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function createLocation(formData: FormData) {
  'use server';
  await prisma.location.create({
    data: {
      name: (formData.get('name') as string).trim(),
      whatsappNumber: (formData.get('whatsappNumber') as string).trim(),
      mapsEmbedUrl: (formData.get('mapsEmbedUrl') as string)?.trim() || null,
      sortOrder: Number(formData.get('sortOrder') ?? 0),
    },
  });
  revalidatePath('/admin/locations');
  revalidatePath('/');
  redirect('/admin/locations');
}

async function toggleLocation(id: string, current: boolean) {
  'use server';
  await prisma.location.update({ where: { id }, data: { isActive: !current } });
  revalidatePath('/admin/locations');
}

async function deleteLocation(id: string) {
  'use server';
  await prisma.location.delete({ where: { id } });
  revalidatePath('/admin/locations');
}

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-['Sora'] font-bold text-white">Locales</h1>
        <p className="text-[#A0A0A0] mt-1">Gestiona los locales y sus números de WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#222] rounded-xl p-6 border border-white/10 h-fit">
          <h2 className="font-['Sora'] font-bold text-white mb-4">Nuevo local</h2>
          <form action={createLocation} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Nombre del local *</label>
              <input name="name" required className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" placeholder="Ej: Puerta Maraven" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Número WhatsApp *</label>
              <input name="whatsappNumber" required className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" placeholder="584221234567" />
              <p className="text-xs text-[#666] mt-1">Formato internacional sin + (ej: 584221234567)</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">URL embed de Google Maps</label>
              <textarea name="mapsEmbedUrl" rows={3} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors resize-none text-xs" placeholder="https://maps.google.com/maps?..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Orden</label>
              <input name="sortOrder" type="number" defaultValue="0" className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
            </div>
            <button type="submit" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-3 rounded-lg transition-all font-['Sora']">
              Agregar local
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-[#222] rounded-xl p-6 border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-['Sora'] font-bold text-white text-lg">{loc.name}</h3>
                  <p className="text-[#A0A0A0] text-sm mt-1">📱 {loc.whatsappNumber}</p>
                  {loc.mapsEmbedUrl && <p className="text-[#666] text-xs mt-1 truncate max-w-sm">🗺️ URL de mapa configurada</p>}
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${loc.isActive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                  {loc.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link href={`/admin/locations/${loc.id}`} className="text-xs text-[#A0A0A0] hover:text-white px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-all">Editar</Link>
                <form action={toggleLocation.bind(null, loc.id, loc.isActive)}>
                  <button className="text-xs text-[#A0A0A0] hover:text-[#FFC107] px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-all">
                    {loc.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </form>
                <form action={deleteLocation.bind(null, loc.id)}>
                  <button className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded bg-white/5 hover:bg-red-900/20 transition-all">Eliminar</button>
                </form>
              </div>
            </div>
          ))}
          {locations.length === 0 && (
            <div className="bg-[#222] rounded-xl p-12 border border-white/10 text-center text-[#666]">No hay locales configurados.</div>
          )}
        </div>
      </div>
    </div>
  );
}
