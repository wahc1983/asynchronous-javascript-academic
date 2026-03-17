# Plan de Implementación: JavaScript Event Loop Presentation

## Visión General

Implementación incremental de una presentación web interactiva con Astro. Se construye de dentro hacia afuera: primero la estructura base y los tipos de datos, luego los componentes visuales estáticos, después la lógica de animación del Event Loop, y finalmente el playground de código y los detalles de accesibilidad.

## Tareas

- [x] 1. Inicializar proyecto Astro y estructura base
  - Crear proyecto Astro con `npm create astro@latest` (template minimal)
  - Instalar dependencia CodeMirror 6: `@codemirror/view`, `@codemirror/state`, `@codemirror/lang-javascript`, `@codemirror/theme-one-dark`
  - Crear estructura de carpetas: `src/components/`, `src/data/`, `src/styles/`
  - Definir CSS custom properties globales (paleta de colores, tipografía, espaciado) en `src/styles/global.css`
  - _Requisitos: 6.1_

- [x] 2. Definir tipos de datos y ejemplos predefinidos
  - [x] 2.1 Crear `src/types.ts` con las interfaces `AnimationBlock`, `AnimationAction`, `AnimationStep`, `PredefinedExample`, `PresentationState` y `SlideDefinition`
    - _Requisitos: 2.2, 2.3, 2.4, 2.5, 5.1_

  - [x] 2.2 Crear `src/data/examples.ts` con los 5 ejemplos predefinidos del Event Loop
    - Ejemplo 1: `setTimeout` básico
    - Ejemplo 2: `Promise.resolve()` (microtask)
    - Ejemplo 3: `async/await`
    - Ejemplo 4: `queueMicrotask`
    - Ejemplo 5: Mezcla de macro y microtareas (setTimeout + Promise)
    - Cada ejemplo incluye `code`, `steps: AnimationStep[]` con `narratorText` en español y `codeLine`
    - _Requisitos: 5.1, 3.3_

- [x] 3. Implementar el Navigator
  - [x] 3.1 Crear `src/components/Navigator.astro` con botones Anterior/Siguiente e indicador "N / Total"
    - Leer `currentIndex` y `total` desde atributos data del DOM
    - Emitir `CustomEvent("slide:change", { detail: { index } })` al hacer click
    - Deshabilitar botón Anterior en índice 0 y botón Siguiente en el último índice
    - Añadir `aria-label` descriptivos a ambos botones
    - Responder a teclas `ArrowLeft` / `ArrowRight` mediante listener global en `document`
    - _Requisitos: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 8.1, 8.4_

- [x] 4. Implementar el SlideContainer y las diapositivas de contenido
  - [x] 4.1 Crear `src/components/SlideContainer.astro` que escucha `slide:change` y aplica clase `active` a la diapositiva correspondiente
    - Las diapositivas inactivas usan `display: none` para preservar estado de islas
    - Transición CSS entre diapositivas de 300ms–500ms
    - _Requisitos: 1.1, 6.4_

  - [x] 4.2 Crear las 8 diapositivas de contenido estático como componentes Astro individuales en `src/components/slides/`
    - `Slide01Intro.astro` — Qué es JavaScript y por qué importa el Event Loop (Requisito 7.1)
    - `Slide02SingleThread.astro` — Concepto single-threaded con analogía visual SVG de caja registradora (Requisitos 7.2, 7.5)
    - `Slide03CallStack.astro` — Explicación del Call Stack con diagrama SVG
    - `Slide04WebAPIs.astro` — Explicación de Web APIs con diagrama SVG
    - `Slide05CallbackQueue.astro` — Explicación de Callback Queue con diagrama SVG
    - `Slide06MicrotaskQueue.astro` — Diferencia entre macro y microtareas con ejemplos cotidianos (Requisito 7.3)
    - `Slide07Visualizer.astro` — Diapositiva con el EventLoopVisualizer completo
    - `Slide08Summary.astro` — Resumen visual de todos los componentes y recursos (Requisito 7.4)
    - _Requisitos: 1.1, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 5. Implementar el EventLoopVisualizer
  - [x] 5.1 Crear `src/components/EventLoopVisualizer.astro` con el layout de los cuatro paneles (Call Stack, Web APIs, Callback Queue, Microtask Queue)
    - Cada panel tiene color distintivo, etiqueta visible y área de bloques
    - _Requisitos: 2.1, 2.7, 2.8_

  - [x] 5.2 Implementar la lógica de animación en `src/scripts/visualizer.ts`
    - Clase `VisualizerEngine` con estado interno: `steps`, `currentStep`, `isPlaying`, `speed`
    - Métodos: `load(steps)`, `play()`, `pause()`, `reset()`, `stepForward()`
    - Ejecutar acciones `push`, `pop`, `move`, `highlight`, `clear` sobre el DOM con animaciones CSS
    - Emitir `CustomEvent("loop:step", { detail: { text, stepIndex, codeLine } })` en cada paso
    - Manejo de errores: si `blockId` no existe en origen, loguear warning y continuar
    - _Requisitos: 2.2, 2.3, 2.4, 2.5, 2.6, 6.5_

  - [x] 5.3 Implementar animaciones CSS en `src/styles/visualizer.css`
    - Animaciones de entrada/salida de bloques en el Call Stack (slide-in/slide-out)
    - Animaciones de movimiento entre paneles (translate + fade)
    - Duración configurable via CSS custom property `--anim-duration` (300ms–1000ms)
    - Mínimo 30fps garantizado usando `transform` y `opacity` (propiedades composited)
    - _Requisitos: 6.4, 6.5_

