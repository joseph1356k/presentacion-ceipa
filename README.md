# CEIPA × Miracle — "Cómo la IA va a humanizar la medicina de nuevo"

**En vivo:** https://presentacion-ceipa.vercel.app

Cada `git push` a `main` la vuelve a desplegar automáticamente.

Presentación HTML interactiva de **23 slides** para una charla de 30 minutos:
**~15 min de slides + ~10 min de demos en vivo + ~5 min de preguntas.**

Un solo hilo visual —**el pulso**— recorre toda la presentación: empieza como signo vital, se anuda en la fricción, teje la capa de Miracle, converge en el hiperenfoque, se ramifica hacia computer use y termina **convertido en la sonrisa de la marca**.

## Cómo abrirla

**Doble clic en `index.html`.** Nada más. Funciona sin servidor y sin internet (fuentes, GSAP y assets van incluidos).

El día de la charla:

1. Abrir `index.html`
2. Presionar `F` (pantalla completa)
3. Dejarla en la slide 1 mientras entra la gente — es una pantalla de espera con el logo respirando
4. `→` para arrancar

Si el navegador se cierra a mitad de charla, **reabrir el archivo restaura la slide y el beat exactos** (la posición vive en la URL, p. ej. `#s14b2`).

## Atajos

| Tecla | Acción |
|---|---|
| `→` · `Espacio` · `AvPág` | avanzar beat / slide (compatible con presentador remoto) |
| `←` · `RePág` | volver (restaura el estado sin romper nada) |
| `F` | pantalla completa |
| `B` | pantalla en negro (para hablar sin slide) |
| `Inicio` / `Fin` | primera / última slide |
| `?` | ayuda de atajos |

## Guion de tiempos — 15 minutos

50 beats en total. El ritmo objetivo es **~18 segundos por beat**.

| Slides | Bloque | Tiempo |
|---|---|---|
| 1 | Espera (logo) | — |
| 2–7 | **Acto I** · el problema y la tesis | ~4:30 |
| 8–12 | **Acto II** · Miracle, IÜ y el criterio clínico | ~3:30 |
| 13 | Portal → **demo Miracle Notes** | ~0:20 + demo |
| 14 | Portal → **demo Operations** | ~0:20 + demo |
| 15 | Lo que acabamos de ver | ~0:50 |
| 16–22 | **Acto III** · hiperenfoque, expansión, cierre | ~5:00 |
| 23 | Marca final | ~0:20 |

**Si te alargas en las demos**, estas dos slides se pueden pasar rápido o saltar sin romper la narrativa (están marcadas como `[COMPRIMIBLE]` en el HTML):

- **Slide 5** — «Y el costo no se queda en el consultorio»
- **Slide 19** — «Preferimos decirlo con precisión»

## Las demos en vivo

Las slides 13 y 14 son **portales**: al avanzar un beat más, el deck se atenúa y aparece la etiqueta "Demo en vivo". Ahí se hace `Alt+Tab` al producto real. Al volver, la presentación está en un estado de reposo elegante — se continúa con `→`.

## Estructura de los actos

| Acto | Slides | Mundo visual |
|---|---|---|
| I — Medicina | 1–7 | luz clínica, línea cyan |
| II — Miracle | 8–15 | azul profundo (la marca "enciende" su mundo en la slide 9) |
| III — Visión | 16–23 | negro y dorado (corte de acto en HIPERENFOCARSE) |

Los colores nunca saltan por slide: las variables del tema se animan en los límites de capítulo.

## La marca

El logo y IÜ están reconstruidos en HTML/SVG con `currentColor`, así que **se adaptan solos** a cada acto: navy sobre blanco, blanco sobre azul, crema sobre negro. No hay que mantener tres versiones.

La sonrisa del logo y la boca de IÜ son el mismo gesto — por eso el hilo termina transformándose en ella (slide 23).

En `assets/brand/`: `miracle-logo-aura.jpg` se usa tal cual en la pantalla de espera; `iu-face.png` queda solo como referencia de la marca (en el deck IÜ es SVG).

## Cómo editar

- **Textos:** todos viven en `index.html`, en las `<section>` — editar y recargar. No hay que tocar JavaScript.
- **Posiciones:** el canvas es fijo de 1920×1080; los elementos usan px absolutos (inline o en `css/slides.css`).
  ⚠️ Si un elemento se posiciona con `transform: translate(...)` **y** el motion le anima `x`/`y`, GSAP sobrescribe el transform. Posicionar solo con `top`/`left` en esos casos.
- **Colores por acto:** objeto `THEMES` al inicio de `js/deck.js`.
- **Coreografía / beats:** `js/slides/cap1.js` (1–7), `cap2.js` (8–15), `cap3.js` (16–23). Cada slide es un timeline GSAP con labels `b0…bN`.
- **Estados del hilo:** `js/pulse.js` (`STATES`, en coordenadas del canvas 1920×1080).

## Estructura

```
index.html            ← las 23 slides, todo el copy
css/tokens.css        ← fuentes, temas, tipografía
css/base.css          ← stage 16:9, HUD, overlays, marca (logo + IÜ)
css/slides.css        ← composición por slide
js/deck.js            ← motor (beats, hash, temas, teclado)
js/pulse.js           ← el hilo: estados y morphs
js/slides/cap*.js     ← coreografía por acto
js/vendor/            ← GSAP + plugins (local)
assets/fonts/         ← Space Grotesk, Inter, Instrument Serif (local)
assets/brand/         ← logo con aura + cara de IÜ (PNG originales)
```
