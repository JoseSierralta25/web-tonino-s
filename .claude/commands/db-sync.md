---
name: db-sync
description: Sincroniza el schema de Prisma con Supabase y regenera el cliente TypeScript. Usar cada vez que se modifique prisma/schema.prisma — incluso si el cambio parece menor. También invocar cuando aparezcan errores de tipos relacionados con modelos de Prisma, cuando el cliente generado parezca desactualizado, o antes de iniciar el servidor tras cualquier operación de base de datos.
---

Sincroniza las tablas en Supabase con el schema local y regenera el cliente TypeScript para que el resto del código pueda compilar.

## Pasos

1. Lee `prisma/schema.prisma` para entender qué cambió.
2. Ejecuta `pnpm db:push` — aplica los cambios de schema en Supabase.
3. Ejecuta `pnpm db:generate` — regenera el cliente en `app/generated/prisma/`.
4. Si se añadió o modificó un modelo, revisa `app/lib/types.ts` y agrega los tipos que los componentes necesitan para consumir ese modelo.
5. Si se añadió un modelo nuevo, avisa que hay que actualizar `prisma/seed.ts` con datos iniciales, o sugerir usar `/nuevo-modelo` para hacer el proceso completo.

## Por qué el orden importa

`db:push` modifica las tablas en Supabase y en el proceso **invalida el cliente generado**. Si el servidor de Next.js arranca antes de que `db:generate` termine, los imports de Prisma fallan. Por eso siempre van en este orden, sin saltarse el paso de generación.

## Contexto técnico clave

- El cliente se importa desde `../generated/prisma/client` — no desde `@prisma/client`.
- Prisma 7 no tiene engine Rust; siempre requiere el adapter explícito: `new PrismaPg({ connectionString: process.env.DATABASE_URL! })`.
- `db:push` usa `DATABASE_URL` del `.env` (puerto 5432, conexión directa). Si falla con error de conexión, verificar que `**` en la contraseña está codificado como `%2A%2A`.
