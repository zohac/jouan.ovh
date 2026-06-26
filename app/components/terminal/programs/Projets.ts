import type { IProgram } from "~/components/terminal/interfaces";

interface IProject {
  name: string;
  role: string;
  desc: string;
  url: string;
}

// Projets — reprise du UI kit (`TerminalScreen.jsx` / `data.js`), alignés sur la section
// « Projets sélectionnés » de la home. Rendu en `<ul>` (cohérent avec `help`/`system-info`) :
// les `<li>` portent les retours à la ligne sous `white-space: normal`.
const projects: IProject[] = [
  {
    name: "keova.app",
    role: "Fondateur · SaaS",
    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
    url: "https://keova.app",
  },
  {
    name: "patio-conseil.fr",
    role: "Client",
    desc: "Site et outils pour un cabinet de conseil.",
    url: "https://patio-conseil.fr",
  },
];

const projets: IProgram = {
  command: "projets",
  description: "Mes projets.",
  run: function (): string {
    const items = projects.map((p) => `<li>${p.name} — ${p.role} — ${p.desc} (${p.url})</li>`).join("");
    return `<ul>${items}</ul>`;
  },
};

export default projets;
