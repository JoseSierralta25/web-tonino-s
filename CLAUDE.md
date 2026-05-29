# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

Todos los comandos se ejecutan desde `web-tonino-s/` usando `pnpm`.

```bash
pnpm dev            # Servidor de desarrollo en http://localhost:3000
pnpm build          # Build de producción
pnpm lint           # ESLint

pnpm db:generate    # Regenerar cliente Prisma tras cambios al schema (requerido antes de iniciar la app)
pnpm db:push        # Sincronizar schema → Supabase (sin historial de migraciones, usar en dev)
pnpm db:migrate     # Crear archivo de migración + aplicarlo (usar para cambios en producción)
pnpm db:seed        # Poblar la DB con datos iniciales (productos, categorías, locales, settings)
pnpm db:studio      # Abrir Prisma Studio en http://localhost:5555
```

**Importante:** Tras cualquier cambio en `prisma/schema.prisma`, siempre ejecutar `pnpm db:generate` antes de iniciar el servidor.

## Configuración de Supabase — archivo `.env`

Toda la configuración de Supabase y la base de datos se controla exclusivamente desde el archivo `.env`. El proyecto ya tiene las credenciales configuradas:

```env
# Base de datos — conexión directa (dev local + migraciones)
DATABASE_URL="postgresql://postgres.amjwtzzxvlaueamyhpeb:Josesierralta25%2A%2A@aws-1-us-west-2.pooler.supabase.com:5432/postgres"

# Base de datos — pooler para producción Vercel (serverless)
DATABASE_POOLER_URL="postgresql://postgres.amjwtzzxvlaueamyhpeb:Josesierralta25%2A%2A@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://amjwtzzxvlaueamyhpeb.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Reglas sobre el `.env`:**
- Para cambiar el proyecto de Supabase, solo se actualiza este archivo — no hay credenciales hardcodeadas en el código.
- `DATABASE_URL` usa el puerto **5432** (conexión directa) para desarrollo local y migraciones.
- `DATABASE_POOLER_URL` usa el puerto **6543** con `?pgbouncer=true` — copiar este valor como `DATABASE_URL` en las variables de entorno de Vercel para producción.
- La contraseña tiene `**` codificado como `%2A%2A` en la URL. Si se cambia la contraseña en Supabase, aplicar el mismo encoding.
- `prisma.config.ts` carga el `.env` automáticamente vía `import "dotenv/config"` y usa `DATABASE_URL` para todas las operaciones de CLI de Prisma.
- Los helpers de Supabase en `lib/supabase/` leen `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en tiempo de ejecución — nunca están hardcodeados.

## Arquitectura

### Monorepo con dos apps
La raíz del repo contiene una app legacy simple (`/app`, sirve un HTML estático). La app activa está completamente dentro de `web-tonino-s/`. Todo el desarrollo ocurre aquí.

### División Server / Client components
`app/page.tsx` es un **Server Component** que obtiene todos los datos de la DB en paralelo y los pasa como props. La interfaz interactiva vive en `components/HomeClient.tsx` (`'use client'`), que controla todo el estado de UI (carrito, menú abierto/cerrado, efecto de scroll). Este patrón mantiene el acceso a la DB del lado del servidor y evita fetches en el cliente en la página pública.

```
app/page.tsx              → Server Component: fetches a la DB, pasa props
  └─ components/
       ├─ HomeClient.tsx  → Client Component: estado del carrito, navegación
       ├─ MenuSection.tsx → recibe products[] como prop (sin acceso a DB)
       └─ CartDrawer.tsx  → recibe locations[] + deliveryFee como props
lib/
  ├─ prisma.ts            → singleton Prisma con PrismaPg adapter
  ├─ types.ts             → tipos compartidos entre Server y Client
  └─ supabase/            → helpers server.ts, client.ts, middleware.ts
generated/prisma/         → cliente Prisma auto-generado (no editar)
data/                     → datos estáticos legacy (sin uso activo)
```

### Admin / Backoffice
Todas las rutas de administración viven bajo `app/admin/`. El layout en `app/admin/layout.tsx` valida la sesión de Supabase del lado del servidor y redirige a `/admin/login` si no hay autenticación. Las páginas de admin usan **Server Actions** (`'use server'`) directamente dentro de los page components para todas las mutaciones (crear/actualizar/eliminar) — sin rutas API separadas.

### Prisma 7 — se requiere driver adapter
Este proyecto usa Prisma 7, que requiere un adapter de driver explícito. El engine Rust embebido ya no existe.

```ts
// lib/prisma.ts — siempre instanciar con el adapter
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
```

El cliente generado está en `generated/prisma/` (raíz del proyecto, hermano de `app/`). Importar con `@/generated/prisma/client` desde código de app, o con `'../generated/prisma/client'` desde `lib/prisma.ts` y `prisma/seed.ts`. Tras `db:push` o `db:migrate`, el cliente se elimina y debe regenerarse con `db:generate`.

### Supabase Auth
Tres helpers en `lib/supabase/`:
- `server.ts` — para Server Components y Server Actions (usa cookies de `next/headers`)
- `client.ts` — para Client Components (`'use client'`, solo en el navegador)
- `middleware.ts` — lógica de refresco de sesión, llamada desde `proxy.ts`

La protección se aplica en dos capas: `proxy.ts` para redirección a nivel de ruta, y `app/admin/layout.tsx` para verificación server-side. El usuario admin se crea desde **Supabase Dashboard → Authentication → Users**.

