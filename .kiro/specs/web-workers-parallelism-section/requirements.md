# Requirements Document

## Introduction

Extensión de la presentación interactiva de JavaScript existente (construida con Astro) que añade dos cambios mayores:

1. **Pantalla de entrada (Landing)**: Una nueva diapositiva inicial que presenta los dos grandes enfoques de concurrencia en JavaScript — el Event Loop (concurrencia cooperativa, hilo único) y los Web Workers (paralelismo real, múltiples hilos) — y permite al usuario elegir qué sección explorar.

2. **Sección de Web Workers**: Una nueva sección completa de diapositivas que explica el paralelismo con Web Workers de forma didáctica y visual, con estructura análoga a la sección del Event Loop ya existente: diapositivas conceptuales, un visualizador animado de comunicación entre hilos, narración contextual y ejemplos de código interactivos.

La audiencia objetivo es la misma que la presentación existente: ingenieros con distintos niveles de experiencia en JavaScript.

---

## Glossary

- **Presentation**: La aplicación web completa construida con Astro que contiene todas las diapositivas y componentes interactivos.
- **Landing_Screen**: Nueva diapositiva inicial (índice 0) que presenta ambas secciones y permite al usuario elegir entre Event Loop y Web Workers.
- **Section_Card**: Elemento visual interactivo dentro del Landing_Screen que representa una sección (Event Loop o Web Workers) y actúa como punto de entrada a ella.
- **Event_Loop_Section**: El conjunto de diapositivas existentes sobre el Event Loop (actualmente diapositivas 1–8), ahora accesibles desde el Landing_Screen.
- **Web_Workers_Section**: El nuevo conjunto de diapositivas sobre Web Workers y paralelismo.
- **Web_Worker**: Hilo de ejecución secundario del navegador que corre JavaScript en paralelo al hilo principal, sin acceso al DOM.
- **Main_Thread**: El hilo principal de JavaScript donde corre el Event Loop y se gestiona el DOM.
- **Worker_Thread**: El hilo secundario gestionado por un Web Worker.
- **Message_Channel**: El mecanismo de comunicación entre Main_Thread y Worker_Thread mediante `postMessage` y el evento `message`.
- **Workers_Visualizer**: Nuevo componente interactivo que muestra animadamente la comunicación entre Main_Thread y Worker_Thread, incluyendo el envío y recepción de mensajes.
- **Navigator**: Componente de navegación entre diapositivas existente.
- **Narrator**: Sistema de texto explicativo sincronizado con las animaciones.
- **Code_Playground**: Componente que permite seleccionar y visualizar ejemplos de código paso a paso.
- **Slide**: Unidad individual de contenido dentro de la presentación, navegable de forma secuencial.

---

## Requirements

### Requirement 1: Pantalla de Entrada (Landing Screen)

**User Story:** Como asistente a la presentación, quiero ver una pantalla inicial que me presente los dos enfoques de JavaScript (concurrencia y paralelismo), para que pueda entender el contexto general y elegir qué sección explorar primero.

#### Acceptance Criteria

1. THE Presentation SHALL incluir un Landing_Screen como primera diapositiva (índice 0) que presente visualmente los dos enfoques: Event Loop (concurrencia) y Web Workers (paralelismo).
2. THE Landing_Screen SHALL mostrar dos Section_Cards, una para el Event Loop y otra para Web Workers, cada una con título, descripción breve y un icono o ilustración representativa.
3. WHEN el usuario hace clic en la Section_Card del Event Loop, THE Navigator SHALL navegar a la primera diapositiva de la Event_Loop_Section.
4. WHEN el usuario hace clic en la Section_Card de Web Workers, THE Navigator SHALL navegar a la primera diapositiva de la Web_Workers_Section.
5. THE Landing_Screen SHALL mostrar una distinción conceptual clara entre concurrencia (un hilo, tareas intercaladas) y paralelismo (múltiples hilos, tareas simultáneas).
6. THE Landing_Screen SHALL ser visualmente consistente con el tema y paleta de colores de la presentación existente.
7. WHEN el usuario se encuentra en el Landing_Screen, THE Navigator SHALL deshabilitar el botón "Anterior" por ser la primera diapositiva.

