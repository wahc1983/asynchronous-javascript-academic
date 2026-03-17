# JavaScript Event Loop & Web Workers — Presentación Interactiva

Presentación visual e interactiva para aprender cómo funciona el **Event Loop de JavaScript** y el **paralelismo con Web Workers**, construida con [Astro](https://astro.build) y TypeScript.

## Demo

Navega por los slides con las flechas del teclado (`←` `→`) o los botones en pantalla.

---

## Contenido

### Sección 1 — JavaScript Event Loop

| Slide | Tema |
|-------|------|
| 01 | Introducción al Event Loop |
| 02 | JavaScript es single-threaded |
| 03 | El Call Stack |
| 04 | Web APIs |
| 05 | Callback Queue |
| 06 | Microtask Queue |
| 07 | Visualizador interactivo |
| 08 | Resumen |

### Sección 2 — Web Workers y Paralelismo

| Slide | Tema |
|-------|------|
| WW01 | ¿Qué es un Web Worker? (Dedicated, Shared, Service) |
| WW02 | El problema del hilo bloqueado |
| WW03 | Main Thread vs Worker Thread |
| WW04 | Comunicación por mensajes (postMessage / structured clone) |
| WW05 | Casos de uso reales |
| WW06 | Visualizador interactivo de Workers |
| WW07 | Resumen, limitaciones y buenas prácticas |

---

## Stack

- [Astro 4](https://astro.build) — framework estático
- [TypeScript](https://www.typescriptlang.org)
- [CodeMirror 6](https://codemirror.net) — editor de código embebido
- SVG animado + CSS puro para los visualizadores

---

## Instalación y uso

```bash
npm install
npm run dev
```

Abre `http://localhost:4321` en el navegador.

### Otros comandos

```bash
npm run build    # genera el sitio estático en /dist
npm run preview  # previsualiza el build
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── slides/          # Slides del Event Loop (Slide01–08) y Web Workers (SlideWW01–07)
│   ├── EventLoopVisualizer.astro
│   ├── WorkersVisualizer.astro
│   ├── CodePlayground.astro
│   ├── WorkersCodePlayground.astro
│   ├── Navigator.astro
│   ├── PlaybackControls.astro
│   ├── WorkersPlaybackControls.astro
│   ├── Narrator.astro
│   ├── WorkersNarrator.astro
│   └── Mascot.astro
├── data/
│   ├── examples.ts       # Ejemplos del Event Loop
│   └── workerExamples.ts # Ejemplos de Web Workers
├── scripts/
│   ├── visualizer.ts
│   ├── workersVisualizer.ts
│   └── workerStepsParser.ts
├── styles/
│   ├── global.css
│   └── visualizer.css
├── pages/
│   └── index.astro
└── types.ts
```