### Tipos compartidos
`lib/types.ts` define `ProductWithSizes`, `CartItem`, `LocationData`, `PromotionData` y `SettingsMap`. Estos tipos son los que viajan entre Server y Client components y deben mantenerse sincronizados con el schema de Prisma.

### Modelo Setting
La configuración global (precio de delivery, horario, cuotas Cashea, textos del hero) vive en la tabla `Setting` como pares clave-valor. La página pública aplica valores por defecto si falta una clave. Se gestiona desde `/admin/settings`.

## Skills disponibles (slash commands)

Estos comandos están en `.claude/commands/` y se invocan con `/nombre`. Claude debe reconocer cuándo una tarea del usuario activa uno de estos flujos y ejecutarlo directamente, sin pedir confirmación redundante.

### `/db-sync`
**Cuándo usarlo:** cada vez que se modifique `prisma/schema.prisma`.
**Qué hace:** ejecuta `pnpm db:push` para sincronizar las tablas en Supabase, luego `pnpm db:generate` para regenerar el cliente TypeScript en `generated/prisma/`. Si se agrega un modelo nuevo, avisa que hay que actualizar `prisma/seed.ts` y `lib/types.ts`.

---

### `/nuevo-modelo <NombreModelo>`
**Cuándo usarlo:** cuando el usuario pide agregar una nueva entidad al sistema (ej. "añadir reseñas", "crear modelo de cupón").
**Qué hace:** flujo completo de 5 pasos — schema Prisma → `/db-sync` → tipos en `lib/types.ts` → seed inicial → páginas de backoffice en `app/admin/[nombre-plural]/` → integración en `app/page.tsx` si el modelo se muestra en el frontend público.
**Convenciones aplicadas automáticamente:** `id cuid()`, `isActive`, `sortOrder`, `createdAt/updatedAt`; Server Actions para mutaciones; paleta `#1A1A1A`/`#C62828`; badges verde/rojo para estado activo.

---

### `/agregar-setting <clave> "<Descripción>" <valor_default>`
**Cuándo usarlo:** cuando se necesita una nueva configuración global editable desde el admin (ej. tiempo de entrega, texto del banner, porcentaje de cuota).
**Qué hace:** agrega la clave en 4 lugares: array `SETTINGS_KEYS` en `app/admin/settings/page.tsx`, array `defaultSettings` en `prisma/seed.ts`, consumo con `?? 'fallback'` en `HomeClient.tsx`, y documentación en este `CLAUDE.md` bajo "Modelo Setting".

---

### `/nuevo-componente <NombreComponente — descripción>`
**Cuándo usarlo:** cuando se pide crear un nuevo elemento de UI (sección, banner, card, modal).
**Qué hace:** determina si es Server o Client component, dónde va (`app/components/` vs `app/admin/components/`), qué datos necesita, y crea el archivo siguiendo las convenciones de Tailwind, paleta y fuentes del proyecto. Al final indica el punto exacto del JSX donde debe insertarse.
**Convenciones aplicadas:** fondos `#1A1A1A`/`#222222`, texto `#F5F5F0`/`#A0A0A0`, acento `#C62828`, dorado `#FFC107`, `font-['Sora']` para títulos, `font-['Plus_Jakarta_Sans']` para cuerpo, animaciones con `transition-all` y `hover:-translate-y-1`.

---

### `/reset-db`
**Cuándo usarlo:** cuando la base de datos está en estado inconsistente o se quiere volver al estado limpio de desarrollo.
**Qué hace:** elimina todos los registros en orden correcto (respetando foreign keys: `productSize → product → category → promotion → location → setting`) y luego ejecuta `pnpm db:seed`.
**⚠️ Destructivo — solo en desarrollo.** Antes de ejecutar, verificar que `DATABASE_URL` apunta a `aws-1-us-west-2.pooler.supabase.com` y NO a una DB de producción separada.
**Resultado esperado tras el seed:** 4 categorías, 22 productos con tamaños, 2 promociones, 2 locales, 5 settings.

---

### `/deploy-check`
**Cuándo usarlo:** antes de cualquier push a producción o deploy en Vercel.
**Qué hace:** checklist de 7 puntos — `pnpm build` sin errores, variables de entorno completas en `.env` y en Vercel, cliente Prisma generado, `.env.example` actualizado, usuario admin en Supabase Auth, seed ejecutado en producción, `next.config.ts` limpio.
**Nota clave:** en Vercel, `DATABASE_URL` debe ser el valor de `DATABASE_POOLER_URL` (puerto 6543 con `?pgbouncer=true`), no la conexión directa del `.env` local.

---

### Cuándo Claude debe invocar un skill automáticamente

| Si el usuario dice… | Skill a usar |
|---|---|
| "modifiqué el schema" / "actualiza la DB" | `/db-sync` |
| "añade el modelo X" / "necesito una tabla para Y" | `/nuevo-modelo` |
| "agrega una configuración para Z" / "quiero que el admin controle X" | `/agregar-setting` |
| "crea el componente X" / "necesito una sección de Y" | `/nuevo-componente` |
| "la DB está rara" / "vuelve al estado inicial" / "limpia los datos" | `/reset-db` |
| "voy a hacer deploy" / "prepara para producción" | `/deploy-check` |

## Advertencias conocidas

- `app/data/menu.ts` — datos del menú estático heredados. La app ahora lee de la DB; este archivo está sin uso y puede eliminarse.
- `proxy.ts` es el reemplazo de Next.js 16 para `middleware.ts` (convención renombrada).
- El `pnpm-workspace.yaml` en `allowBuilds` debe tener `@prisma/engines`, `prisma` y `esbuild` como `true` para que funcionen los builds nativos.
