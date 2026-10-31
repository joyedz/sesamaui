export type WireVariant = 'bezier' | 'step' | 'straight' | 'dashed';

export interface WirePoint {
  x: number;
  y: number;
}

export interface WireOptions {
  type?: WireVariant;
  variant?: WireVariant;
  from?: WirePoint;
  to?: WirePoint;
  width?: number | string;
  height?: number | string;
  showEndpoints?: boolean;
  endpointRadius?: number;
  strokeWidth?: number;
  color?: string;
  attributes?: string;
}

export function wire(options?: WireOptions | WireVariant): string;
