import { SITE } from "~/data/site";
import type { IProgram } from "~/components/terminal/interfaces";

// Contact — source unique `app/data/site.ts`. Rendu en `<ul>` ; français, vouvoiement,
// pas d'emoji (NFR6).
const contact: IProgram = {
  command: "contact",
  description: "Comment me joindre.",
  run: function (): string {
    const statut = SITE.profile.available ? "disponible pour de nouveaux projets" : "indisponible pour le moment";
    return [
      "<ul>",
      `<li>email : ${SITE.profile.email}</li>`,
      `<li>ville : ${SITE.profile.city}</li>`,
      `<li>statut : ${statut}</li>`,
      "<li>formulaire : la page Contact du site</li>",
      "</ul>",
    ].join("");
  },
};

export default contact;
