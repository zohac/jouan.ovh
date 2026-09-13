import { SITE } from "~/data/site";
import type { IProgram } from "~/components/terminal/interfaces";

// Projets — source unique `app/data/site.ts`. Rendu en `<ul>` (cohérent avec `help`/`system-info`) :
// les `<li>` portent les retours à la ligne sous `white-space: normal`.
const projets: IProgram = {
  command: "projets",
  description: "Mes projets.",
  run: function (): string {
    const items = SITE.projects
      .map((p) => {
        const status = p.status ? ` [${p.status}]` : "";
        const url = p.url ? ` (${p.url})` : "";
        return `<li>${p.name} — ${p.role} — ${p.desc}${status}${url}</li>`;
      })
      .join("");
    return `<ul>${items}</ul>`;
  },
};

export default projets;
