import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const SETTINGS_KEYS = [
  { key: 'delivery_fee', label: 'Precio del delivery ($)', type: 'number', placeholder: '2.00' },
  { key: 'business_hours', label: 'Horario de atención', type: 'text', placeholder: '12:00 PM - 11:00 PM · Todos los días' },
  { key: 'delivery_zone', label: 'Zona de delivery', type: 'text', placeholder: 'Zonas céntricas garantizadas' },
  { key: 'delivery_time', label: 'Tiempo estimado de entrega', type: 'text', placeholder: 'Menos de 35 mins' },
  { key: 'cashea_installments', label: 'Cuotas Cashea', type: 'number', placeholder: '4' },
  { key: 'hero_title', label: 'Título del hero (línea 1)', type: 'text', placeholder: 'El verdadero' },
  { key: 'hero_subtitle', label: 'Subtítulo del hero', type: 'text', placeholder: 'Ingredientes artesanales, masa madre...' },
];

async function saveSettings(formData: FormData) {
  'use server';
  const upserts = SETTINGS_KEYS.map(({ key }) => {
    const value = (formData.get(key) as string)?.trim() ?? '';
    return prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  });
  await Promise.all(upserts);
  revalidatePath('/admin/settings');
  revalidatePath('/');
}

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-['Sora'] font-bold text-white">Configuración</h1>
        <p className="text-[#A0A0A0] mt-1">Ajustes generales del sitio web</p>
      </div>

      <form action={saveSettings} className="flex flex-col gap-6">
        <div className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          <h2 className="font-['Sora'] font-bold text-white">Delivery y horarios</h2>
          {SETTINGS_KEYS.slice(0, 4).map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">{label}</label>
              <input
                name={key}
                type={type}
                step={type === 'number' ? '0.01' : undefined}
                defaultValue={settingsMap[key] ?? ''}
                placeholder={placeholder}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#C62828] transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          <h2 className="font-['Sora'] font-bold text-white">Cashea</h2>
          {SETTINGS_KEYS.slice(4, 5).map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">{label}</label>
              <input
                name={key}
                type={type}
                defaultValue={settingsMap[key] ?? ''}
                placeholder={placeholder}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#C62828] transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="bg-[#222] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          <h2 className="font-['Sora'] font-bold text-white">Textos del sitio</h2>
          {SETTINGS_KEYS.slice(5).map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-[#A0A0A0] mb-2">{label}</label>
              <input
                name={key}
                type={type}
                defaultValue={settingsMap[key] ?? ''}
                placeholder={placeholder}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#C62828] transition-colors"
              />
            </div>
          ))}
        </div>

        <button type="submit" className="bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-4 rounded-lg transition-all font-['Sora']">
          Guardar configuración
        </button>
      </form>
    </div>
  );
}
