---
name: reset-db
description: Limpia todos los registros de la base de datos y la repopula desde cero con el seed inicial. Usar cuando la DB está en estado inconsistente, hay datos duplicados, o se necesita un entorno limpio para desarrollo. Si el usuario dice "limpia la base de datos", "vuelve al estado inicial", "la DB está rara", o "quiero empezar de cero", ejecutar este skill — pero verificar primero que el entorno sea desarrollo.
---

Elimina todos los datos de todas las tablas y repopula la DB con los datos iniciales del seed.

## Verificación obligatoria antes de ejecutar

Confirma que `DATABASE_URL` en `.env` apunta a `aws-1-us-west-2.pooler.supabase.com`. Este es el proyecto de desarrollo — si la URL apuntara a una DB de producción separada, detener y avisar al usuario. Esta operación es irreversible.

## Pasos

### 1. Limpiar las tablas en orden correcto

El orden importa porque Prisma respeta las foreign keys — borrar en orden incorrecto lanza errores de constraint. Agrega esto temporalmente a `prisma/seed.ts` o ejecuta directamente con `pnpm db:studio`:

```ts
await prisma.productSize.deleteMany();
await prisma.product.deleteMany();
await prisma.category.deleteMany();
await prisma.promotion.deleteMany();
await prisma.location.deleteMany();
await prisma.setting.deleteMany();
```

### 2. Ejecutar el seed

```bash
pnpm db:seed
```

### 3. Verificar los conteos

Tras el seed, confirmar que los conteos son correctos:

| Tabla | Registros esperados |
|---|---|
| Categorías | 4 (Grupo 1, Grupo 2, Promociones, Bebidas) |
| Productos | 22 con sus tamaños |
| Promociones | 2 |
| Locales | 2 (Puerta Maraven, Santa Irene) |
| Settings | 5 por defecto |

## Alternativa no destructiva

Si solo faltan datos sin necesidad de borrar todo, `prisma/seed.ts` ya usa `upsert` y `findFirst`. Ejecutar `pnpm db:seed` directamente es seguro y no duplica registros existentes.
