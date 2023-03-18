import { IProgram } from "~/components/terminal/interfaces";

const newTerminal: IProgram = {
  command: "new",
  description: "Ouvre un nouveau terminal.",
  initialData: "Data dans la nouvelle fenêtre.",
  run: (_, createNewTerminal, initialData?: string) => {
    if (createNewTerminal && initialData) {
      createNewTerminal(initialData);
      return `Nouvelle fenêtre de terminal ouverte avec les données suivantes : ${initialData}`;
    }

    if (createNewTerminal) {
      createNewTerminal();
      return "Un nouveau terminal a été ouvert.";
    }

    return "Impossible d'ouvrir un nouveau terminal.";
  },
};

export default newTerminal;
