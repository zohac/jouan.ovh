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
  shortRole?: string;
  bio?: string;
  email: string;
  city: string;
  available: boolean;
  maltUrl?: string;
  phone?: string;
  phoneRaw?: string;
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
  role: "Développeur Full Stack spécialisé en systèmes IA & automatisation métier",
  shortRole: "Développeur Full Stack spécialisé IA & automatisation",
  bio: "Conception et industrialisation d'applications web, agents IA et pipelines d'automatisation métier de bout en bout.",
  email: "simon@jouan.ovh",
  city: "France · Remote",
  available: true,
  maltUrl: "https://www.malt.fr/profile/simonjouan",
  phone: "+33 6 58 96 90 20",
  phoneRaw: "+33658969020",
};

// Stack technique moderne prioritaire ordonnée.
const skills: string[] = [
  "typescript",
  "node.js",
  "nest.js",
  "nuxt",
  "vue",
  "postgresql",
  "mcp",
  "docker",
  "whisper.cpp",
  "sherpa-onnx",
  "llama.cpp",
  "bullmq",
  "rest-api",
  "vitest",
];

const projects: IProject[] = [
  {
    name: "Keova Signal",
    role: "Concepteur & Développeur Full Stack",
    desc: "Moteur d'acquisition B2B & qualification de leads par ingestion Open Data Insee, scraping éthique et serveur MCP natif.",
    status: "● Système interne / Dépôt privé",
    tags: ["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"],
  },
  {
    name: "Debrief",
    role: "Concepteur & Développeur Full Stack",
    desc: "Application desktop privacy-first de synthèse commerciale 100 % locale (ASR whisper.cpp, diarisation sherpa-onnx, LLM Gemma 4).",
    status: "◐ R&D / Dépôt privé",
    tags: ["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"],
  },
  {
    name: "Devis-Assist",
    role: "Architecte & Développeur Full Stack",
    desc: "Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ et matching flou PostgreSQL.",
    status: "○ Architecture validée / Dépôt privé",
    tags: ["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"],
  },
];

const legacyProjects: IProject[] = [
  {
    name: "Keova App",
    role: "Co-fondateur & Développeur Full Stack",
    desc: "Application SaaS de gestion opérationnelle complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
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
    role: "Créateur · R&D agents IA",
    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    status: "◐ R&D / En cours",
    tags: ["TypeScript", "Electron", "Agents", "IA"],
  },
];

export const SITE = { profile, skills, projects, legacyProjects } as const;
