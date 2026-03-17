import type { AnimationStep, ComponentId } from '../types';

export class VisualizerEngine {
  private steps: AnimationStep[] = [];
  private currentStep: number = 0;
  private isPlaying: boolean = false;
  private speed: 'slow' | 'normal' | 'fast' = 'normal';
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  // Duraciones por velocidad (ms)
  private readonly SPEEDS = { slow: 1000, normal: 600, fast: 300 };

  // Map de blockId -> HTMLElement para búsqueda rápida
  private blockElements = new Map<string, HTMLElement>();

  constructor() {
    this.bindExternalEvents();
  }

  private bindExternalEvents(): void {
    document.addEventListener('loop:load', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      this.load(detail.steps);
    });
    document.addEventListener('loop:play', () => this.play());
    document.addEventListener('loop:pause', () => this.pause());
    document.addEventListener('loop:reset', () => this.reset());
    document.addEventListener('loop:step-forward', () => this.stepForward());
    document.addEventListener('loop:speed-change', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      this.setSpeed(detail.speed);
    });
  }

  load(steps: AnimationStep[]): void {
    this.reset();
    if (!steps || steps.length === 0) {
      document.dispatchEvent(new CustomEvent('loop:step', {
        detail: {
          text: 'Error: no se proporcionaron pasos de animación válidos.',
          stepIndex: 0,
          codeLine: undefined,
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
    this.blockElements.clear();
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

  private executeStep(step: AnimationStep): void {
    const { action } = step;

    switch (action.type) {
      case 'push':
        this.executePush(action.target, action.block.id, action.block.label, action.block.color);
        break;
      case 'pop':
        this.executePop(action.target, action.blockId);
        break;
      case 'move':
        this.executeMove(action.from, action.to, action.blockId);
        break;
      case 'highlight':
        this.executeHighlight(action.target);
        break;
      case 'clear':
        this.executeClear();
        break;
    }

    document.dispatchEvent(new CustomEvent('loop:step', {
      detail: {
        text: step.narratorText,
        stepIndex: this.currentStep,
        codeLine: step.codeLine,
      },
    }));
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  private executePush(target: ComponentId, blockId: string, label: string, color?: string): void {
    const container = document.getElementById(`blocks-${target}`);
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'anim-block';
    el.textContent = label;
    el.title = label; // tooltip nativo para ver el texto completo al hacer hover
    if (color) el.style.setProperty('--block-color', color);

    // Animación de entrada
    const isStack = target === 'callStack';
    el.style.opacity = '0';
    el.style.transform = isStack ? 'translateY(20px)' : 'scale(0.8)';

    container.appendChild(el);
    this.blockElements.set(blockId, el);

    // Trigger animation
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 200ms ease, transform 200ms ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
    });
  }

  private executePop(target: ComponentId, blockId: string): void {
    const el = this.blockElements.get(blockId);
    if (!el) {
      console.warn(`[VisualizerEngine] pop: blockId "${blockId}" no encontrado en ${target}`);
      return;
    }

    const isStack = target === 'callStack';
    el.style.transition = 'opacity 200ms ease, transform 200ms ease';
    el.style.opacity = '0';
    el.style.transform = isStack ? 'translateY(-20px)' : 'scale(0.8)';

    setTimeout(() => {
      el.remove();
      this.blockElements.delete(blockId);
    }, 200);
  }

  private executeMove(from: ComponentId, to: ComponentId, blockId: string): void {
    const el = this.blockElements.get(blockId);
    if (!el) {
      console.warn(`[VisualizerEngine] move: blockId "${blockId}" no encontrado en ${from}`);
      return;
    }

    const destContainer = document.getElementById(`blocks-${to}`);
    if (!destContainer) return;

    // Capturar posición origen
    const fromRect = el.getBoundingClientRect();

    // Mover al contenedor destino (sin animación aún)
    destContainer.appendChild(el);

    // Capturar posición destino
    const toRect = el.getBoundingClientRect();

    // Calcular delta
    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;

    // Aplicar transform inverso para que visualmente esté en la posición origen
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px)`;

    // Animar hacia la posición destino
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'transform 300ms ease';
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  private executeHighlight(target: ComponentId): void {
    const panel = document.getElementById(`panel-${target}`);
    if (!panel) return;

    panel.classList.add('panel-highlighted');
    const duration = this.SPEEDS[this.speed];
    setTimeout(() => panel.classList.remove('panel-highlighted'), duration);
  }

  private executeClear(): void {
    this.clearAllBlocks();
  }

  private clearAllBlocks(): void {
    const components: ComponentId[] = ['callStack', 'webAPIs', 'callbackQueue', 'microtaskQueue'];
    for (const id of components) {
      const container = document.getElementById(`blocks-${id}`);
      if (!container) continue;
      const children = Array.from(container.children) as HTMLElement[];
      for (const child of children) {
        child.style.transition = 'opacity 200ms ease';
        child.style.opacity = '0';
        setTimeout(() => child.remove(), 200);
      }
    }
    this.blockElements.clear();
  }
}