- [x] 6. Implementar el Narrator y los PlaybackControls
  - [x] 6.1 Crear `src/components/Narrator.astro`
    - Renderiza `<div role="status" aria-live="polite">` que escucha `loop:step`
    - Actualiza el texto con el `narratorText` del paso actual
    - Mantiene el último texto visible cuando la animación está en pausa
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 8.3_

  - [x] 6.2 Crear `src/components/PlaybackControls.astro`
    - Botones: Play/Pausa, Reiniciar, Paso a Paso con `aria-label` descriptivos en español
    - Slider de velocidad con tres posiciones: lento (1000ms), normal (600ms), rápido (300ms)
    - Los botones emiten eventos que el `VisualizerEngine` escucha: `loop:play`, `loop:pause`, `loop:reset`, `loop:step-forward`, `loop:speed-change`
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 8.1_

- [ ] 7. Checkpoint — Verificar visualizador completo
  - Asegurarse de que el visualizador anima correctamente los 5 tipos de acciones
  - Verificar que el Narrator se sincroniza con cada paso
  - Verificar que Play/Pausa/Reiniciar/Paso a Paso funcionan correctamente
  - Verificar que el slider de velocidad cambia la duración de las animaciones
  - Preguntar al usuario si hay ajustes antes de continuar.

- [x] 8. Implementar el CodePlayground
  - [x] 8.1 Crear `src/components/CodePlayground.astro` con selector de ejemplos y botón "Ejecutar"
    - Renderizar lista de ejemplos predefinidos desde `src/data/examples.ts`
    - Al seleccionar un ejemplo: cargar código en el editor y emitir `CustomEvent("loop:load", { detail: { steps } })`
    - Al pulsar "Ejecutar": emitir `CustomEvent("loop:play")`
    - _Requisitos: 5.1, 5.2, 5.4_

  - [x] 8.2 Integrar CodeMirror 6 en el CodePlayground
    - Inicializar editor con `javascript()` language support y tema oscuro
    - Mostrar código con resaltado de sintaxis
    - Implementar decoración de línea activa: escuchar `loop:step` y aplicar `StateEffect` para resaltar `step.codeLine`
    - Degradar gracefully a `<pre>` con CSS si CodeMirror falla al cargar
    - _Requisitos: 5.3, 5.5_

- [x] 9. Ensamblar la página principal y verificar responsive
  - [x] 9.1 Crear `src/pages/index.astro` ensamblando todos los componentes
    - Definir el array `slides: SlideDefinition[]` con las 8 diapositivas
    - Montar `Navigator`, `SlideContainer` con todas las diapositivas, y la diapositiva del visualizador con `EventLoopVisualizer`, `Narrator`, `PlaybackControls` y `CodePlayground`
    - Inicializar el estado global `PresentationState` en un script inline
    - _Requisitos: 1.1, 1.6_

  - [x] 9.2 Implementar mensaje de pantalla pequeña en `src/components/SmallScreenWarning.astro`
    - Mostrar con CSS `@media (max-width: 767px)` y ocultar la presentación principal
    - _Requisitos: 6.3_

- [x] 10. Checkpoint final — Revisión completa
  - Verificar navegación completa entre las 8 diapositivas con teclado y botones
  - Verificar que los 5 ejemplos del playground cargan y animan correctamente
  - Verificar que todos los botones tienen `aria-label`
  - Verificar que el mensaje de pantalla pequeña aparece en viewports < 768px
  - Preguntar al usuario si hay ajustes finales antes de dar por completada la implementación.

## Notas

- El estado global entre islas se comunica exclusivamente via `CustomEvent` en `document`
- Las diapositivas inactivas usan `display: none` (no `visibility: hidden`) para evitar que CodeMirror y el visualizador consuman recursos en segundo plano
- Los `AnimationStep[]` de cada ejemplo están precalculados en `src/data/examples.ts`, no hay parsing de código en runtime
- La prioridad de microtareas sobre macrotareas (Requisito 2.6) está codificada en el orden de los pasos de cada ejemplo, no en un scheduler dinámico
