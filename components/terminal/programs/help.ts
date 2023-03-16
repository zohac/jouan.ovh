import programs, { IProgram } from "./index";

const help: IProgram = {
  command: "help",
  description: "Liste les commandes disponibles.",
  run: function (): string {
    const commands = Object.values(programs)
      .map((p) => `<li>${p.command} - ${p.description}</li>`)
      .join("");
    return `<ul>${commands}</ul>`;
  },
};

export default help;
