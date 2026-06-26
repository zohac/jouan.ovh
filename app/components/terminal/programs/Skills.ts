import type { IProgram } from "~/components/terminal/interfaces";

// Stack technique — reprise du UI kit (`TerminalScreen.jsx` / `data.js`), alignée sur les tags
// de la home. Séparateur « · » (et non double espace) : les sorties de commandes rendent dans
// `.terminal-response { white-space: normal }`, où les espaces consécutifs s'effondrent.
const skillsList = [
  "php",
  "symfony",
  "wordpress",
  "node.js",
  "nest.js",
  "nuxt.js",
  "vue",
  "typescript",
  "docker",
  "tailwind",
  "n8n",
  "mysql",
];

const skills: IProgram = {
  command: "skills",
  description: "Ma stack technique.",
  run: function (): string {
    return `Ma stack : ${skillsList.join(" · ")}`;
  },
};

export default skills;
