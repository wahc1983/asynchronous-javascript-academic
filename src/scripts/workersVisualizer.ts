import type { WorkerAnimationStep, WorkerThreadId, ThreadStatus } from '../types';

export class WorkersVisualizerEngine {
  private steps: WorkerAnimationStep[] = [];
  private currentStep: number = 0;
  private isPlaying: boolean = false;
  private speed: 'slow' | 'normal' | 'fast' = 'normal';
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  // Duraciones por velocidad (ms)
  private readonly SPEEDS = { slow: 1500, normal: 800, fast: 300 };

  // Maps de blockId -> HTMLElement para cada carril
  private mainBlocks = new Map<string, HTMLElement>();
  private workerBlocks = new Map<string, HTMLElement>();

  constructor() {
    this.bindExternalEvents();
  }

  private bindExternalEvents(): void {
    document.addEventListener('workers:load', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      this.load(detail.steps);
    });
    document.addEventListener('workers:play', () => this.play());
    document.addEventListener('workers:pause', () => this.pause());
    document.addEventListener('workers:reset', () => this.reset());
    document.addEventListener('workers:step-forward', () => this.stepForward());
    document.addEventListener('workers:speed-change', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      this.setSpeed(detail.speed);
    });
  }

  load(steps: WorkerAnimationStep[]): void {
    this.reset();
    if (!steps || steps.length === 0) {
      document.dispatchEvent(new CustomEvent('workers:step', {
        detail: {
          text: 'Error: no se proporcionaron pasos de animación válidos.',
          stepIndex: 0,
          codeLine: undefined,
          workerCodeLine: undefined,
        },
      }));
      return;
    }
    this.steps = steps;
  }

  play(): void {
    if (this.isPlaying) return;
    if (this.currentStep >= this.steps.length) return;
    this.isPlaying = true;
    this.scheduleNext();
  }

  pause(): void {
    this.isPlaying = false;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  reset(): void {
    this.pause();
    this.currentStep = 0;
    this.clearAllBlocks();
    this.mainBlocks.clear();
    this.workerBlocks.clear();
  }

  stepForward(): void {
    if (this.currentStep >= this.steps.length) return;
    this.executeStep(this.steps[this.currentStep]);
    this.currentStep++;
  }

  setSpeed(speed: 'slow' | 'normal' | 'fast'): void {
    this.speed = speed;
  }

  // ── Scheduling ──────────────────────────────────────────────────────────────

  private scheduleNext(): void {
    if (!this.isPlaying || this.currentStep >= this.steps.length) {
      this.isPlaying = false;
      return;
    }
    const step = this.steps[this.currentStep];
    const duration = step.durationMs ?? this.SPEEDS[this.speed];

    this.executeStep(step);
    this.currentStep++;

    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.scheduleNext();
    }, duration);
  }

  // ── Step execution ───────────────────────────────────────────────────────────

  private executeStep(step: WorkerAnimationStep): void {
    const { action } = step;

    switch (action.type) {
      case 'push-main':
        this.executePush('main', action.block.id, action.block.label, action.block.color);
        break;
      case 'push-worker':
        this.executePush('worker', action.block.id, action.block.label, action.block.color);
        break;
      case 'pop-main':
        this.executePop('main', action.blockId);
        break;
      case 'pop-worker':
        this.executePop('worker', action.blockId);
        break;
      case 'send-to-worker':
        this.executeSend('main', 'worker', action.blockId, action.label);
        break;
      case 'send-to-main':
        this.executeSend('worker', 'main', action.blockId, action.label);
        break;
      case 'set-status':
        this.executeSetStatus(action.thread, action.status);
        break;
      case 'highlight-main':
        this.executeHighlight('main');
        break;
      case 'highlight-worker':
        this.executeHighlight('worker');
        break;
      case 'clear':
        this.executeClear();
        break;
    }

    document.dispatchEvent(new CustomEvent('workers:step', {
      detail: {
        text: step.narratorText,
        stepIndex: this.currentStep,
        codeLine: step.codeLine,
        workerCodeLine: step.workerCodeLine,
      },
    }));
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  private executePush(thread: WorkerThreadId, blockId: string, label: string, color?: string): void {
    const container = document.getElementById(`blocks-${thread}`);
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'anim-block';
    el.textContent = label;
    el.title = label;
    if (color) el.style.setProperty('--block-color', color);

    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';

    container.appendChild(el);

    const blockMap = thread === 'main' ? this.mainBlocks : this.workerBlocks;
    blockMap.set(blockId, el);

    requestAnimationFrame(() => {
      el.style.transition = 'opacity 200ms ease, transform 200ms ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
    });
  }

  private executePop(thread: WorkerThreadId, blockId: string): void {
    const blockMap = thread === 'main' ? this.mainBlocks : this.workerBlocks;
    const el = blockMap.get(blockId);
    if (!el) {
      console.warn(`[WorkersVisualizerEngine] pop-${thread}: blockId "${blockId}" no encontrado`);
      return;
    }

    el.style.transition = 'opacity 200ms ease, transform 200ms ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-20px)';

    setTimeout(() => {
      el.remove();
      blockMap.delete(blockId);
    }, 200);
  }

  private executeSend(from: WorkerThreadId, to: WorkerThreadId, blockId: string, label: string): void {
    const fromMap = from === 'main' ? this.mainBlocks : this.workerBlocks;

    // Verificar que el bloque existe en el carril origen (warn y continuar si no)
    if (!fromMap.has(blockId)) {
      console.warn(`[WorkersVisualizerEngine] send-to-${to}: blockId "${blockId}" no encontrado en ${from}`);
    }

    const channel = document.getElementById('message-channel');
    if (!channel) return;

    // Crear bloque de mensaje animado en el canal
    const msgEl = document.createElement('div');
    msgEl.className = 'message-block';
    msgEl.textContent = label;
    msgEl.title = label;

    // Dirección: main→worker = izquierda a derecha, worker→main = derecha a izquierda
    const goingRight = from === 'main';
    msgEl.style.cssText = `
      position: absolute;
      top: 50%;
      transform: translateY(-50%) translateX(${goingRight ? '-100%' : '100%'});
      ${goingRight ? 'left: 0;' : 'right: 0;'}
      opacity: 0;
    `;

    channel.appendChild(msgEl);

    // Animar el mensaje a través del canal
    requestAnimationFrame(() => {
      msgEl.style.transition = 'transform 500ms ease, opacity 200ms ease';
      msgEl.style.opacity = '1';
      msgEl.style.transform = `translateY(-50%) translateX(${goingRight ? '200%' : '-200%'})`;
    });

    // Al terminar la animación: remover del canal y añadir al carril destino
    const animDuration = 500;
    setTimeout(() => {
      msgEl.remove();
      // Añadir bloque al carril destino
      const toMap = to === 'main' ? this.mainBlocks : this.workerBlocks;
      const destContainer = document.getElementById(`blocks-${to}`);
      if (destContainer) {
        const destEl = document.createElement('div');
        destEl.className = 'anim-block';
        destEl.textContent = label;
        destEl.title = label;
        destEl.style.opacity = '0';
        destEl.style.transform = 'scale(0.8)';
        destContainer.appendChild(destEl);
        toMap.set(blockId, destEl);

        requestAnimationFrame(() => {
          destEl.style.transition = 'opacity 200ms ease, transform 200ms ease';
          destEl.style.opacity = '1';
          destEl.style.transform = 'scale(1)';
        });
      }
    }, animDuration);
  }

  private executeSetStatus(thread: WorkerThreadId, status: ThreadStatus): void {
    const el = document.getElementById(`status-${thread}`);
    if (!el) return;

    // Quitar clases de estado anteriores
    el.classList.remove('status-idle', 'status-working', 'status-sending');
    el.classList.add(`status-${status}`);
    el.textContent = status;
    el.setAttribute('data-status', status);
  }

  private executeHighlight(thread: WorkerThreadId): void {
    const lane = document.getElementById(`lane-${thread}`);
    if (!lane) return;

    lane.classList.add('highlighted');
    const duration = this.SPEEDS[this.speed];
    setTimeout(() => lane.classList.remove('highlighted'), duration);
  }

  private executeClear(): void {
    this.clearAllBlocks();
  }

  private clearAllBlocks(): void {
    for (const thread of ['main', 'worker'] as WorkerThreadId[]) {
      const container = document.getElementById(`blocks-${thread}`);
      if (!container) continue;
      const children = Array.from(container.children) as HTMLElement[];
      for (const child of children) {
        child.style.transition = 'opacity 200ms ease';
        child.style.opacity = '0';
        setTimeout(() => child.remove(), 200);
      }
    }
    this.mainBlocks.clear();
    this.workerBlocks.clear();

    // Limpiar bloques de mensaje en tránsito del canal (preservar label y arrows estáticos)
    const channel = document.getElementById('message-channel');
    if (channel) {
      channel.querySelectorAll('.message-block').forEach(el => el.remove());
    }

    // Resetear indicadores de estado
    for (const thread of ['main', 'worker'] as WorkerThreadId[]) {
      const statusEl = document.getElementById(`status-${thread}`);
      if (statusEl) {
        statusEl.classList.remove('status-idle', 'status-working', 'status-sending');
        statusEl.classList.add('status-idle');
        statusEl.textContent = 'idle';
        statusEl.setAttribute('data-status', 'idle');
      }
    }
  }
}
