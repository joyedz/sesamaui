import type { Surface } from '../surface.d.mts';
export interface CanvasPan {
  x: number;
  y: number;
}

export interface CanvasOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  toolbar?: boolean | string;
  content?: string;
  zoom?: number;
  pan?: CanvasPan;
  minZoom?: number;
  maxZoom?: number;
  attributes?: string;
}

export interface CanvasController {
  setZoom(zoom: number, centerPoint?: CanvasPan | null): void;
  getZoom(): number;
  setPan(pan: CanvasPan): void;
  getPan(): CanvasPan;
  fitToContent(): void;
  destroy(): void;
}

export function canvas(options?: CanvasOptions): string;
export function initCanvas(element: HTMLElement): CanvasController;
