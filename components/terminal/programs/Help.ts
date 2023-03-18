import { IProgram } from "~/components/terminal/interfaces";
import programManager from "~/components/terminal/programs/ProgramManager";

const help: IProgram = {
  command: "help",
  description: "Liste les commandes disponibles.",
  run: function (): string {
    const commands = (Object.values(programManager.programs) as IProgram[])
      .map((p) => `<li>${p.command} - ${p.description}</li>`)
      .join("");
    return `<ul>${commands}</ul>`;
  },
};

export default help;
