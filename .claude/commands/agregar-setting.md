---
name: agregar-setting
description: Agrega una nueva clave de configuración al sistema de Settings del proyecto, propagándola a todos los lugares necesarios. Invocar cuando el usuario quiera que cualquier valor sea editable desde el panel de admin sin tocar código — textos del hero, precio de delivery, horarios, cuotas de pago, mensajes promocionales. Si dice "quiero poder cambiar X desde el admin" o "hazlo configurable", este skill aplica directamente.
---

Agrega una nueva clave al sistema clave-valor de `Setting` y la conecta al admin y al frontend.

Argumentos esperados: `clave_setting "Descripción legible" valor_default`

Ejemplo: `/agregar-setting tiempo_delivery "Tiempo estimado de entrega" "30-45 min"`

## Pasos

### 1. Registrar en el panel de admin

Abre `app/admin/settings/page.tsx` y agrega un objeto al array `SETTINGS_KEYS`:

```ts
{ key: 'clave_setting', label: 'Descripción legible', type: 'text' | 'number', placeholder: 'valor de ejemplo' }
```

Ubica la nueva clave en la sección del formulario que corresponda semánticamente (delivery, cashea, textos, horarios). Si no encaja en ninguna, crea una sección nueva. Agrupar bien las claves hace el panel de admin intuitivo para el operador no técnico.

### 2. Valor por defecto en el seed

Abre `prisma/seed.ts` y agrega la clave al array `defaultSettings`:

```ts
{ key: 'clave_setting', value: 'valor_default' }
```

El seed usa `upsert`, así que este valor solo se aplica si la clave no existe en la DB — no sobreescribe cambios que el admin haya guardado.

### 3. Consumo en el frontend

Identifica dónde debe usarse el valor. En `app/components/HomeClient.tsx`, los settings llegan como `settings['clave_setting']`.

Reglas:
- Siempre usar `?? 'fallback'` por si la clave no existe en DB al momento de renderizar.
- Si el valor es numérico, parsearlo con `parseFloat()` o `parseInt()` — la tabla guarda todo como string.

### 4. Documentar en CLAUDE.md

Agrega la nueva clave a la sección "Modelo Setting" del `CLAUDE.md` con una línea que explique su propósito. Esto es importante: si alguien (humano o Claude) busca "¿qué settings existen?" en el futuro, el CLAUDE.md es el lugar canónico.

## Por qué este sistema funciona así

`Setting` es una tabla clave-valor simple (`key String @id`, `value String`). Se carga completa en cada render de la página pública y se convierte en un `Record<string, string>` (`SettingsMap`). No tiene caché especial — se invalida automáticamente con `revalidatePath('/')` desde el admin al guardar cambios.
