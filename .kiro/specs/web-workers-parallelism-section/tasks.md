# Implementation Plan: Web Workers Parallelism Section

## Overview

Extensión de la presentación Astro existente para añadir una Landing Screen (índice 0), re-indexar la sección Event Loop (índices 1–8) y crear la sección Web Workers (índices 9–15). Se siguen los mismos patrones arquitectónicos del código existente: bus de eventos DOM, componentes Astro con scripts de isla, y TypeScript para la lógica de animación.

## Tasks

- [x] 1. Extender tipos TypeScript para Web Workers
  - Añadir a `src/types.ts` los tipos: `WorkerThreadId`, `ThreadStatus`, `WorkerAnimationAction`, `WorkerAnimationStep`, `WorkerPredefinedExample`
  - No modificar los tipos existentes
  - _Requirements: 11.1, 11.2, 11.3_

  - [ ]* 1.1 Escribir función guard `isWorkerAnimationStep` y `parseWorkerSteps`
    - Implementar en `src/types.ts` o en un módulo auxiliar `src/scripts/workerStepsParser.ts`
    - _Requirements: 11.3_

- [x] 2. Crear datos de ejemplos de Web Workers
  - Crear `src/data/workerExamples.ts` con al menos 3 `WorkerPredefinedExample` (comunicación básica, Transferable Objects, cálculo intensivo)
  - Cada ejemplo incluye `mainCode`, `workerCode` y `steps: WorkerAnimationStep[]`
  - _Requirements: 8.1, 8.2_

  - [ ]* 2.1 Escribir test de propiedad P14: Round-trip de serialización de WorkerAnimationStep
    - **Property 14: Round-trip de serialización**
    - **Validates: Requirements 11.1, 11.2**

  - [ ]* 2.2 Escribir test de propiedad P15: Rechazo de pasos malformados
    - **Property 15: Rechazo de pasos malformados en deserialización**
    - **Validates: Requirements 11.3**

- [x] 3. Implementar WorkersVisualizerEngine
  - Crear `src/scripts/workersVisualizer.ts` con la clase `WorkersVisualizerEngine`
  - Escucha eventos `workers:load`, `workers:play`, `workers:pause`, `workers:reset`, `workers:step-forward`, `workers:speed-change`
  - Emite `workers:step` con `{ text, stepIndex, codeLine?, workerCodeLine? }`
  - Soporta acciones: `push-main`, `push-worker`, `pop-main`, `pop-worker`, `send-to-worker`, `send-to-main`, `set-status`, `highlight-main`, `highlight-worker`, `clear`
  - En `pop-*` y `send-to-*` con `blockId` inexistente: `console.warn` y continuar (no interrumpir)
  - En `load()` con steps vacíos: emitir `workers:step` con texto de error en español
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.7, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 3.1 Escribir test de propiedad P5: Mensajes aparecen en carril destino
    - **Property 5: Los mensajes entre hilos aparecen en el carril destino**
    - **Validates: Requirements 5.2, 5.3**

  - [ ]* 3.2 Escribir test de propiedad P6: Indicador de estado refleja set-status
    - **Property 6: El indicador de estado del hilo refleja la acción set-status**
    - **Validates: Requirements 5.6**

  - [ ]* 3.3 Escribir test de propiedad P8: Reset restaura estado inicial
    - **Property 8: El reinicio restaura el estado inicial del Workers Visualizer**
    - **Validates: Requirements 7.2**

  - [ ]* 3.4 Escribir test de propiedad P9: Modo paso a paso no avanza automáticamente
    - **Property 9: El modo paso a paso no avanza automáticamente**
    - **Validates: Requirements 7.4**

