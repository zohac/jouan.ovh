// Source de vérité unique du CONTENU partagé du site (DRY / SRP : les données vivent ici,
// les composants/programmes ne font que les présenter). Forme portée de
// `docs/design_system/ui_kits/jouan-site/data.js` (référence du UI kit).
//
// Consommé par : pages (`index.vue`, `about.vue`, `contact.vue`), `FooterComponent.vue`,
// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
//
// NB : `experiences` / `degrees` ne sont PAS centralisés ici — leurs formes et leur niveau
// de détail divergent volontairement entre le CV terminal (`About.ts`, détaillé) et la page
// `/about` (condensée). Leur réconciliation est une décision de contenu, suivie dans
// `deferred-work.md`, pas un simple refactor.

export interface IProfile {
  name: string;
  role: string;
  email: string;
  city: string;
  available: boolean;
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  url: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur web freelance",
  email: "simon@jouan.ovh",
  city: "Valognes, France",
  available: true,
};

// Stack technique — ordre conservé (tags hero de la home = sous-ensemble curé, non dérivé d'ici).
const skills: string[] = [
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

const projects: IProject[] = [
  {
    name: "keova.app",
    role: "Fondateur · SaaS",
    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
    url: "https://keova.app",
    tags: ["nest.js", "nuxt", "saas"],
  },
  {
    name: "patio-conseil.fr",
    role: "Client",
    desc: "Site et outils pour un cabinet de conseil.",
    url: "https://patio-conseil.fr",
    tags: ["wordpress", "conseil"],
  },
];

export const SITE = { profile, skills, projects } as const;
