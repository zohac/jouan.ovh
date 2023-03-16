import helloWorld from "./hello-World";
import help from "./help";
import newTerminal from "./new-terminal";
import systemInfo from "./system-infos";

export interface IProgram {
  command: string;
  description: string;
  run: (config?: any, createNewTerminal?: () => void) => string | HTMLElement;
}

const programs: { [key: string]: IProgram } = {
  helloWorld,
  help,
  systemInfo,
  newTerminal,
};

export default programs;
