import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

async function getData() {
  const [products, promotions, locations, settings] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
      include: {
        category: { select: { id: true, name: true } },
        sizes: { orderBy: { size: 'asc' } },
      },
    }),
    prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.setting.findMany(),
  ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const featuredProducts = products.filter((p) => p.isFavorite);

  return { products, featuredProducts, promotions, locations, settingsMap };
}

export default async function Home() {
  const { products, featuredProducts, promotions, locations, settingsMap } = await getData();

  return (
    <HomeClient
      products={products}
      featuredProducts={featuredProducts}
      promotions={promotions}
      locations={locations}
      settings={settingsMap}
    />
  );
}
