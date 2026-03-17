# Requirements Document

## Introduction

Presentación web interactiva construida con Astro que explica de forma didáctica y visual el funcionamiento del Event Loop de JavaScript. Dirigida a una audiencia variada de ingenieros, incluyendo aquellos sin conocimiento previo de JavaScript. La presentación combina animaciones, visualizaciones en tiempo real y ejemplos interactivos para hacer el concepto accesible y entretenido.

## Glossary

- **Presentation**: La aplicación web completa construida con Astro que contiene todas las diapositivas y componentes interactivos.
- **Slide**: Unidad individual de contenido dentro de la presentación, navegable de forma secuencial.
- **Event_Loop_Visualizer**: Componente interactivo que muestra animadamente el ciclo del Event Loop con sus partes (Call Stack, Web APIs, Callback Queue, Microtask Queue).
- **Call_Stack**: Representación visual de la pila de llamadas de JavaScript.
- **Callback_Queue**: Representación visual de la cola de callbacks (macrotasks).
- **Microtask_Queue**: Representación visual de la cola de microtareas (Promises, queueMicrotask).
- **Web_APIs**: Representación visual del entorno del navegador que procesa operaciones asíncronas.
- **Code_Playground**: Componente que permite al usuario escribir o seleccionar código JavaScript y observar su ejecución paso a paso en el visualizador.
- **Navigator**: Componente de navegación entre diapositivas.
- **Narrator**: Sistema de texto explicativo que describe cada paso de la animación en lenguaje accesible.

---

## Requirements

### Requirement 1: Estructura de Presentación por Diapositivas

**User Story:** Como ingeniero asistente a la presentación, quiero navegar por diapositivas ordenadas secuencialmente, para que pueda seguir el contenido a mi propio ritmo y no perder el hilo narrativo.

#### Acceptance Criteria

1. THE Presentation SHALL organizarse en un mínimo de 8 diapositivas temáticas que cubran: introducción, JavaScript single-thread, el Call Stack, Web APIs, Callback Queue, Microtask Queue, el Event Loop completo y ejemplos prácticos.
2. WHEN el usuario presiona la tecla de flecha derecha o el botón "Siguiente", THE Navigator SHALL avanzar a la siguiente diapositiva.
3. WHEN el usuario presiona la tecla de flecha izquierda o el botón "Anterior", THE Navigator SHALL retroceder a la diapositiva anterior.
4. WHEN el usuario se encuentra en la primera diapositiva, THE Navigator SHALL deshabilitar la acción de retroceso.
5. WHEN el usuario se encuentra en la última diapositiva, THE Navigator SHALL deshabilitar la acción de avance.
6. THE Navigator SHALL mostrar el número de diapositiva actual y el total (ej. "3 / 10") en todo momento.
7. WHERE el dispositivo soporte teclado, THE Presentation SHALL responder a las teclas de flecha izquierda y derecha para navegar entre diapositivas.

---

### Requirement 2: Visualizador Animado del Event Loop

**User Story:** Como ingeniero sin experiencia en JavaScript, quiero ver una representación visual animada del Event Loop, para que pueda entender intuitivamente cómo fluyen las tareas sin necesidad de leer código.

#### Acceptance Criteria

1. THE Event_Loop_Visualizer SHALL mostrar simultáneamente los cuatro componentes: Call Stack, Web APIs, Callback Queue y Microtask Queue.
2. WHEN una función es invocada, THE Event_Loop_Visualizer SHALL animar la entrada de un bloque representando esa función en el Call Stack.
3. WHEN una función termina su ejecución, THE Event_Loop_Visualizer SHALL animar la salida del bloque del Call Stack.
4. WHEN una operación asíncrona es iniciada (ej. setTimeout, fetch), THE Event_Loop_Visualizer SHALL animar el movimiento del bloque hacia el área de Web APIs.
5. WHEN una operación asíncrona completa en Web APIs, THE Event_Loop_Visualizer SHALL animar el movimiento del callback hacia la Callback Queue o Microtask Queue según corresponda.
6. WHEN el Call Stack está vacío, THE Event_Loop_Visualizer SHALL animar el Event Loop tomando el siguiente elemento de la Microtask Queue antes que de la Callback Queue.
7. THE Event_Loop_Visualizer SHALL usar colores distintos para diferenciar visualmente cada componente (Call Stack, Web APIs, Callback Queue, Microtask Queue).
8. THE Event_Loop_Visualizer SHALL mostrar el nombre o descripción de cada componente con una etiqueta visible.

---

### Requirement 3: Narración Contextual por Pasos

**User Story:** Como ingeniero con poca experiencia en JavaScript, quiero leer una explicación en texto de cada paso de la animación, para que pueda entender qué está ocurriendo sin necesidad de inferirlo solo de la visualización.

#### Acceptance Criteria

1. WHEN el Event_Loop_Visualizer ejecuta un paso de animación, THE Narrator SHALL mostrar un texto explicativo correspondiente a ese paso en lenguaje claro y sin jerga técnica innecesaria.
2. THE Narrator SHALL actualizar su contenido de forma sincronizada con cada transición de animación.
3. THE Narrator SHALL mostrar el texto en español.
4. WHEN una animación está en pausa, THE Narrator SHALL mantener visible el último texto mostrado.

