import { SITE } from "~/data/site";
import type { IProgram } from "~/components/terminal/interfaces";

// Stack technique — source unique `app/data/site.ts`. Séparateur « · » (et non double espace) :
// les sorties rendent dans `.terminal-response { white-space: normal }`, où les espaces
// consécutifs s'effondrent.
const skills: IProgram = {
  command: "skills",
  description: "Ma stack technique.",
  run: function (): string {
    return `Ma stack : ${SITE.skills.join(" · ")}`;
  },
};

export default skills;
