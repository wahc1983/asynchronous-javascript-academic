export type ComponentId = 'callStack' | 'webAPIs' | 'callbackQueue' | 'microtaskQueue';

export interface AnimationBlock {
  id: string;
  label: string;
  color?: string;
}

export type AnimationAction =
  | { type: 'push';      target: ComponentId; block: AnimationBlock }
  | { type: 'pop';       target: ComponentId; blockId: string }
  | { type: 'move';      from: ComponentId;   to: ComponentId; blockId: string }
  | { type: 'highlight'; target: ComponentId }
  | { type: 'clear' };

export interface AnimationStep {
  action: AnimationAction;
  narratorText: string;
  codeLine?: number;
  durationMs?: number;
}

export interface PredefinedExample {
  id: string;
  title: string;
  description: string;
  code: string;
  steps: AnimationStep[];
}

export interface PresentationState {
  currentSlide: number;
  totalSlides: number;
}

export interface SlideDefinition {
  id: string;
  title: string;
  type: 'content' | 'visualizer' | 'playground';
}

// --- Web Workers Section ---

export type WorkerThreadId = 'main' | 'worker';
export type ThreadStatus = 'idle' | 'working' | 'sending';

export type WorkerAnimationAction =
  | { type: 'push-main';      block: AnimationBlock }
  | { type: 'push-worker';    block: AnimationBlock }
  | { type: 'pop-main';       blockId: string }
  | { type: 'pop-worker';     blockId: string }
  | { type: 'send-to-worker'; blockId: string; label: string }
  | { type: 'send-to-main';   blockId: string; label: string }
  | { type: 'set-status';     thread: WorkerThreadId; status: ThreadStatus }
  | { type: 'highlight-main' }
  | { type: 'highlight-worker' }
  | { type: 'clear' };

export interface WorkerAnimationStep {
  action: WorkerAnimationAction;
  narratorText: string;
  codeLine?: number;
  workerCodeLine?: number;
  durationMs?: number;
}

export interface WorkerPredefinedExample {
  id: string;
  title: string;
  description: string;
  mainCode: string;
  workerCode: string;
  steps: WorkerAnimationStep[];
}
