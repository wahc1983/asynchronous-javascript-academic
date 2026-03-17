import type { PredefinedExample } from '../types';

export const examples: PredefinedExample[] = [
  // ─── Ejemplo 1: Solo código síncrono ────────────────────────────────────────
  {
    id: 'sync-only',
    title: '1. Código síncrono',
    description: 'El caso más simple: todo el código se ejecuta de forma secuencial en el Call Stack, línea por línea, sin ninguna tarea asíncrona.',
    code: `function saludar(nombre) {
  return 'Hola, ' + nombre;
}

function main() {
  const msg = saludar('Mundo');
  console.log(msg);
}

main();`,
    steps: [
      { action: { type: 'push', target: 'callStack', block: { id: 'main', label: 'main()' } }, narratorText: 'El motor JS crea el contexto global y apila main() en el Call Stack.', codeLine: 10 },
      { action: { type: 'push', target: 'callStack', block: { id: 'saludar', label: 'saludar("Mundo")' } }, narratorText: 'main() llama a saludar(). Se apila encima de main() en el Call Stack.', codeLine: 6 },
      { action: { type: 'pop', target: 'callStack', blockId: 'saludar' }, narratorText: 'saludar() retorna "Hola, Mundo" y se elimina del Call Stack. El control vuelve a main().', codeLine: 2 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log', label: 'console.log(msg)' } }, narratorText: 'main() llama a console.log(). Se apila en el Call Stack.', codeLine: 7 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log' }, narratorText: 'console.log imprime "Hola, Mundo" y se elimina del Call Stack.', codeLine: 7 },
      { action: { type: 'pop', target: 'callStack', blockId: 'main' }, narratorText: 'main() termina. El Call Stack queda completamente vacío. Ejecución completa.', codeLine: 10 },
    ],
  },

  // ─── Ejemplo 2: setTimeout básico ───────────────────────────────────────────
  {
    id: 'settimeout-basic',
    title: '2. setTimeout (macrotarea)',
    description: 'setTimeout delega su callback a las Web APIs del navegador. Cuando el temporizador expira, el callback va a la Callback Queue y espera a que el Call Stack esté vacío.',
    code: `console.log('inicio');

setTimeout(() => {
  console.log('timeout');
}, 0);

console.log('fin');`,
    steps: [
      { action: { type: 'push', target: 'callStack', block: { id: 'main', label: 'main()' } }, narratorText: 'El motor JS crea el contexto global main() y lo apila en el Call Stack.', codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-inicio', label: "console.log('inicio')" } }, narratorText: "Se llama a console.log('inicio'). Se apila en el Call Stack.", codeLine: 1 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-inicio' }, narratorText: "console.log imprime 'inicio' y se elimina del Call Stack.", codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'settimeout', label: 'setTimeout(cb, 0)' } }, narratorText: 'Se llama a setTimeout. El motor lo apila brevemente para registrarlo con las Web APIs.', codeLine: 3 },
      { action: { type: 'move', from: 'callStack', to: 'webAPIs', blockId: 'settimeout' }, narratorText: 'setTimeout se delega a las Web APIs del navegador. El temporizador empieza a contar (0 ms). JavaScript sigue ejecutando código síncrono.', codeLine: 3 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-fin', label: "console.log('fin')" } }, narratorText: "El código síncrono continúa sin esperar. Se apila console.log('fin').", codeLine: 7 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-fin' }, narratorText: "console.log imprime 'fin' y se elimina del Call Stack.", codeLine: 7 },
      { action: { type: 'pop', target: 'callStack', blockId: 'main' }, narratorText: 'El contexto global main() termina. El Call Stack queda vacío.', codeLine: 7 },
      { action: { type: 'move', from: 'webAPIs', to: 'callbackQueue', blockId: 'settimeout' }, narratorText: 'El temporizador expiró. La Web API mueve el callback a la Callback Queue (cola de macrotareas).', codeLine: 4 },
      { action: { type: 'highlight', target: 'callbackQueue' }, narratorText: 'El Event Loop detecta que el Call Stack está vacío y hay una tarea en la Callback Queue. ¡Ahora puede procesarla!', codeLine: 4 },
      { action: { type: 'move', from: 'callbackQueue', to: 'callStack', blockId: 'settimeout' }, narratorText: 'El Event Loop saca el callback de la Callback Queue y lo mueve al Call Stack para ejecutarlo.', codeLine: 4 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-timeout', label: "console.log('timeout')" } }, narratorText: "Dentro del callback se ejecuta console.log('timeout').", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-timeout' }, narratorText: "Se imprime 'timeout' en la consola.", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'settimeout' }, narratorText: 'El callback termina y se elimina del Call Stack. Ejecución completa. Orden: inicio → fin → timeout.', codeLine: 4 },
    ],
  },

  // ─── Ejemplo 3: Promise.resolve() (microtask) ───────────────────────────────
  {
    id: 'promise-microtask',
    title: '3. Promise (microtarea)',
    description: 'Las promesas resueltas envían su callback .then() a la Microtask Queue, que tiene mayor prioridad que la Callback Queue y se vacía completamente antes de procesar macrotareas.',
    code: `console.log('inicio');

Promise.resolve('valor').then((v) => {
  console.log('promise:', v);
});

console.log('fin');`,
    steps: [
      { action: { type: 'push', target: 'callStack', block: { id: 'main', label: 'main()' } }, narratorText: 'Se crea el contexto global y se apila en el Call Stack.', codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-inicio', label: "console.log('inicio')" } }, narratorText: "Se apila console.log('inicio').", codeLine: 1 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-inicio' }, narratorText: "Se imprime 'inicio' y se elimina del Call Stack.", codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'promise-resolve', label: "Promise.resolve('valor').then(cb)" } }, narratorText: "Se evalúa Promise.resolve('valor'). La promesa ya está resuelta inmediatamente, así que el callback de .then() se programa como microtarea.", codeLine: 3 },
      { action: { type: 'move', from: 'callStack', to: 'microtaskQueue', blockId: 'promise-resolve' }, narratorText: 'El callback de .then() se encola en la Microtask Queue. Nota: NO va a la Callback Queue como setTimeout.', codeLine: 3 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-fin', label: "console.log('fin')" } }, narratorText: "El código síncrono continúa. Se apila console.log('fin').", codeLine: 7 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-fin' }, narratorText: "Se imprime 'fin' y se elimina del Call Stack.", codeLine: 7 },
      { action: { type: 'pop', target: 'callStack', blockId: 'main' }, narratorText: 'El contexto global termina. El Call Stack queda vacío.', codeLine: 7 },
      { action: { type: 'highlight', target: 'microtaskQueue' }, narratorText: 'Antes de procesar cualquier macrotarea, el Event Loop vacía completamente la Microtask Queue. ¡Esta es la diferencia clave con setTimeout!', codeLine: 4 },
      { action: { type: 'move', from: 'microtaskQueue', to: 'callStack', blockId: 'promise-resolve' }, narratorText: 'El Event Loop saca el callback de la Microtask Queue y lo mueve al Call Stack para ejecutarlo.', codeLine: 4 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-promise', label: "console.log('promise:', v)" } }, narratorText: "Se ejecuta console.log('promise:', v) dentro del callback.", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-promise' }, narratorText: "Se imprime 'promise: valor' en la consola.", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'promise-resolve' }, narratorText: 'El callback de la promesa termina. La Microtask Queue está vacía. Ejecución completa.', codeLine: 4 },
    ],
  },

  // ─── Ejemplo 4: async/await ──────────────────────────────────────────────────
  {
    id: 'async-await',
    title: '4. async / await',
    description: 'async/await es azúcar sintáctico sobre Promises. El await suspende la función async y cede el control al código que la llamó, reanudándola como microtarea cuando la promesa se resuelve.',
    code: `async function obtenerDatos() {
  console.log('obteniendo...');
  const datos = await Promise.resolve('resultado');
  console.log('datos:', datos);
}

obtenerDatos();
console.log('después de llamar');`,
    steps: [
      { action: { type: 'push', target: 'callStack', block: { id: 'main', label: 'main()' } }, narratorText: 'Se crea el contexto global.', codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'obtenerDatos-call', label: 'obtenerDatos()' } }, narratorText: 'Se llama a obtenerDatos(). Al ser async, devuelve una Promise implícita y empieza a ejecutarse.', codeLine: 7 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-obteniendo', label: "console.log('obteniendo...')" } }, narratorText: "Dentro de obtenerDatos se ejecuta console.log('obteniendo...') de forma síncrona.", codeLine: 2 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-obteniendo' }, narratorText: "Se imprime 'obteniendo...'.", codeLine: 2 },
      { action: { type: 'push', target: 'callStack', block: { id: 'await-expr', label: "await Promise.resolve('resultado')" } }, narratorText: "Se encuentra el await. Aunque la promesa ya está resuelta, await SIEMPRE cede el control al menos una vez. La función se suspende.", codeLine: 3 },
      { action: { type: 'move', from: 'callStack', to: 'microtaskQueue', blockId: 'await-expr' }, narratorText: 'La continuación de obtenerDatos (el código después del await) se encola como microtarea en la Microtask Queue.', codeLine: 3 },
      { action: { type: 'pop', target: 'callStack', blockId: 'obtenerDatos-call' }, narratorText: 'obtenerDatos queda suspendida. El control vuelve al código que la llamó.', codeLine: 7 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-after', label: "console.log('después de llamar')" } }, narratorText: "El código síncrono continúa con console.log('después de llamar').", codeLine: 8 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-after' }, narratorText: "Se imprime 'después de llamar'.", codeLine: 8 },
      { action: { type: 'pop', target: 'callStack', blockId: 'main' }, narratorText: 'El contexto global termina. El Call Stack queda vacío.', codeLine: 8 },
      { action: { type: 'highlight', target: 'microtaskQueue' }, narratorText: 'El Event Loop vacía la Microtask Queue. Retoma la ejecución de obtenerDatos desde donde se suspendió (después del await).', codeLine: 4 },
      { action: { type: 'move', from: 'microtaskQueue', to: 'callStack', blockId: 'await-expr' }, narratorText: 'obtenerDatos se reanuda en el Call Stack con el valor resuelto de la promesa.', codeLine: 4 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-datos', label: "console.log('datos:', datos)" } }, narratorText: "Se ejecuta console.log('datos:', datos), la línea después del await.", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-datos' }, narratorText: "Se imprime 'datos: resultado'.", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'await-expr' }, narratorText: 'obtenerDatos termina. Orden: obteniendo... → después de llamar → datos: resultado.', codeLine: 4 },
    ],
  },

  // ─── Ejemplo 5: Macro vs. Microtareas ───────────────────────────────────────
  {
    id: 'macro-micro-mix',
    title: '5. Macro vs. Microtareas',
    description: 'El ejemplo más revelador: cuando el Call Stack queda vacío, el Event Loop SIEMPRE vacía la Microtask Queue completa antes de tomar la siguiente macrotarea de la Callback Queue.',
    code: `console.log('1 - síncrono');

setTimeout(() => {
  console.log('4 - macrotarea');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - microtarea');
});

console.log('2 - síncrono');`,
    steps: [
      { action: { type: 'push', target: 'callStack', block: { id: 'main', label: 'main()' } }, narratorText: 'Se crea el contexto global.', codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-1', label: "console.log('1 - síncrono')" } }, narratorText: "Se apila console.log('1 - síncrono').", codeLine: 1 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-1' }, narratorText: "Se imprime '1 - síncrono'.", codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'settimeout', label: 'setTimeout(cb, 0)' } }, narratorText: 'Se registra setTimeout. El callback se delegará a las Web APIs como macrotarea.', codeLine: 3 },
      { action: { type: 'move', from: 'callStack', to: 'webAPIs', blockId: 'settimeout' }, narratorText: 'setTimeout pasa a las Web APIs. El temporizador de 0 ms empieza a contar.', codeLine: 3 },
      { action: { type: 'push', target: 'callStack', block: { id: 'promise-then', label: 'Promise.resolve().then(cb)' } }, narratorText: 'Se evalúa Promise.resolve().then(). La promesa ya está resuelta; el callback se encola como microtarea.', codeLine: 7 },
      { action: { type: 'move', from: 'callStack', to: 'microtaskQueue', blockId: 'promise-then' }, narratorText: 'El callback de la promesa queda en la Microtask Queue. Ahora tenemos: macrotarea en Web APIs, microtarea en Microtask Queue.', codeLine: 7 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-2', label: "console.log('2 - síncrono')" } }, narratorText: "El código síncrono continúa con console.log('2 - síncrono').", codeLine: 11 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-2' }, narratorText: "Se imprime '2 - síncrono'.", codeLine: 11 },
      { action: { type: 'pop', target: 'callStack', blockId: 'main' }, narratorText: 'El contexto global termina. El Call Stack queda vacío. ¡Momento de decisión para el Event Loop!', codeLine: 11 },
      { action: { type: 'move', from: 'webAPIs', to: 'callbackQueue', blockId: 'settimeout' }, narratorText: 'El temporizador expiró. El callback de setTimeout pasa a la Callback Queue (macrotareas).', codeLine: 4 },
      { action: { type: 'highlight', target: 'microtaskQueue' }, narratorText: '⚡ REGLA CLAVE: El Event Loop SIEMPRE vacía la Microtask Queue ANTES de procesar la Callback Queue. Las microtareas tienen prioridad absoluta.', codeLine: 8 },
      { action: { type: 'move', from: 'microtaskQueue', to: 'callStack', blockId: 'promise-then' }, narratorText: 'El Event Loop saca el callback de la Microtask Queue. Se ejecuta PRIMERO, aunque setTimeout se registró antes.', codeLine: 8 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-micro', label: "console.log('3 - microtarea')" } }, narratorText: "Se ejecuta console.log('3 - microtarea').", codeLine: 8 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-micro' }, narratorText: "Se imprime '3 - microtarea'.", codeLine: 8 },
      { action: { type: 'pop', target: 'callStack', blockId: 'promise-then' }, narratorText: 'La microtarea termina. La Microtask Queue está vacía. Ahora sí puede procesarse la macrotarea.', codeLine: 8 },
      { action: { type: 'highlight', target: 'callbackQueue' }, narratorText: 'El Event Loop toma la macrotarea de la Callback Queue.', codeLine: 4 },
      { action: { type: 'move', from: 'callbackQueue', to: 'callStack', blockId: 'settimeout' }, narratorText: 'El callback de setTimeout se mueve de la Callback Queue al Call Stack.', codeLine: 4 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-macro', label: "console.log('4 - macrotarea')" } }, narratorText: "Se ejecuta console.log('4 - macrotarea').", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-macro' }, narratorText: "Se imprime '4 - macrotarea'. Orden final: 1 → 2 → 3 → 4. ¡Las microtareas siempre van antes!", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'settimeout' }, narratorText: 'Ejecución completa. Este ejemplo demuestra la prioridad de microtareas sobre macrotareas.', codeLine: 4 },
    ],
  },

  // ─── Ejemplo 6: fetch simulado ───────────────────────────────────────────────
  {
    id: 'fetch-simulation',
    title: '6. fetch() — petición de red',
    description: 'fetch() es una Web API que realiza peticiones HTTP en segundo plano. Devuelve una Promise que se resuelve cuando llega la respuesta, sin bloquear el hilo principal.',
    code: `console.log('Iniciando petición...');

fetch('https://api.ejemplo.com/datos')
  .then(response => response.json())
  .then(datos => {
    console.log('Datos recibidos:', datos);
  });

console.log('La UI sigue respondiendo');`,
    steps: [
      { action: { type: 'push', target: 'callStack', block: { id: 'main', label: 'main()' } }, narratorText: 'Se crea el contexto global.', codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-init', label: "console.log('Iniciando...')" } }, narratorText: "Se imprime 'Iniciando petición...'.", codeLine: 1 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-init' }, narratorText: "Mensaje impreso.", codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'fetch-call', label: "fetch('https://...')" } }, narratorText: 'Se llama a fetch(). Esta es una Web API del navegador, no código JavaScript puro.', codeLine: 3 },
      { action: { type: 'move', from: 'callStack', to: 'webAPIs', blockId: 'fetch-call' }, narratorText: 'fetch() se delega a las Web APIs. El navegador realiza la petición HTTP en segundo plano. JavaScript NO espera — sigue ejecutando.', codeLine: 3 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-ui', label: "console.log('La UI sigue...')" } }, narratorText: "Mientras la petición viaja por la red, JavaScript sigue ejecutando. Se imprime 'La UI sigue respondiendo'.", codeLine: 9 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-ui' }, narratorText: "Mensaje impreso. La UI nunca se bloqueó.", codeLine: 9 },
      { action: { type: 'pop', target: 'callStack', blockId: 'main' }, narratorText: 'El contexto global termina. El Call Stack queda vacío. La petición HTTP sigue en curso en las Web APIs.', codeLine: 9 },
      { action: { type: 'move', from: 'webAPIs', to: 'microtaskQueue', blockId: 'fetch-call' }, narratorText: '¡La respuesta llegó! Las Web APIs resuelven la Promise de fetch(). El primer .then() se encola en la Microtask Queue.', codeLine: 4 },
      { action: { type: 'highlight', target: 'microtaskQueue' }, narratorText: 'El Event Loop detecta la microtarea y la procesa.', codeLine: 4 },
      { action: { type: 'move', from: 'microtaskQueue', to: 'callStack', blockId: 'fetch-call' }, narratorText: 'Se ejecuta el primer .then(): response.json(). Esto también devuelve una Promise (parsear JSON puede tomar tiempo).', codeLine: 4 },
      { action: { type: 'move', from: 'callStack', to: 'microtaskQueue', blockId: 'fetch-call' }, narratorText: 'response.json() encola el segundo .then() como microtarea cuando termina de parsear.', codeLine: 5 },
      { action: { type: 'highlight', target: 'microtaskQueue' }, narratorText: 'El Event Loop procesa la siguiente microtarea: el segundo .then() con los datos parseados.', codeLine: 5 },
      { action: { type: 'move', from: 'microtaskQueue', to: 'callStack', blockId: 'fetch-call' }, narratorText: 'Se ejecuta el segundo .then() con los datos ya parseados.', codeLine: 6 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-datos', label: "console.log('Datos:', datos)" } }, narratorText: "Se imprime 'Datos recibidos: ...' con los datos de la API.", codeLine: 6 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-datos' }, narratorText: "Datos impresos.", codeLine: 6 },
      { action: { type: 'pop', target: 'callStack', blockId: 'fetch-call' }, narratorText: 'Ejecución completa. fetch() nunca bloqueó el hilo principal. Así funciona JavaScript asíncrono en el navegador.', codeLine: 6 },
    ],
  },

  // ─── Ejemplo 7: Event Listener ───────────────────────────────────────────────
  {
    id: 'event-listener',
    title: '7. Event Listener (click)',
    description: 'Los event listeners registran callbacks en las Web APIs. Cuando el usuario interactúa (click, keypress, etc.), el callback se encola en la Callback Queue como macrotarea.',
    code: `const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
  console.log('¡Botón clickeado!');
  console.log('Procesando...');
});

console.log('Listener registrado, esperando click...');
// ... el usuario hace click ...`,
    steps: [
      { action: { type: 'push', target: 'callStack', block: { id: 'main', label: 'main()' } }, narratorText: 'Se crea el contexto global.', codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'get-btn', label: 'getElementById("btn")' } }, narratorText: 'Se obtiene la referencia al botón del DOM.', codeLine: 1 },
      { action: { type: 'pop', target: 'callStack', blockId: 'get-btn' }, narratorText: 'Referencia obtenida.', codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'add-listener', label: "btn.addEventListener('click', cb)" } }, narratorText: "Se llama a addEventListener(). Esto registra el callback en las Web APIs del navegador.", codeLine: 3 },
      { action: { type: 'move', from: 'callStack', to: 'webAPIs', blockId: 'add-listener' }, narratorText: 'El listener queda registrado en las Web APIs. El navegador vigilará los eventos de click en ese botón indefinidamente.', codeLine: 3 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-ready', label: "console.log('Listener registrado...')" } }, narratorText: "El código síncrono continúa. Se imprime 'Listener registrado, esperando click...'.", codeLine: 8 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-ready' }, narratorText: "Mensaje impreso.", codeLine: 8 },
      { action: { type: 'pop', target: 'callStack', blockId: 'main' }, narratorText: 'El contexto global termina. El Call Stack queda vacío. El listener sigue activo en las Web APIs, esperando.', codeLine: 8 },
      { action: { type: 'highlight', target: 'webAPIs' }, narratorText: '... el usuario hace click en el botón ...', codeLine: 9 },
      { action: { type: 'move', from: 'webAPIs', to: 'callbackQueue', blockId: 'add-listener' }, narratorText: '¡Click detectado! Las Web APIs mueven el callback del click a la Callback Queue como macrotarea.', codeLine: 4 },
      { action: { type: 'highlight', target: 'callbackQueue' }, narratorText: 'El Event Loop detecta la tarea en la Callback Queue y el Call Stack vacío. Procede a ejecutarla.', codeLine: 4 },
      { action: { type: 'move', from: 'callbackQueue', to: 'callStack', blockId: 'add-listener' }, narratorText: 'El Event Loop saca el callback del click de la Callback Queue y lo mueve al Call Stack.', codeLine: 4 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-click', label: "console.log('¡Botón clickeado!')" } }, narratorText: "Se ejecuta console.log('¡Botón clickeado!').", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-click' }, narratorText: "Se imprime '¡Botón clickeado!'.", codeLine: 4 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-proc', label: "console.log('Procesando...')" } }, narratorText: "Se ejecuta console.log('Procesando...').", codeLine: 5 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-proc' }, narratorText: "Se imprime 'Procesando...'.", codeLine: 5 },
      { action: { type: 'pop', target: 'callStack', blockId: 'add-listener' }, narratorText: 'El callback del click termina. El listener sigue activo para futuros clicks. Así funcionan todos los eventos del navegador.', codeLine: 5 },
    ],
  },

  // ─── Ejemplo 8: queueMicrotask ───────────────────────────────────────────────
  {
    id: 'queue-microtask',
    title: '8. queueMicrotask()',
    description: 'queueMicrotask() es una API moderna que programa una función directamente en la Microtask Queue, sin necesidad de crear una Promise. Útil para diferir trabajo de alta prioridad.',
    code: `console.log('inicio');

queueMicrotask(() => {
  console.log('microtarea directa');
});

setTimeout(() => {
  console.log('macrotarea');
}, 0);

console.log('fin');`,
    steps: [
      { action: { type: 'push', target: 'callStack', block: { id: 'main', label: 'main()' } }, narratorText: 'Se crea el contexto global.', codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-inicio', label: "console.log('inicio')" } }, narratorText: "Se apila console.log('inicio').", codeLine: 1 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-inicio' }, narratorText: "Se imprime 'inicio'.", codeLine: 1 },
      { action: { type: 'push', target: 'callStack', block: { id: 'qmt-call', label: 'queueMicrotask(cb)' } }, narratorText: 'Se llama a queueMicrotask(). A diferencia de Promise, registra el callback directamente en la Microtask Queue sin crear una Promise.', codeLine: 3 },
      { action: { type: 'move', from: 'callStack', to: 'microtaskQueue', blockId: 'qmt-call' }, narratorText: 'El callback queda encolado en la Microtask Queue. Sin pasar por Web APIs.', codeLine: 3 },
      { action: { type: 'push', target: 'callStack', block: { id: 'settimeout', label: 'setTimeout(cb, 0)' } }, narratorText: 'Se registra setTimeout como macrotarea.', codeLine: 7 },
      { action: { type: 'move', from: 'callStack', to: 'webAPIs', blockId: 'settimeout' }, narratorText: 'setTimeout pasa a las Web APIs.', codeLine: 7 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-fin', label: "console.log('fin')" } }, narratorText: "El código síncrono continúa con console.log('fin').", codeLine: 11 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-fin' }, narratorText: "Se imprime 'fin'.", codeLine: 11 },
      { action: { type: 'pop', target: 'callStack', blockId: 'main' }, narratorText: 'El contexto global termina. El Call Stack queda vacío.', codeLine: 11 },
      { action: { type: 'move', from: 'webAPIs', to: 'callbackQueue', blockId: 'settimeout' }, narratorText: 'El temporizador expiró. El callback de setTimeout pasa a la Callback Queue.', codeLine: 8 },
      { action: { type: 'highlight', target: 'microtaskQueue' }, narratorText: 'El Event Loop procesa primero la Microtask Queue. queueMicrotask tiene la misma prioridad que las Promises.', codeLine: 4 },
      { action: { type: 'move', from: 'microtaskQueue', to: 'callStack', blockId: 'qmt-call' }, narratorText: 'El Event Loop saca el callback de la Microtask Queue y lo mueve al Call Stack.', codeLine: 4 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-micro', label: "console.log('microtarea directa')" } }, narratorText: "Se ejecuta console.log('microtarea directa').", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-micro' }, narratorText: "Se imprime 'microtarea directa'.", codeLine: 4 },
      { action: { type: 'pop', target: 'callStack', blockId: 'qmt-call' }, narratorText: 'Microtarea completa. Ahora el Event Loop puede procesar la macrotarea.', codeLine: 4 },
      { action: { type: 'highlight', target: 'callbackQueue' }, narratorText: 'El Event Loop toma la macrotarea de la Callback Queue.', codeLine: 8 },
      { action: { type: 'move', from: 'callbackQueue', to: 'callStack', blockId: 'settimeout' }, narratorText: 'El callback de setTimeout se mueve de la Callback Queue al Call Stack.', codeLine: 8 },
      { action: { type: 'push', target: 'callStack', block: { id: 'log-macro', label: "console.log('macrotarea')" } }, narratorText: "Se ejecuta console.log('macrotarea').", codeLine: 8 },
      { action: { type: 'pop', target: 'callStack', blockId: 'log-macro' }, narratorText: "Se imprime 'macrotarea'. Orden: inicio → fin → microtarea directa → macrotarea.", codeLine: 8 },
      { action: { type: 'pop', target: 'callStack', blockId: 'settimeout' }, narratorText: 'Ejecución completa.', codeLine: 8 },
    ],
  },
];
