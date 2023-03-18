import { ITerminalConfig } from "~/components/terminal/interfaces/ITerminalConfig";

export interface IProgram {
  command: string;
  description: string;
  initialData?: string;
  run: (
    config?: any,
    createNewTerminal?: (config?: ITerminalConfig) => void,
    initialData?: string
  ) => string | HTMLElement;
}