- [x] 4. Checkpoint — Verificar que todos los tests pasan
  - Asegurarse de que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 5. Crear componente WorkersVisualizer
  - Crear `src/components/WorkersVisualizer.astro`
  - Renderiza dos carriles verticales: `main` (izquierda) y `worker` (derecha) con etiquetas visibles
  - Cada carril tiene: indicador de estado (`idle`/`working`/`sending`), área de bloques (`id="blocks-main"`, `id="blocks-worker"`)
  - Canal de mensajes central con área de animación para bloques en tránsito
  - Instancia `WorkersVisualizerEngine` en el script de isla
  - Colores diferenciados: `--color-main-thread` para Main Thread, `--color-worker-thread` para Worker Thread
  - _Requirements: 5.1, 5.4, 5.5, 5.6_

  - [ ]* 5.1 Escribir test de propiedad P7: Narrator sincronizado con cada paso
    - **Property 7: El Narrator se sincroniza con cada paso del Workers Visualizer**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 6. Crear componente WorkersPlaybackControls
  - Crear `src/components/WorkersPlaybackControls.astro`
  - Botones: Play/Pausa (`id="ww-btn-play-pause"`), Reiniciar (`id="ww-btn-reset"`), Paso a Paso (`id="ww-btn-step"`)
  - Slider de velocidad: `min="0"`, `max="2"`, `step="1"`, valores lento/normal/rápido
  - Emite eventos `workers:play`, `workers:pause`, `workers:reset`, `workers:step-forward`, `workers:speed-change`
  - Todos los botones con `aria-label` descriptivo no vacío
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 10.1_

  - [ ]* 6.1 Escribir test de propiedad P12: Todos los botones tienen aria-label no vacío
    - **Property 12: Todos los botones de control nuevos tienen aria-label no vacío**
    - **Validates: Requirements 10.1, 10.2**

- [x] 7. Crear componente WorkersCodePlayground
  - Crear `src/components/WorkersCodePlayground.astro`
  - Selector de ejemplos (`<select>`) poblado desde `workerExamples`
  - Pestañas "Hilo Principal" / "Worker" para alternar entre `mainCode` y `workerCode`
  - Editor CodeMirror 6 con fallback `<pre>` si CodeMirror falla
  - Al seleccionar ejemplo: emite `workers:load` con los pasos y `workers:reset`
  - Escucha `workers:step` y resalta la línea `codeLine` (pestaña main) o `workerCodeLine` (pestaña worker)
  - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

  - [ ]* 7.1 Escribir test de propiedad P10: Seleccionar ejemplo carga código y pasos correctamente
    - **Property 10: Seleccionar un ejemplo carga código y pasos correctamente**
    - **Validates: Requirements 8.2**

  - [ ]* 7.2 Escribir test de propiedad P11: Línea resaltada sincronizada con paso activo
    - **Property 11: La línea de código resaltada se sincroniza con el paso activo**
    - **Validates: Requirements 8.5**

- [x] 8. Crear componente WorkersNarrator
  - Crear `src/components/WorkersNarrator.astro` (copia mínima de `Narrator.astro` que escucha `workers:step`)
  - Región `aria-live="polite"` que muestra `narratorText` de cada paso
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 10.3_

- [x] 9. Checkpoint — Verificar que todos los tests pasan
  - Asegurarse de que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 10. Crear componente SectionCard
  - Crear `src/components/SectionCard.astro` con props: `title`, `description`, `targetIndex`, `accentColor`, `ariaLabel`
  - Al hacer clic emite `CustomEvent("slide:change", { index: targetIndex })`
  - Animación CSS en hover
  - Atributo `aria-label` con el valor de la prop `ariaLabel`
  - _Requirements: 1.2, 1.3, 1.4, 10.2_

  - [ ]* 10.1 Escribir test de propiedad P1: Navegación por SectionCard lleva al índice correcto
    - **Property 1: Navegación por SectionCard lleva al índice correcto**
    - **Validates: Requirements 1.3, 1.4**

- [x] 11. Crear diapositiva SlideLanding (índice 0)
  - Crear `src/components/slides/SlideLanding.astro`
  - Muestra título, subtítulo y dos `SectionCard`: Event Loop (`targetIndex=1`) y Web Workers (`targetIndex=9`)
  - Distinción visual concurrencia vs. paralelismo
  - Consistente con el tema visual existente
  - _Requirements: 1.1, 1.2, 1.5, 1.6_

