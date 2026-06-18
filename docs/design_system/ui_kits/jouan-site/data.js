/* Shared content for the jouan-site kit (French). Drawn from the
   source site's About program + the user's positioning brief. */

window.SITE = {
  name: "Simon Jouan",
  role: "Développeur web freelance",
  tagline: "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.",
  city: "Valognes, France",
  email: "simon@jouan.ovh",
  available: true,

  stats: [
    { n: "8+", l: "ans dans la tech" },
    { n: "3", l: "stacks maîtrisés" },
    { n: "1", l: "SaaS fondé · keova.app" },
  ],

  services: [
    {
      icon: "wp",
      title: "WordPress sur-mesure",
      desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
      points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
      price: "à partir de 1 500 €",
      featured: false,
    },
    {
      icon: "code",
      title: "Applications web",
      desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
      points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
      price: "sur devis",
      featured: true,
    },
    {
      icon: "spark",
      title: "IA & automatisation",
      desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
      points: ["Agents & workflows (n8n)", "Intégration d'API LLM", "Automatisation de contenu"],
      price: "sur devis",
      featured: false,
    },
  ],

  projects: [
    { name: "keova.app", role: "Fondateur · SaaS", desc: "Plateforme SaaS que je conçois et opère de bout en bout.", tags: ["nest.js", "nuxt", "saas"], url: "https://keova.app" },
    { name: "patio-conseil.fr", role: "Client", desc: "Site et outils pour un cabinet de conseil.", tags: ["wordpress", "conseil"], url: "https://patio-conseil.fr" },
  ],

  experiences: [
    { date: "02/2021 — aujourd'hui", org: "Linkizz", role: "Testeur QA", desc: "Tests automatisés — Node.js, TypeScript, TestCafé." },
    { date: "05/2020 — 12/2021", org: "CINS", role: "Développeur Full Stack", desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker." },
    { date: "07/2007 — 05/2019", org: "A+ Métrologie / Trescal", role: "Métrologue", desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme." },
  ],

  degrees: [
    { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
    { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
  ],

  skills: ["php", "symfony", "wordpress", "node.js", "nest.js", "nuxt.js", "vue", "typescript", "docker", "tailwind", "n8n", "mysql"],

  posts: [
    {
      slug: "ia-dans-wordpress",
      title: "Intégrer un agent IA dans WordPress proprement",
      desc: "Comment brancher un LLM sur WordPress sans transformer votre site en usine à gaz — architecture, sécurité, et coûts.",
      date: "12 juin 2026",
      read: "8 min",
      tags: ["wordpress", "ia", "architecture"],
      img: "../../assets/backgrounds/hacker-den-1.png",
    },
    {
      slug: "nuxt-symfony-archi",
      title: "Nuxt + Symfony : une architecture qui tient la route",
      desc: "Le découpage front/back que j'utilise sur keova.app, et pourquoi la Clean Architecture m'a fait gagner du temps.",
      date: "28 mai 2026",
      read: "11 min",
      tags: ["nuxt", "symfony", "clean-archi"],
      img: "../../assets/backgrounds/hacker-den-2.png",
    },
    {
      slug: "n8n-automatisation",
      title: "Automatiser sa veille avec n8n et un peu de code",
      desc: "Un workflow n8n concret pour collecter, résumer et publier — le tout piloté par quelques nœuds et une touche de LLM.",
      date: "9 mai 2026",
      read: "6 min",
      tags: ["n8n", "automatisation", "ia"],
      img: "../../assets/backgrounds/hacker-den-3.png",
    },
  ],

  social: [
    { icon: "github", url: "https://github.com/zohac", label: "GitHub" },
    { icon: "twitter", url: "https://twitter.com/fenrir0680", label: "Twitter" },
    { icon: "linkedin", url: "https://www.linkedin.com/in/simonjouan/", label: "LinkedIn" },
  ],
};
