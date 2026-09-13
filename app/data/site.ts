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
  maltUrl?: string;
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  url?: string;
  status?: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
  email: "simon@jouan.ovh",
  city: "Rouen, France",
  available: true,
  maltUrl: "https://www.malt.fr/profile/simonjouan",
};

// Stack technique moderne prioritaire ordonnée.
const skills: string[] = [
  "typescript",
  "nuxt",
  "vue",
  "nest.js",
  "node.js",
  "postgresql",
  "typeorm",
  "stripe",
  "cypress",
  "docker",
  "rest-api",
  "vitest",
];

const projects: IProject[] = [
  {
    name: "Keova App",
    role: "Co-fondateur & Développeur Full Stack",
    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    url: "https://keova.app",
    status: "● En production",
    tags: ["Nuxt 4", "NestJS", "PostgreSQL", "Stripe Connect", "SaaS"],
  },
  {
    name: "TryOn",
    role: "CTO & Développeur Full Stack",
    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    status: "○ Étude de cas (MVP livré)",
    tags: ["Nuxt 3", "NestJS", "Python", "ComfyUI", "IA"],
  },
  {
    name: "Nodium",
    role: "Créateur & Ingénieur IA",
    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    status: "◐ R&D / En cours",
    tags: ["TypeScript", "Electron", "Agents", "IA"],
  },
];

export const SITE = { profile, skills, projects } as const;