- [x] 12. Crear diapositivas conceptuales de Web Workers (WW01–WW05)
  - Crear `src/components/slides/SlideWW01Intro.astro` — qué es un Web Worker y su propósito
  - Crear `src/components/slides/SlideWW02BlockedThread.astro` — problema del hilo bloqueado con analogía SVG embebida
  - Crear `src/components/slides/SlideWW03Threads.astro` — diagrama SVG de Main Thread vs Worker Thread en paralelo
  - Crear `src/components/slides/SlideWW04Messages.astro` — postMessage/message, diagrama bidireccional SVG, structured clone
  - Crear `src/components/slides/SlideWW05UseCases.astro` — al menos 3 casos de uso reales
  - Todas las diapositivas con analogías visuales deben incluir `<svg>` embebido
  - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4_

  - [ ]* 12.1 Escribir test de propiedad P4: Diapositivas con analogías contienen SVG embebido
    - **Property 4: Las diapositivas con analogías visuales contienen SVG embebido**
    - **Validates: Requirements 3.4**

- [x] 13. Crear diapositiva SlideWW06Visualizer (índice 14)
  - Crear `src/components/slides/SlideWW06Visualizer.astro`
  - Layout de dos columnas: izquierda (`WorkersVisualizer` + `WorkersPlaybackControls`), derecha (`WorkersCodePlayground` + `WorkersNarrator`)
  - Importar y componer los cuatro componentes nuevos
  - _Requirements: 5.1, 6.1, 7.1, 8.1_

- [x] 14. Crear diapositiva SlideWW07Summary (índice 15)
  - Crear `src/components/slides/SlideWW07Summary.astro`
  - Diagrama SVG completo de arquitectura Main Thread + Worker Thread + Message Channel
  - Tabla comparativa Event Loop vs Web Workers con al menos 4 dimensiones
  - Sección de recursos adicionales (MDN Web Workers API, etc.)
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 15. Añadir variables CSS para Web Workers
  - Añadir a `src/styles/global.css` las variables: `--color-main-thread`, `--color-main-thread-bg`, `--color-worker-thread`, `--color-worker-thread-bg`, `--color-message-block`, `--color-message-block-bg`
  - _Requirements: 2.5, 5.5_

- [x] 16. Actualizar index.astro para integrar todas las diapositivas
  - Importar `SlideLanding`, `SlideWW01Intro`–`SlideWW07Summary` y los componentes de la sección WW
  - Re-indexar las diapositivas existentes: `SlideLanding` → índice 0, `Slide01Intro`–`Slide08Summary` → índices 1–8
  - Añadir diapositivas WW en índices 9–15
  - Actualizar `TOTAL_SLIDES` de 8 a 16
  - Añadir layout de dos columnas para `SlideWW06Visualizer` (análogo al layout existente de `Slide07Visualizer`)
  - _Requirements: 1.1, 2.2, 2.3, 2.4_

  - [ ]* 16.1 Escribir test de propiedad P2: Botones de navegación deshabilitados en extremos
    - **Property 2: Botones de navegación se deshabilitan en los extremos**
    - **Validates: Requirements 1.7, 2.4**

  - [ ]* 16.2 Escribir test de propiedad P3: Indicador del Navigator refleja estado actual
    - **Property 3: El indicador del Navigator refleja el estado actual**
    - **Validates: Requirements 2.3**

- [x] 17. Checkpoint final — Verificar integración completa
  - Asegurarse de que todos los tests pasan y la presentación navega correctamente entre las 16 diapositivas, preguntar al usuario si surgen dudas.

## Notes

- Las sub-tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los tests de propiedad validan invariantes universales del sistema
- El bus de eventos `workers:*` es independiente del bus `loop:*` existente para evitar interferencias
