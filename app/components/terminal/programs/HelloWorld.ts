import type { IProgram, ITerminalConfig } from "~/components/terminal/interfaces";

const helloWorld: IProgram = {
  command: "helloWorld",
  description: "Un petit Bonjour !",
  run: function (config?: ITerminalConfig): string {
    return `Bonjour, ${config?.userName ?? "anon."} ! Bienvenue dans le terminal.`;
  },
};

export default helloWorld;