---

### Requirement 4: Control de Reproducción de la Animación

**User Story:** Como presentador, quiero controlar la velocidad y el avance de la animación del Event Loop, para que pueda adaptar el ritmo de la explicación a las preguntas y reacciones de la audiencia.

#### Acceptance Criteria

1. THE Event_Loop_Visualizer SHALL ofrecer un botón de "Play/Pausa" para iniciar y detener la animación.
2. THE Event_Loop_Visualizer SHALL ofrecer un botón de "Reiniciar" que devuelva la visualización a su estado inicial.
3. THE Event_Loop_Visualizer SHALL ofrecer un botón de "Paso a Paso" que avance la animación un único paso por cada pulsación.
4. WHEN la animación está en modo "Paso a Paso", THE Event_Loop_Visualizer SHALL esperar la interacción del usuario antes de ejecutar el siguiente paso.
5. THE Event_Loop_Visualizer SHALL ofrecer un control deslizante de velocidad con al menos tres niveles: lento, normal y rápido.

---

### Requirement 5: Playground de Código Interactivo

**User Story:** Como ingeniero con experiencia en JavaScript, quiero escribir o seleccionar fragmentos de código y ver cómo se ejecutan en el visualizador, para que pueda experimentar con distintos escenarios y consolidar mi comprensión.

#### Acceptance Criteria

1. THE Code_Playground SHALL ofrecer un mínimo de 5 ejemplos de código predefinidos que ilustren distintos comportamientos del Event Loop (ej. setTimeout, Promise, async/await, queueMicrotask, mezcla de macro y microtareas).
2. WHEN el usuario selecciona un ejemplo predefinido, THE Code_Playground SHALL cargar el código en el editor y reiniciar el Event_Loop_Visualizer con los pasos correspondientes a ese ejemplo.
3. THE Code_Playground SHALL mostrar el código con resaltado de sintaxis.
4. WHEN el usuario pulsa el botón "Ejecutar" en el Code_Playground, THE Event_Loop_Visualizer SHALL iniciar la animación correspondiente al código seleccionado.
5. THE Code_Playground SHALL resaltar visualmente la línea de código que se está ejecutando en cada paso de la animación, sincronizado con el Event_Loop_Visualizer.

---

### Requirement 6: Diseño Visual Atractivo y Responsivo

**User Story:** Como organizador de la presentación, quiero que la aplicación tenga un diseño moderno y atractivo, para que la audiencia se mantenga enganchada y la experiencia sea memorable.

#### Acceptance Criteria

1. THE Presentation SHALL aplicar un tema visual consistente con paleta de colores, tipografía y espaciado uniformes en todas las diapositivas.
2. THE Presentation SHALL ser funcional en pantallas con un ancho mínimo de 768px (tablets y escritorio).
3. WHEN la pantalla tiene un ancho menor a 768px, THE Presentation SHALL mostrar un mensaje indicando que la experiencia está optimizada para pantallas más grandes.
4. THE Presentation SHALL usar animaciones CSS o JavaScript con una duración entre 300ms y 1000ms para las transiciones entre diapositivas.
5. THE Event_Loop_Visualizer SHALL usar animaciones fluidas (mínimo 30fps) para el movimiento de bloques entre componentes.

---

### Requirement 7: Diapositivas de Contenido Educativo

**User Story:** Como ingeniero sin conocimiento de JavaScript, quiero ver diapositivas con explicaciones conceptuales claras antes de ver la animación, para que pueda construir el contexto necesario para entender el visualizador.

#### Acceptance Criteria

1. THE Presentation SHALL incluir una diapositiva de introducción que explique qué es JavaScript y por qué el Event Loop es relevante, sin asumir conocimiento previo.
2. THE Presentation SHALL incluir una diapositiva que explique el concepto de "single-threaded" con una analogía visual (ej. una caja registradora con una sola cola).
3. THE Presentation SHALL incluir una diapositiva que explique la diferencia entre tareas síncronas y asíncronas con ejemplos cotidianos no técnicos.
4. THE Presentation SHALL incluir una diapositiva de cierre con un resumen visual de todos los componentes del Event Loop y recursos para profundizar.
5. WHEN una diapositiva contiene una analogía visual, THE Presentation SHALL mostrar la analogía mediante una ilustración o diagrama SVG embebido.

---

### Requirement 8: Accesibilidad Básica

**User Story:** Como asistente con necesidades de accesibilidad, quiero que la presentación sea navegable y comprensible con tecnologías de asistencia, para que pueda seguir el contenido de forma independiente.

#### Acceptance Criteria

1. THE Presentation SHALL asignar atributos `aria-label` descriptivos a todos los botones de control (navegación, play, pausa, reiniciar, paso a paso).
2. THE Presentation SHALL mantener un ratio de contraste de color mínimo de 4.5:1 entre texto y fondo en todas las diapositivas, conforme a WCAG 2.1 AA.
3. WHEN el Event_Loop_Visualizer ejecuta un paso de animación, THE Narrator SHALL actualizar una región `aria-live="polite"` para que los lectores de pantalla anuncien el texto explicativo.
4. THE Presentation SHALL ser completamente navegable usando únicamente el teclado.
