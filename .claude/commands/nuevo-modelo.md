---
name: nuevo-modelo
description: Scaffold completo para añadir una nueva entidad al proyecto — desde el schema de Prisma hasta el backoffice y el frontend público. Invocar siempre que el usuario quiera guardar un nuevo tipo de dato en la base de datos: aunque diga "agregar reseñas", "quiero una sección de cupones", "necesito guardar pedidos", o "crea el admin para X" sin mencionar Prisma ni modelos explícitamente.
---

Agrega un nuevo modelo de datos de forma completa. Argumento esperado: nombre del modelo en PascalCase.

Ejemplo: `/nuevo-modelo Cupon`

## Pasos en orden

### 1. Schema Prisma

Abre `prisma/schema.prisma` y define el modelo siguiendo las convenciones del proyecto:

```prisma
model NombreModelo {
  id        String   @id @default(cuid())
  // campos específicos del modelo
  isActive  Boolean  @default(true)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

`isActive` y `sortOrder` son el estándar para entidades gestionables: permiten ocultar registros sin borrarlos y controlar el orden de aparición desde el admin sin modificar código.

Ejecuta `/db-sync` para aplicar el modelo en Supabase y regenerar el cliente.

### 2. Tipos compartidos

Abre `app/lib/types.ts` y agrega el tipo que los componentes de UI necesitan. Solo incluir los campos que realmente se usan en el frontend — no hace falta espejear toda la entidad Prisma.

### 3. Seed inicial

Si el modelo necesita datos de ejemplo, agrégalos en `prisma/seed.ts` usando el patrón `upsert` existente. El seed se ejecuta múltiples veces durante desarrollo, así que debe ser idempotente.

### 4. Backoffice

Crea las páginas en `app/admin/[nombre-plural]/`:

**`page.tsx`** — lista con tabla y formulario de creación. Las mutaciones van directamente como Server Actions (`'use server'`) en el mismo archivo — sin rutas API separadas, porque las Server Actions son más simples y están co-localizadas con la UI que las invoca.

**`[id]/page.tsx`** — formulario de edición, solo si el modelo tiene suficientes campos para justificarlo.

Agrega la ruta al array `navItems` en `app/admin/components/Sidebar.tsx`.

Convenciones visuales del backoffice:
- Fondos: `#1A1A1A` / `#222222` | Acento: `#C62828`
- Botones de tabla: `text-xs px-3 py-1 rounded bg-white/5 hover:bg-white/10`
- Badge activo: `bg-green-900/40 text-green-400` | inactivo: `bg-red-900/40 text-red-400`

### 5. Frontend público (si aplica)

Si el modelo debe mostrarse en la página pública, agrega el fetch dentro del `Promise.all` en `getData()` en `app/page.tsx` y pasa los datos como prop a `HomeClient.tsx`. El `Promise.all` existe precisamente para que todos los fetches corran en paralelo — no sacar el nuevo fetch fuera de él.