---

### Requirement 2: Estructura de la Sección Web Workers

**User Story:** Como ingeniero asistente a la presentación, quiero navegar por diapositivas ordenadas sobre Web Workers, para que pueda aprender el concepto de paralelismo de forma progresiva y estructurada.

#### Acceptance Criteria

1. THE Web_Workers_Section SHALL organizarse en un mínimo de 6 diapositivas temáticas que cubran: introducción a Web Workers, el problema del hilo bloqueado, qué es un Web Worker, comunicación por mensajes, casos de uso reales y resumen.
2. THE Web_Workers_Section SHALL integrarse en la secuencia de diapositivas existente de la Presentation, accesible desde el Landing_Screen y navegable con los controles existentes del Navigator.
3. THE Navigator SHALL mostrar el número de diapositiva actual y el total actualizado (incluyendo Landing_Screen, Event_Loop_Section y Web_Workers_Section) en todo momento.
4. WHEN el usuario se encuentra en la última diapositiva de la Web_Workers_Section, THE Navigator SHALL deshabilitar el botón "Siguiente".
5. THE Web_Workers_Section SHALL aplicar el mismo tema visual, paleta de colores y sistema de diseño que la Event_Loop_Section existente.

---

### Requirement 3: Diapositiva — Introducción a Web Workers

**User Story:** Como ingeniero sin experiencia en Web Workers, quiero una diapositiva introductoria que explique qué son y por qué existen, para que pueda construir el contexto necesario antes de ver el visualizador.

#### Acceptance Criteria

1. THE Web_Workers_Section SHALL incluir una diapositiva de introducción que explique qué es un Web Worker y cuál es su propósito, sin asumir conocimiento previo.
2. THE Web_Workers_Section SHALL incluir una diapositiva que explique el problema del "hilo bloqueado" (UI congelada) con una analogía visual no técnica (ej. una caja registradora con una cola bloqueada por un cliente lento).
3. THE Web_Workers_Section SHALL incluir una diapositiva que explique la diferencia entre el Main_Thread y el Worker_Thread con un diagrama visual que muestre ambos hilos corriendo en paralelo.
4. WHEN una diapositiva de la Web_Workers_Section contiene una analogía visual, THE Presentation SHALL mostrar la analogía mediante una ilustración o diagrama SVG embebido.

---

### Requirement 4: Diapositiva — Comunicación por Mensajes

**User Story:** Como ingeniero con conocimiento básico de JavaScript, quiero entender cómo se comunican el hilo principal y un Web Worker, para que pueda implementar soluciones con paralelismo real en mis proyectos.

#### Acceptance Criteria

1. THE Web_Workers_Section SHALL incluir una diapositiva que explique el Message_Channel (postMessage / evento message) como único mecanismo de comunicación entre Main_Thread y Worker_Thread.
2. THE Web_Workers_Section SHALL mostrar en esa diapositiva un diagrama visual del flujo de mensajes bidireccional: Main_Thread → Worker_Thread y Worker_Thread → Main_Thread.
3. THE Web_Workers_Section SHALL explicar en esa diapositiva que los datos se transfieren por copia (structured clone) y no por referencia, con un ejemplo visual de la diferencia.
4. THE Web_Workers_Section SHALL incluir una diapositiva de casos de uso reales que muestre al menos 3 escenarios donde los Web Workers aportan valor (ej. procesamiento de imágenes, cálculos intensivos, parsing de datos grandes).

---

### Requirement 5: Visualizador Animado de Web Workers

**User Story:** Como ingeniero sin experiencia en Web Workers, quiero ver una representación visual animada de la comunicación entre hilos, para que pueda entender intuitivamente cómo fluyen los mensajes sin necesidad de leer código.

