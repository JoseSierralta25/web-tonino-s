import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@supabase/supabase-js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Categories
  const categorias = [
    { name: 'Grupo 1', sortOrder: 1 },
    { name: 'Grupo 2', sortOrder: 2 },
    { name: 'Promociones', sortOrder: 3 },
    { name: 'Bebidas', sortOrder: 4 },
  ];

  for (const cat of categorias) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map((c) => [c.name, c.id]));

  // Products
  const products = [
    // Grupo 1
    {
      name: "Tonino's Margarita",
      description: "Salsa napolitana y mozzarella",
      category: 'Grupo 1',
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.15 AM.jpeg',
      sizes: [{ size: 'P', price: 3.5 }, { size: 'R', price: 6.5 }, { size: 'XL', price: 19 }],
    },
    {
      name: "Tonino's Jamón y Queso",
      description: "Salsa napolitana, mozzarella y jamón",
      category: 'Grupo 1',
      sizes: [{ size: 'P', price: 4.5 }, { size: 'R', price: 7.5 }, { size: 'XL', price: 20 }],
    },
    {
      name: "Tonino's Napolitana",
      description: "Salsa napolitana, mozzarella, anchoas y orégano",
      category: 'Grupo 1',
      sizes: [{ size: 'P', price: 5 }, { size: 'R', price: 10 }, { size: 'XL', price: 21 }],
    },
    {
      name: "Tonino's Hula Hula",
      description: "Salsa napolitana, mozzarella, jamón, tocineta y piña",
      category: 'Grupo 1',
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 1.15.28 PM.jpeg',
      sizes: [{ size: 'P', price: 6.5 }, { size: 'R', price: 9 }, { size: 'XL', price: 22 }],
    },
    {
      name: "Tonino's Pio Pio",
      description: "Salsa napolitana, mozzarella, pollo y salsa BBQ",
      category: 'Grupo 1',
      sizes: [{ size: 'P', price: 6 }, { size: 'R', price: 9 }, { size: 'XL', price: 21 }],
    },
    {
      name: "Tonino's Primavera",
      description: "Salsa napolitana, mozzarella, jamón, tocineta y maíz",
      category: 'Grupo 1',
      sizes: [{ size: 'P', price: 6 }, { size: 'R', price: 10 }, { size: 'XL', price: 25 }],
    },
    {
      name: "Tonino's Pepperoni",
      description: "Salsa napolitana, mozzarella y pepperoni",
      category: 'Grupo 1',
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.16 AM.jpeg',
      sizes: [{ size: 'P', price: 6 }, { size: 'R', price: 10 }, { size: 'XL', price: 22 }],
    },
    {
      name: "Tonino's Pesto",
      description: "Salsa napolitana, mozzarella, queso ricotta y pesto",
      category: 'Grupo 1',
      sizes: [{ size: 'P', price: 6 }, { size: 'R', price: 9 }, { size: 'XL', price: 21 }],
    },
    {
      name: "Tonino's Vegetariana",
      description: "Salsa napolitana, mozzarella, aceitunas negras, champiñones, cebolla, pimentón, maíz y orégano",
      category: 'Grupo 1',
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 1.15.28 PM copy.jpeg',
      sizes: [{ size: 'P', price: 6 }, { size: 'R', price: 11 }, { size: 'XL', price: 26 }],
    },
    {
      name: "Tonino's Juanga",
      description: "Salsa napolitana, mozzarella, carne, jalapeño, picadillo, nachos y dip mayopesto",
      category: 'Grupo 1',
      isFavorite: true,
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (2).jpeg',
      sizes: [{ size: 'P', price: 7 }, { size: 'R', price: 12 }, { size: 'XL', price: 27 }],
    },
    {
      name: "Tonino's Dorangel",
      description: "Salsa napolitana, mozzarella, carne, pollo, chorizo, papas fritas y salsa BBQ",
      category: 'Grupo 1',
      isFavorite: true,
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (4).jpeg',
      sizes: [{ size: 'P', price: 7.5 }, { size: 'R', price: 12.5 }, { size: 'XL', price: 31 }],
    },
    // Grupo 2
    {
      name: "Tonino's Capressa",
      description: "Salsa napolitana, mozzarella, queso ricotta, rodajas de tomate y pesto",
      category: 'Grupo 2',
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.40.14 AM (2).jpeg',
      sizes: [{ size: 'P', price: 6 }, { size: 'R', price: 11 }, { size: 'XL', price: 21 }],
    },
    {
      name: "Tonino's Carbonara",
      description: "Queso crema, mozzarella, tocineta, maíz y champiñones",
      category: 'Grupo 2',
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.40.14 AM.jpeg',
      sizes: [{ size: 'P', price: 8 }, { size: 'R', price: 13 }, { size: 'XL', price: 30 }],
    },
    {
      name: "Tonino's Especial Doritos",
      description: "Bordes de queso, salsa napolitana, mozzarella, pepperoni, doritos y queso pecorino",
      category: 'Grupo 2',
      isFavorite: true,
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (3).jpeg',
      sizes: [{ size: 'P', price: 8 }, { size: 'R', price: 14 }, { size: 'XL', price: 31 }],
    },
    {
      name: "Tonino's 4 Quesos",
      description: "Salsa napolitana, mozzarella, queso azul, queso ricotta y queso parmesano",
      category: 'Grupo 2',
      isFavorite: true,
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (1).jpeg',
      sizes: [{ size: 'P', price: 7 }, { size: 'R', price: 12 }, { size: 'XL', price: 26 }],
    },
    {
      name: "Tonino's 4 Estaciones",
      description: "Salsa napolitana 4 sabores alternativos",
      category: 'Grupo 2',
      imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.40.14 AM (1).jpeg',
      sizes: [{ size: 'P', price: 8 }, { size: 'R', price: 14 }, { size: 'XL', price: 32 }],
    },
    {
      name: "Tonino's Atún",
      description: "Salsa napolitana, mozzarella, atún preparado y champiñones",
      category: 'Grupo 2',
      sizes: [{ size: 'R', price: 12 }],
    },
    // Bebidas
    { name: "Agua", category: 'Bebidas', sizes: [{ size: 'UNICO', price: 1 }] },
    { name: "Nestea", category: 'Bebidas', sizes: [{ size: 'UNICO', price: 2 }] },
    { name: "Cerveza", category: 'Bebidas', sizes: [{ size: 'UNICO', price: 0.85 }] },
    { name: "Balde de Cervezas", category: 'Bebidas', sizes: [{ size: 'UNICO', price: 8 }] },
    { name: "Refresco 1.5 LT", category: 'Bebidas', sizes: [{ size: 'UNICO', price: 2.5 }] },
  ];

  for (const [i, p] of products.entries()) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description ?? null,
          categoryId: catMap[p.category],
          isFavorite: p.isFavorite ?? false,
          imageUrl: p.imageUrl ?? null,
          sortOrder: i,
          sizes: { create: p.sizes },
        },
      });
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          isFavorite: p.isFavorite ?? false,
          imageUrl: p.imageUrl ?? null,
          sortOrder: i,
        },
      });
    }
  }

  // Promotions — reemplazar completamente para que coincida con el diseño
  await prisma.promotion.deleteMany({});
  await prisma.promotion.createMany({
    data: [
      {
        name: "Combo Familiar",
        label: "PARA COMPARTIR",
        description: "2 Pizzas Grandes + Refresco de 2L. Ideal para compartir en familia con el mejor sabor.",
        price: 25,
        imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.17 AM.jpeg',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Combo Dúo",
        label: "PROMO DEL DÍA",
        description: "1 Pizza Mediana de cualquier ingrediente + 2 bebidas para disfrutar en pareja.",
        price: 15,
        imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.17 AM (1).jpeg',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Fiesta Tonino's",
        label: "FIN DE SEMANA",
        description: "3 Pizzas Medianas clásicas para armar la fiesta perfecta sin salir de casa.",
        price: 30,
        imageUrl: '/images/WhatsApp Image 2026-05-19 at 11.24.17 AM.jpeg',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Maxi Pizza",
        label: "MEGA AHORRO",
        description: "Nuestra pizza extra grande de 16 porciones con extra queso y borde relleno.",
        price: 22,
        imageUrl: '/images/WhatsApp Image 2026-05-19 at 3.46.04 PM - Editado (1).png',
        isActive: true,
        sortOrder: 4,
      },
    ],
  });

  // Locations
  const locations = [
    {
      name: 'Puerta Maraven',
      whatsappNumber: '584222121555',
      mapsEmbedUrl: 'https://maps.google.com/maps?q=Puerta%20Maraven,%20Punto%20Fijo,%20Falcon&t=&z=15&ie=UTF8&iwloc=&output=embed',
      sortOrder: 1,
    },
    { name: 'Santa Irene', whatsappNumber: '584223131888', sortOrder: 2 },
  ];

  for (const loc of locations) {
    const existing = await prisma.location.findFirst({ where: { name: loc.name } });
    if (!existing) {
      await prisma.location.create({ data: loc });
    }
  }

  // Default settings
  const defaultSettings = [
    { key: 'delivery_fee', value: '2' },
    { key: 'business_hours', value: '12:00 PM - 11:00 PM · Todos los días' },
    { key: 'delivery_zone', value: 'Zonas céntricas garantizadas' },
    { key: 'delivery_time', value: 'Menos de 35 mins de espera' },
    { key: 'cashea_installments', value: '4' },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const alreadyExists = existingUsers?.users.some((u) => u.email === adminEmail);

    if (!alreadyExists) {
      const { error } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
      if (error) {
        console.error('Error creando usuario admin:', error.message);
      } else {
        console.log(`Usuario admin creado: ${adminEmail}`);
      }
    } else {
      console.log(`Usuario admin ya existe: ${adminEmail}`);
    }
  } else {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD no definidos — saltando creación de usuario admin.');
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
