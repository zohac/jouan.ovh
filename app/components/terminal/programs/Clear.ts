import type { IProgram } from "~/components/terminal/interfaces";

// `clear` est intercepté par `TerminalComponent.submitInput` — seul le composant possède le
// buffer `commandLines` à vider, et l'interception permet d'effacer l'écran SANS écho ni ligne
// résiduelle. Ce programme existe pour que la commande soit découvrable via `help` (liste
// dynamique du `ProgramManager`) ; son `run` n'est donc pas exécuté dans le flux normal —
// fallback défensif renvoyant une chaîne vide si jamais il était appelé directement.
const clear: IProgram = {
  command: "clear",
  description: "Vide le terminal.",
  run: function (): string {
    return "";
  },
};

export default clear;
