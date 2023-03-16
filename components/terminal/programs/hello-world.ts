import { IProgram } from "./index";

const helloWorld: IProgram = {
  command: "helloWorld",
  description: "Un petit Bonjour !",
  run: function (config: { userName: string }): string {
    return `Bonjour, ${config.userName} ! Bienvenue dans le terminal.`;
  },
};

export default helloWorld;
