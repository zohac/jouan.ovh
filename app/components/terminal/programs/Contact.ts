import type { IProgram } from "~/components/terminal/interfaces";

// Contact — reprise du UI kit (`TerminalScreen.jsx` / `data.js`). Rendu en `<ul>` (cohérent
// avec les autres sorties riches) ; français, vouvoiement, pas d'emoji (NFR6).
const contact: IProgram = {
  command: "contact",
  description: "Comment me joindre.",
  run: function (): string {
    return [
      "<ul>",
      "<li>email : simon@jouan.ovh</li>",
      "<li>ville : Valognes, France</li>",
      "<li>statut : disponible pour de nouveaux projets</li>",
      "<li>formulaire : la page Contact du site</li>",
      "</ul>",
    ].join("");
  },
};

export default contact;
