export interface Session {
  refresh(): Session;
  destroy(): void;
}

export const controllerRegistry: Map<string, (element: any) => any>;

export function registerController(selector: string, init: (element: any) => any): void;

export function mount(root: Document | Element | DocumentFragment): Session;