#### Acceptance Criteria

1. THE Workers_Visualizer SHALL mostrar simultáneamente dos carriles: Main_Thread (izquierda) y Worker_Thread (derecha), con sus respectivas etiquetas visibles.
2. WHEN el Main_Thread envía un mensaje al Worker_Thread, THE Workers_Visualizer SHALL animar un bloque de mensaje viajando de izquierda a derecha entre los dos carriles.
3. WHEN el Worker_Thread envía un mensaje de respuesta al Main_Thread, THE Workers_Visualizer SHALL animar un bloque de mensaje viajando de derecha a izquierda entre los dos carriles.
4. THE Workers_Visualizer SHALL mostrar visualmente que el Worker_Thread puede ejecutar código en paralelo mientras el Main_Thread sigue respondiendo (ej. ambos carriles activos simultáneamente).
5. THE Workers_Visualizer SHALL usar colores distintos para diferenciar el Main_Thread y el Worker_Thread.
6. THE Workers_Visualizer SHALL mostrar el estado de cada hilo (idle / working / sending) con una etiqueta o indicador visual.
7. IF el Workers_Visualizer recibe un paso de animación con un blockId que no existe en el carril origen, THEN THE Workers_Visualizer SHALL registrar un warning en consola y continuar con el siguiente paso sin interrumpir la animación.

---

### Requirement 6: Narración Contextual para Web Workers

**User Story:** Como ingeniero con poca experiencia en Web Workers, quiero leer una explicación en texto de cada paso de la animación del visualizador, para que pueda entender qué está ocurriendo sin inferirlo solo de la visualización.

#### Acceptance Criteria

1. WHEN THE Workers_Visualizer ejecuta un paso de animación, THE Narrator SHALL mostrar un texto explicativo correspondiente a ese paso en español y en lenguaje claro.
2. THE Narrator SHALL actualizar su contenido de forma sincronizada con cada transición de animación del Workers_Visualizer.
3. WHEN la animación del Workers_Visualizer está en pausa, THE Narrator SHALL mantener visible el último texto mostrado.
4. WHEN THE Workers_Visualizer ejecuta un paso de animación, THE Narrator SHALL actualizar una región `aria-live="polite"` para que los lectores de pantalla anuncien el texto explicativo.

---

### Requirement 7: Control de Reproducción para Web Workers

**User Story:** Como presentador, quiero controlar la velocidad y el avance de la animación del Workers_Visualizer, para que pueda adaptar el ritmo de la explicación a las preguntas de la audiencia.

#### Acceptance Criteria

1. THE Workers_Visualizer SHALL ofrecer un botón de "Play/Pausa" para iniciar y detener la animación.
2. THE Workers_Visualizer SHALL ofrecer un botón de "Reiniciar" que devuelva la visualización a su estado inicial (ambos hilos vacíos, currentStep = 0, isPlaying = false).
3. THE Workers_Visualizer SHALL ofrecer un botón de "Paso a Paso" que avance la animación un único paso por cada pulsación.
4. WHEN la animación del Workers_Visualizer está en modo "Paso a Paso", THE Workers_Visualizer SHALL esperar la interacción del usuario antes de ejecutar el siguiente paso.
5. THE Workers_Visualizer SHALL ofrecer un control deslizante de velocidad con al menos tres niveles: lento, normal y rápido.

---

### Requirement 8: Playground de Código para Web Workers

**User Story:** Como ingeniero con experiencia en JavaScript, quiero seleccionar ejemplos de código de Web Workers y ver cómo se ejecutan en el visualizador, para que pueda experimentar con distintos escenarios de paralelismo.

#### Acceptance Criteria

