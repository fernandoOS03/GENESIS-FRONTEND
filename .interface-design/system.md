# Genesis Admin — Interface Design System

## Direction & Feel

**Fintech Neumórfica Suave.** Inspirado en productos financieros modernos y limpios. La interfaz debe sentirse extremadamente accesible, con esquinas muy redondeadas, separaciones tipo píldora, alto contraste en el color de acento (naranja), y un fondo gris claro que permite que las tarjetas blancas parezcan flotar.

- **Background:** Gris claro cálido/neutro (`#F2F4F7`) para envolver el espacio.
- **Cards & Pills:** Blanco puro (`#FFFFFF`) con bordes súper redondeados (`20px+`) y sombras difusas.
- **Accent/Brand:** Naranja vibrante (`#F95722`) usado como el CTA principal y acento activo.
- **Dark Surface:** Marrón/Gris oscuro (`#332014`) usado para crear tarjetas de contraste (como la tarjeta Owes del referente).
- **Feel:** Orgánico, flotante, limpio. No hay líneas divisorias duras; el espacio y las sombras separan los componentes.

## Token Architecture

```css
/* Core */
--background: #F0F2F5;      /* gris ultra claro */
--foreground: #1E1E24;      /* gris casi negro */
--card: #FFFFFF;            /* blanco puro flotante */
--card-foreground: #1E1E24;
--border: #E8EAED;          /* bordes muy tenues si se necesitan */
--muted: #F8F9FA;           /* fondos de inputs o estados inactivos */
--muted-foreground: #8A8A8E;/* gris medio para etiquetas secundarias */

/* Brand / Accent */
--primary: #F95B28;         /* Naranja vibrante (botón principal) */
--primary-foreground: #FFFFFF;
--secondary: #3B2A1D;       /* Marrón oscuro para contraste */
--secondary-foreground: #FFFFFF;
--accent: #FEF0EC;          /* Fondo muy claro naranja para estados activos */
--accent-foreground: #F95B28;

/* Sidebar / Nav */
--sidebar: #FFFFFF;         /* Píldora de sidebar blanca */
--sidebar-foreground: #8A8A8E;
--sidebar-accent: #F4F5F7;  /* hover state */
--sidebar-primary: #1E1E24; /* ícono activo negro/oscuro */
```

## Typography

- **Display/UI/Body:** `DM Sans` — Fuente amigable y redondeada que funciona bien con píldoras.
- **Data/Numbers:** Opcionalmente la misma fuente pero con `font-variant-numeric: tabular-nums`, o continuar usando `IBM Plex Mono` si hay códigos técnicos. En este estilo, la fuente principal se suele usar para todo.
- **Headings:** Pesos gruesos (`font-bold`) con color `#1E1E24`.
- **Labels:** Pesos medios (`font-medium`) con color `#8A8A8E`.

## Depth Strategy

**Flotación Neumórfica Suave (Modern Shadows).** Sin bordes duros.
```css
.shadow-modern {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01);
}
.shadow-modern-hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02);
}
```

## Spacing & Radius

- **Component padding:** Muy amplio. Las tarjetas grandes tienen `24px` a `32px` de padding.
- **Pills:** Para botones y menús: `border-radius: 9999px`.
- **Cards:** `border-radius: 20px` o `24px`.
- **Base unit:** `4px`.
- **Layout Gap:** `24px` entre el sidebar y el contenido principal, y entre tarjetas.

## Status Dots / Colors

- **Success / Completed:** `#4CAF50` (Punto verde + Texto verde tenue)
- **Warning / Pending:** `#FFC107` o `#F95B28` (Punto naranja + Texto naranja tenue)
- **Error:** `#F44336`

## Table Pattern

- Sin bordes externos.
- Filas separadas por bordes inferiores ultradelgados `#E8EAED` de opacidad baja o espacio en blanco puro.
- Cabeceras de tabla: Gris sutil, fuente pequeña `11px/12px`, peso medio.
- Avatares redondos para personas, IDs en color gris claro.

## Pill Navigation Pattern

El menú principal ya no es un sidebar estático pegado a la izquierda. Es una **píldora blanca horizontal** en el encabezado.
El sidebar izquierdo es solo una **píldora blanca vertical** pequeña con íconos utilitarios genéricos.
