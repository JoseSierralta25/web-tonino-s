---
name: nuevo-componente
description: Crea un nuevo componente React siguiendo las convenciones visuales y de arquitectura del proyecto. Usar cuando el usuario pida una sección nueva, un banner, una tarjeta, un modal, un formulario, o cualquier elemento de UI — tanto para la página pública como para el backoffice. Si dice "agrega una sección de X", "necesito mostrar Y", o "crea el componente Z", invocar este skill antes de escribir cualquier código.
---

Crea un componente React nuevo siguiendo las convenciones del proyecto.

Argumentos esperados: `NombreComponente — descripción y propósito`

Ejemplo: `/nuevo-componente BannerPromo — banner horizontal para mostrar una promoción destacada en la página principal`

## Análisis previo — responde esto antes de escribir una línea

**¿Server o Client component?**
- Solo renderiza datos recibidos como props → Server Component (sin directiva)
- Necesita estado, eventos del browser, o interactividad local → `'use client'`
- La regla de oro del proyecto: los datos siempre vienen del servidor; la interactividad vive en el cliente

**¿Dónde va?**
- Página pública → `app/components/`
- Backoffice exclusivamente → `app/admin/components/`

**¿Qué datos necesita?**
- Si los datos vienen de la DB, deben llegar como props desde el Server Component padre (`app/page.tsx` o el layout de admin). Los Client Components de este proyecto no hacen fetch directamente.

## Convenciones de código

Props con interfaces explícitas en el mismo archivo. Tipos de dominio importados desde `app/lib/types.ts` (`ProductWithSizes`, `LocationData`, etc.).

**Paleta del proyecto** — no improvisar colores fuera de esta paleta:
| Token | Valor |
|---|---|
| Fondo página | `#1A1A1A` |
| Fondo tarjetas | `#222222` |
| Hover / inputs | `#2a2a2a` |
| Texto principal | `#F5F5F0` |
| Texto secundario | `#A0A0A0` |
| Texto desactivado | `#666` |
| Acento rojo | `#C62828` / hover `#b02323` |
| Dorado | `#FFC107` |
| WhatsApp | `#25D366` |

**Tipografía:**
- Títulos y CTAs → `font-['Sora']`
- Cuerpo de texto → `font-['Plus_Jakarta_Sans']`

**Animaciones:** solo `transition-all`, `hover:-translate-y-1`, `hover:shadow-[...]` — sin librerías externas. El proyecto no usa Framer Motion ni similares.

Tailwind inline en todo — sin archivos CSS separados.

## Integración

Después de crear el componente, indicar exactamente:
1. En qué línea del JSX de `HomeClient.tsx` (o la página correspondiente) debe insertarse.
2. Qué props hay que pasarle y desde dónde vienen esos datos.
