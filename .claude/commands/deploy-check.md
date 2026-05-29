---
name: deploy-check
description: Lista de verificación completa antes de hacer deploy a Vercel. Invocar siempre antes de un push a producción — incluso si todo parece estar listo. Si el usuario menciona "voy a hacer deploy", "subo los cambios", "preparo para Vercel", o "está listo para producción", ejecutar este skill antes de cualquier push.
---

Verifica que el proyecto está en condiciones para producción. Ejecutar antes de cada deploy a Vercel.

## Checklist

### 1. Build limpio

Ejecuta `pnpm build`. Si hay errores de TypeScript o de compilación, corregirlos antes de continuar — Vercel fallará exactamente por los mismos errores.

### 2. Variables de entorno — local

Confirma que `.env` tiene estas claves con valores reales:

| Variable | Notas |
|---|---|
| `DATABASE_URL` | Puerto **5432** (dev local) |
| `DATABASE_POOLER_URL` | Puerto **6543** con `?pgbouncer=true` (para Vercel) |
| `NEXT_PUBLIC_SUPABASE_URL` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | |
| `SUPABASE_SERVICE_ROLE_KEY` | |

### 3. Variables de entorno — Vercel

En **Vercel → Settings → Environment Variables**, la variable `DATABASE_URL` debe ser el valor de `DATABASE_POOLER_URL` local (puerto 6543). En producción, Next.js corre en funciones serverless y necesita PgBouncer para manejar múltiples conexiones concurrentes — la conexión directa (puerto 5432) agota el pool rápidamente.

```
postgresql://postgres.amjwtzzxvlaueamyhpeb:...@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 4. Cliente Prisma generado

Confirma que `app/generated/prisma/` existe y no está vacío. En caso de duda, ejecuta `/db-sync`.

### 5. `.env.example` actualizado

Si se agregaron nuevas variables al `.env`, reflejarlas en `.env.example` sin valores reales. Este archivo es la referencia para futuros desarrolladores.

### 6. Usuario admin en Supabase

Verifica que existe al menos un usuario en **Supabase Dashboard → Authentication → Users**. Sin un usuario, el backoffice no es accesible tras el deploy.

### 7. Seed en producción (primer deploy)

Si es el primer deploy o la DB de producción está vacía, ejecutar `pnpm db:seed` después del deploy para poblar las tablas. El seed es idempotente — se puede ejecutar varias veces sin duplicar datos.

## Resumen rápido

- [ ] `pnpm build` sin errores
- [ ] `.env` completo con todas las claves
- [ ] Vercel tiene `DATABASE_URL` = pooler puerto 6543
- [ ] `app/generated/prisma/` existe
- [ ] `.env.example` refleja las claves actuales
- [ ] Usuario admin en Supabase Auth
- [ ] DB tiene datos (seed ejecutado)
