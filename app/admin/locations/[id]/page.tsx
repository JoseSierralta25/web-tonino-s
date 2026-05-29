import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function updateLocation(id: string, formData: FormData) {
  'use server';
  await prisma.location.update({
    where: { id },
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

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const loc = await prisma.location.findUnique({ where: { id } });
  if (!loc) notFound();

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/locations" className="text-[#A0A0A0] hover:text-white transition-colors">← Volver</Link>
        <h1 className="text-3xl font-['Sora'] font-bold text-white">Editar local</h1>
      </div>

      <form action={updateLocation.bind(null, id)} className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Nombre del local *</label>
          <input name="name" required defaultValue={loc.name} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Número WhatsApp *</label>
          <input name="whatsappNumber" required defaultValue={loc.whatsappNumber} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
          <p className="text-xs text-[#666] mt-1">Formato internacional sin + (ej: 584221234567)</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">URL embed de Google Maps</label>
          <textarea name="mapsEmbedUrl" rows={4} defaultValue={loc.mapsEmbedUrl ?? ''} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors resize-none text-xs" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">Orden</label>
          <input name="sortOrder" type="number" defaultValue={loc.sortOrder} className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C62828] transition-colors" />
        </div>
        <button type="submit" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-3 rounded-lg transition-all font-['Sora']">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
