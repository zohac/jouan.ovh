export interface IProgram {
  command: string;
  description: string;
  initialData?: string;
  run: (
    config?: any,
    createNewTerminal?: (initialData?: string) => void,
    initialData?: string
  ) => string | HTMLElement;
}
