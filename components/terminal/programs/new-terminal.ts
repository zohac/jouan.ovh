import { IProgram } from "~/components/terminal/programs/index";

const newTerminal: IProgram = {
  command: "new",
  description: "Ouvre un nouveau terminal.",
  run: (_, createNewTerminal) => {
    if (createNewTerminal) {
      createNewTerminal();
      return "Un nouveau terminal a été ouvert.";
    } else {
      return "Impossible d'ouvrir un nouveau terminal.";
    }
  },
};

export default newTerminal;