1. THE Code_Playground SHALL ofrecer un mínimo de 3 ejemplos de código predefinidos específicos de Web Workers que ilustren: creación y comunicación básica, transferencia de datos con Transferable Objects, y un caso de uso real (ej. cálculo intensivo en background).
2. WHEN el usuario selecciona un ejemplo de Web Workers, THE Code_Playground SHALL cargar el código en el editor y reiniciar el Workers_Visualizer con los pasos correspondientes a ese ejemplo.
3. THE Code_Playground SHALL mostrar el código con resaltado de sintaxis.
4. WHEN el usuario pulsa el botón "Ejecutar" en el Code_Playground de la sección Web Workers, THE Workers_Visualizer SHALL iniciar la animación correspondiente al código seleccionado.
5. THE Code_Playground SHALL resaltar visualmente la línea de código que se está ejecutando en cada paso de la animación, sincronizado con el Workers_Visualizer.
6. THE Code_Playground SHALL mostrar tanto el código del hilo principal como el código del worker en pestañas o paneles separados, dado que un Web Worker es un archivo JavaScript independiente.

---

### Requirement 9: Diapositiva de Resumen de Web Workers

**User Story:** Como asistente a la presentación, quiero una diapositiva de cierre de la sección Web Workers que consolide lo aprendido, para que pueda llevarme una imagen mental clara del paralelismo en JavaScript.

#### Acceptance Criteria

1. THE Web_Workers_Section SHALL incluir una diapositiva de resumen que muestre un diagrama visual completo de la arquitectura Main_Thread + Worker_Thread con el Message_Channel.
2. THE Web_Workers_Section SHALL incluir en la diapositiva de resumen una tabla o lista comparativa entre Event Loop (concurrencia) y Web Workers (paralelismo) con al menos 4 dimensiones de comparación (ej. número de hilos, acceso al DOM, tipo de tareas, mecanismo de comunicación).
3. THE Web_Workers_Section SHALL incluir en la diapositiva de resumen recursos adicionales para profundizar (ej. MDN Web Docs: Web Workers API, ejemplos en GitHub).

---

### Requirement 10: Accesibilidad de la Nueva Sección

**User Story:** Como asistente con necesidades de accesibilidad, quiero que la nueva sección sea navegable y comprensible con tecnologías de asistencia, para que pueda seguir el contenido de forma independiente.

#### Acceptance Criteria

1. THE Presentation SHALL asignar atributos `aria-label` descriptivos a todos los botones de control nuevos (navegación del Landing_Screen, play, pausa, reiniciar, paso a paso del Workers_Visualizer).
2. THE Landing_Screen SHALL asignar atributos `aria-label` descriptivos a cada Section_Card que indiquen claramente su destino (ej. "Ir a la sección Event Loop" / "Ir a la sección Web Workers").
3. WHEN THE Workers_Visualizer ejecuta un paso de animación, THE Narrator SHALL actualizar una región `aria-live="polite"` para que los lectores de pantalla anuncien el texto explicativo.
4. THE Web_Workers_Section SHALL ser completamente navegable usando únicamente el teclado.
5. THE Web_Workers_Section SHALL mantener un ratio de contraste de color mínimo de 4.5:1 entre texto y fondo en todas sus diapositivas, conforme a WCAG 2.1 AA.

---

### Requirement 11: Serialización y Round-Trip de Pasos de Animación

**User Story:** Como desarrollador que mantiene la presentación, quiero que los pasos de animación de Web Workers sean serializables y deserializables sin pérdida de información, para que pueda exportar, importar y reutilizar secuencias de animación de forma confiable.

#### Acceptance Criteria

1. THE Presentation SHALL serializar los pasos de animación (`WorkerAnimationStep[]`) a JSON de forma que todos los campos requeridos se preserven.
2. FOR ALL arrays válidos de `WorkerAnimationStep`, serializar a JSON y luego deserializar SHALL producir un array equivalente al original (propiedad round-trip).
3. IF un objeto JSON deserializado no cumple el esquema de `WorkerAnimationStep`, THEN THE Presentation SHALL rechazarlo con un error descriptivo en lugar de producir un paso malformado.
