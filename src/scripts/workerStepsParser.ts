import type { WorkerAnimationStep } from '../types';

export function isWorkerAnimationStep(obj: unknown): obj is WorkerAnimationStep {
  if (typeof obj !== 'object' || obj === null) return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s.narratorText === 'string' &&
    typeof s.action === 'object' &&
    s.action !== null &&
    typeof (s.action as Record<string, unknown>).type === 'string'
  );
}

export function parseWorkerSteps(json: string): WorkerAnimationStep[] {
  const parsed: unknown = JSON.parse(json);
  if (!Array.isArray(parsed)) {
    throw new Error('Expected array of WorkerAnimationStep');
  }
  return parsed.map((item, i) => {
    if (!isWorkerAnimationStep(item)) {
      throw new Error(`Item at index ${i} is not a valid WorkerAnimationStep`);
    }
    return item;
  });
}
