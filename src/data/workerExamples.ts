import type { WorkerPredefinedExample } from '../types';

export const workerExamples: WorkerPredefinedExample[] = [
  // ─── Ejemplo 1: Comunicación básica ─────────────────────────────────────────
  {
    id: 'basic-communication',
    title: '1. Comunicación básica',
    description:
      'El ejemplo más simple de Web Workers: el hilo principal crea un worker, le envía un mensaje con postMessage() y recibe la respuesta a través del evento "message".',
    mainCode: `// main.js — Hilo principal
const worker = new Worker('worker.js');

// Escuchar respuestas del worker
worker.onmessage = (event) => {
  console.log('Respuesta del worker:', event.data);
};

// Enviar mensaje al worker
worker.postMessage({ texto: '¡Hola, Worker!' });`,
    workerCode: `// worker.js — Hilo del worker
self.onmessage = (event) => {
  const { texto } = event.data;
  console.log('Worker recibió:', texto);

  // Procesar y responder
  const respuesta = texto.toUpperCase();
  self.postMessage({ respuesta });
};`,
    steps: [
      {
        action: { type: 'set-status', thread: 'main', status: 'working' },
        narratorText: 'El hilo principal comienza a ejecutarse.',
        codeLine: 1,
      },
      {
        action: { type: 'push-main', block: { id: 'create-worker', label: 'new Worker()' } },
        narratorText: 'El hilo principal crea un nuevo Web Worker. El navegador lanza un hilo separado para ejecutar worker.js.',
        codeLine: 2,
      },
      {
        action: { type: 'push-main', block: { id: 'register-onmessage', label: 'worker.onmessage = cb' } },
        narratorText: 'Se registra el listener onmessage para recibir respuestas del worker.',
        codeLine: 5,
      },
      {
        action: { type: 'set-status', thread: 'worker', status: 'idle' },
        narratorText: 'El worker está listo y esperando mensajes.',
        workerCodeLine: 1,
      },
      {
        action: { type: 'send-to-worker', blockId: 'msg-hello', label: 'postMessage()' },
        narratorText: 'El hilo principal envía un mensaje al worker con postMessage(). El mensaje viaja a través del canal de comunicación.',
        codeLine: 9,
      },
      {
        action: { type: 'set-status', thread: 'worker', status: 'working' },
        narratorText: 'El worker recibe el mensaje y comienza a procesarlo. ¡Ambos hilos pueden ejecutarse en paralelo!',
        workerCodeLine: 2,
      },
      {
        action: { type: 'push-worker', block: { id: 'worker-process', label: 'toUpperCase()' } },
        narratorText: 'El worker procesa el texto: convierte el mensaje a mayúsculas.',
        workerCodeLine: 7,
      },
      {
        action: { type: 'pop-worker', blockId: 'worker-process' },
        narratorText: 'El procesamiento termina. El worker prepara la respuesta.',
        workerCodeLine: 7,
      },
      {
        action: { type: 'send-to-main', blockId: 'msg-response', label: 'postMessage()' },
        narratorText: 'El worker envía la respuesta de vuelta al hilo principal con self.postMessage().',
        workerCodeLine: 8,
      },
      {
        action: { type: 'set-status', thread: 'worker', status: 'idle' },
        narratorText: 'El worker vuelve al estado idle, listo para recibir más mensajes.',
        workerCodeLine: 8,
      },
      {
        action: { type: 'push-main', block: { id: 'handle-response', label: 'onmessage callback' } },
        narratorText: 'El hilo principal recibe la respuesta. Se ejecuta el callback onmessage con los datos del worker.',
        codeLine: 5,
      },
      {
        action: { type: 'pop-main', blockId: 'handle-response' },
        narratorText: 'Se imprime la respuesta en consola. Comunicación completada con éxito.',
        codeLine: 6,
      },
      {
        action: { type: 'pop-main', blockId: 'register-onmessage' },
        narratorText: 'El listener permanece activo para futuros mensajes.',
        codeLine: 5,
      },
      {
        action: { type: 'pop-main', blockId: 'create-worker' },
        narratorText: 'El worker sigue vivo en segundo plano. Así funciona la comunicación básica entre hilos.',
        codeLine: 2,
      },
      {
        action: { type: 'clear' },
        narratorText: 'Comunicación básica completada. El hilo principal y el worker se comunican mediante mensajes, sin compartir memoria.',
      },
    ],
  },

  // ─── Ejemplo 2: Transferable Objects ────────────────────────────────────────
  {
    id: 'transferable-objects',
    title: '2. Transferable Objects',
    description:
      'Los Transferable Objects permiten transferir datos grandes (como ArrayBuffer) al worker SIN copiarlos. La propiedad se transfiere: el hilo original pierde el acceso y el worker lo gana instantáneamente.',
    mainCode: `// main.js — Transferir ArrayBuffer sin copia
const buffer = new ArrayBuffer(1024 * 1024); // 1 MB
const view = new Uint8Array(buffer);
view.fill(42); // Llenar con datos

const worker = new Worker('worker.js');

// Transferir el buffer (sin copia, O(1))
worker.postMessage({ buffer }, [buffer]);

// ¡El buffer ya no es accesible aquí!
console.log('byteLength:', buffer.byteLength); // 0

worker.onmessage = (event) => {
  console.log('Resultado:', event.data.suma);
};`,
    workerCode: `// worker.js — Recibir y procesar el buffer transferido
self.onmessage = (event) => {
  const { buffer } = event.data;
  const view = new Uint8Array(buffer);

  // Procesar los datos (el worker tiene acceso exclusivo)
  let suma = 0;
  for (let i = 0; i < view.length; i++) {
    suma += view[i];
  }

  // Devolver resultado (o re-transferir el buffer)
  self.postMessage({ suma });
};`,
    steps: [
      {
        action: { type: 'set-status', thread: 'main', status: 'working' },
        narratorText: 'El hilo principal comienza a preparar datos para transferir.',
        codeLine: 1,
      },
      {
        action: { type: 'push-main', block: { id: 'create-buffer', label: 'new ArrayBuffer(1MB)' } },
        narratorText: 'Se crea un ArrayBuffer de 1 MB en el hilo principal. Con postMessage normal, esto se copiaría entero al worker.',
        codeLine: 2,
      },
      {
        action: { type: 'push-main', block: { id: 'fill-data', label: 'view.fill(42)' } },
        narratorText: 'Se llena el buffer con datos. Imagina que son píxeles de una imagen o resultados de un sensor.',
        codeLine: 4,
      },
      {
        action: { type: 'push-main', block: { id: 'create-worker', label: 'new Worker()' } },
        narratorText: 'Se crea el worker que procesará los datos.',
        codeLine: 6,
      },
      {
        action: { type: 'set-status', thread: 'main', status: 'sending' },
        narratorText: 'El hilo principal se prepara para transferir el buffer. Con la lista de transferibles [buffer], la operación es O(1) — sin copia.',
        codeLine: 9,
      },
      {
        action: { type: 'send-to-worker', blockId: 'transfer-buffer', label: 'transfer ArrayBuffer' },
        narratorText: 'El ArrayBuffer se TRANSFIERE al worker. No se copia: la propiedad cambia de dueño. El hilo principal pierde el acceso instantáneamente.',
        codeLine: 9,
      },
      {
        action: { type: 'pop-main', blockId: 'create-buffer' },
        narratorText: 'El buffer ya no existe en el hilo principal. buffer.byteLength === 0. Intentar accederlo lanzaría un error.',
        codeLine: 12,
      },
      {
        action: { type: 'set-status', thread: 'main', status: 'idle' },
        narratorText: 'El hilo principal queda libre. No bloqueó esperando la transferencia.',
        codeLine: 12,
      },
      {
        action: { type: 'set-status', thread: 'worker', status: 'working' },
        narratorText: 'El worker recibe el buffer y tiene acceso exclusivo a él. Comienza el procesamiento intensivo.',
        workerCodeLine: 2,
      },
      {
        action: { type: 'push-worker', block: { id: 'worker-loop', label: 'for loop (1M iter)' } },
        narratorText: 'El worker itera sobre el millón de bytes del buffer. Este trabajo ocurre en un hilo separado, sin bloquear la UI.',
        workerCodeLine: 7,
      },
      {
        action: { type: 'pop-worker', blockId: 'worker-loop' },
        narratorText: 'Procesamiento completado. El worker calculó la suma de todos los bytes.',
        workerCodeLine: 10,
      },
      {
        action: { type: 'send-to-main', blockId: 'result-msg', label: '{ suma }' },
        narratorText: 'El worker envía solo el resultado (un número) de vuelta al hilo principal. No necesita re-transferir el buffer.',
        workerCodeLine: 13,
      },
      {
        action: { type: 'set-status', thread: 'worker', status: 'idle' },
        narratorText: 'El worker termina su trabajo y vuelve a idle.',
        workerCodeLine: 13,
      },
      {
        action: { type: 'push-main', block: { id: 'show-result', label: 'console.log(suma)' } },
        narratorText: 'El hilo principal recibe el resultado y lo muestra. Transferir 1 MB tomó microsegundos en lugar de milisegundos.',
        codeLine: 15,
      },
      {
        action: { type: 'pop-main', blockId: 'show-result' },
        narratorText: 'Resultado mostrado. Los Transferable Objects son esenciales para trabajar con datos grandes sin penalizar el rendimiento.',
        codeLine: 15,
      },
      {
        action: { type: 'clear' },
        narratorText: 'Ejemplo completado. Transferable Objects: transferencia O(1), sin copia, sin bloqueo del hilo principal.',
      },
    ],
  },

  // ─── Ejemplo 3: Cálculo intensivo en background ──────────────────────────────
  {
    id: 'heavy-computation',
    title: '3. Cálculo intensivo en background',
    description:
      'Un cálculo pesado (suma de números primos) ejecutado en un Web Worker. El hilo principal sigue respondiendo a la UI mientras el worker trabaja en paralelo en un núcleo separado.',
    mainCode: `// main.js — UI siempre responsiva
const worker = new Worker('worker.js');

// La UI sigue funcionando mientras el worker calcula
document.getElementById('btn').addEventListener('click', () => {
  console.log('UI responde mientras worker calcula');
});

worker.onmessage = (event) => {
  const { resultado, tiempo } = event.data;
  console.log(\`Suma de primos: \${resultado}\`);
  console.log(\`Tiempo: \${tiempo}ms\`);
};

// Iniciar cálculo intensivo en el worker
worker.postMessage({ limite: 1_000_000 });
console.log('Cálculo iniciado, UI libre...');`,
    workerCode: `// worker.js — Cálculo en hilo separado
function esPrimo(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

self.onmessage = (event) => {
  const { limite } = event.data;
  const inicio = performance.now();

  let suma = 0;
  for (let i = 2; i <= limite; i++) {
    if (esPrimo(i)) suma += i;
  }

  const tiempo = Math.round(performance.now() - inicio);
  self.postMessage({ resultado: suma, tiempo });
};`,
    steps: [
      {
        action: { type: 'set-status', thread: 'main', status: 'working' },
        narratorText: 'El hilo principal inicia. Sin Web Workers, el cálculo de primos hasta 1.000.000 bloquearía la UI varios segundos.',
        codeLine: 1,
      },
      {
        action: { type: 'push-main', block: { id: 'create-worker', label: 'new Worker()' } },
        narratorText: 'Se crea el worker. El navegador asigna un hilo del sistema operativo para ejecutarlo.',
        codeLine: 2,
      },
      {
        action: { type: 'push-main', block: { id: 'register-click', label: 'addEventListener(click)' } },
        narratorText: 'Se registra un listener de click. Esto demuestra que la UI seguirá respondiendo durante el cálculo.',
        codeLine: 5,
      },
      {
        action: { type: 'push-main', block: { id: 'register-result', label: 'worker.onmessage = cb' } },
        narratorText: 'Se registra el callback para recibir el resultado cuando el worker termine.',
        codeLine: 9,
      },
      {
        action: { type: 'send-to-worker', blockId: 'task-msg', label: '{ limite: 1_000_000 }' },
        narratorText: 'El hilo principal envía la tarea al worker: calcular la suma de todos los primos hasta 1.000.000.',
        codeLine: 16,
      },
      {
        action: { type: 'push-main', block: { id: 'log-free', label: "console.log('UI libre...')" } },
        narratorText: 'El hilo principal continúa inmediatamente. No espera al worker. Imprime "Cálculo iniciado, UI libre...".',
        codeLine: 17,
      },
      {
        action: { type: 'pop-main', blockId: 'log-free' },
        narratorText: 'Mensaje impreso. El hilo principal está libre.',
        codeLine: 17,
      },
      {
        action: { type: 'set-status', thread: 'main', status: 'idle' },
        narratorText: 'El hilo principal queda idle. La UI responde a clicks, scrolls y cualquier interacción del usuario.',
        codeLine: 17,
      },
      {
        action: { type: 'set-status', thread: 'worker', status: 'working' },
        narratorText: 'El worker recibe la tarea y comienza el cálculo intensivo en su propio hilo. Paralelismo real.',
        workerCodeLine: 10,
      },
      {
        action: { type: 'push-worker', block: { id: 'worker-calc', label: 'esPrimo() × 1.000.000' } },
        narratorText: 'El worker itera sobre cada número hasta 1.000.000, verificando si es primo. Este bucle tarda varios segundos.',
        workerCodeLine: 14,
      },
      {
        action: { type: 'push-main', block: { id: 'user-click', label: 'click → UI responde' } },
        narratorText: '¡El usuario hace click! El hilo principal responde inmediatamente porque el cálculo está en otro hilo.',
        codeLine: 6,
      },
      {
        action: { type: 'pop-main', blockId: 'user-click' },
        narratorText: 'La UI procesó el click sin ningún retraso. Esto es imposible sin Web Workers.',
        codeLine: 6,
      },
      {
        action: { type: 'pop-worker', blockId: 'worker-calc' },
        narratorText: 'El worker terminó de calcular. Suma de todos los primos hasta 1.000.000 obtenida.',
        workerCodeLine: 18,
      },
      {
        action: { type: 'send-to-main', blockId: 'result-msg', label: '{ resultado, tiempo }' },
        narratorText: 'El worker envía el resultado al hilo principal: la suma y el tiempo que tardó el cálculo.',
        workerCodeLine: 19,
      },
      {
        action: { type: 'set-status', thread: 'worker', status: 'idle' },
        narratorText: 'El worker termina su tarea y vuelve a idle.',
        workerCodeLine: 19,
      },
      {
        action: { type: 'push-main', block: { id: 'show-result', label: 'console.log(resultado)' } },
        narratorText: 'El hilo principal recibe el resultado y lo muestra. La UI nunca se bloqueó durante todo el proceso.',
        codeLine: 10,
      },
      {
        action: { type: 'pop-main', blockId: 'show-result' },
        narratorText: 'Resultado mostrado. Con Web Workers: cálculo intensivo + UI responsiva = paralelismo real.',
        codeLine: 11,
      },
      {
        action: { type: 'clear' },
        narratorText: 'Ejemplo completado. Los Web Workers permiten ejecutar código CPU-intensivo sin bloquear el hilo principal ni la interfaz de usuario.',
      },
    ],
  },
];
