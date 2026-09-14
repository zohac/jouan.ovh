import { SITE } from "~/data/site";
import type { IProgram } from "~/components/terminal/interfaces";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Projets — source unique `app/data/site.ts`. Rendu en `<ul>` (cohérent avec `help`/`system-info`) :
// les `<li>` portent les retours à la ligne sous `white-space: normal`.
const projets: IProgram = {
  command: "projets",
  description: "Mes projets.",
  run: function (): string {
    const items = SITE.projects
      .map((p) => {
        const status = p.status ? ` [${escapeHtml(p.status)}]` : "";
        const url = p.url ? ` (${escapeHtml(p.url)})` : "";
        return `<li>${escapeHtml(p.name)} — ${escapeHtml(p.role)} — ${escapeHtml(p.desc)}${status}${url}</li>`;
      })
      .join("");
    return `<ul>${items}</ul>`;
  },
};

export default projets;
