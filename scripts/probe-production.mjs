#!/usr/bin/env node
/**
 * Sonde de production — vérifie l'artefact réellement servi par l'hébergement.
 *
 * Pourquoi elle existe : le 2026-09-25, `sitemap.xml` a été publié pour la première
 * fois et la Search Console n'a jamais pu le relire ; personne ne l'a su pendant
 * cinq semaines. Les vérifications de la CI portent sur `.output/public`, donc sur
 * un artefact qui n'est pas encore passé par GitHub Pages (redirections 301,
 * cache Fastly, propagation du déploiement). Cette sonde ferme cet angle mort en
 * interrogeant l'origine publique.
 *
 * Invariants contrôlés :
 *   1. `robots.txt` est servi, déclare le sitemap absolu, et autorise l'exploration ;
 *   2. `sitemap.xml` est servi en XML, sans doublon, et toutes ses `loc` désignent
 *      la forme canonique de l'hébergement (barre finale) ;
 *   3. chaque `loc` répond 200 **sans redirection**, son `<link rel="canonical">`
 *      est identique au `loc`, et sa directive `robots` n'est pas `noindex` ;
 *   4. les artefacts AEO (`llms.txt`, `llms-full.txt`, `sitemap.md`) sont servis ;
 *   5. la forme sans barre finale redirige vers la forme canonique (liens anciens).
 *
 * Usage :
 *   node scripts/probe-production.mjs [--base <url>] [--attempts <n>] [--delay <ms>]
 *
 * `--base` vaut par défaut `NUXT_SITE_URL` (ou `PROBE_BASE_URL`). Les `loc` du
 * sitemap sont validées contre l'origine canonique déclarée par `llms.txt`, puis
 * récupérées via `--base` : la sonde peut donc aussi valider un build local servi
 * par un aperçu HTTP, avant tout déploiement.
 *
 * Sortie 0 si tout est conforme, 1 sinon (liste des écarts).
 */

import { setTimeout as sleep } from "node:timers/promises";

const USER_AGENT = "jouan-ovh-production-probe/1.0";
const REQUEST_TIMEOUT_MS = 20_000;
const REDIRECT_STATUSES = new Set([301, 302, 307, 308]);

/** @param {string[]} argv */
function parseArguments(argv) {
  const options = {
    base: process.env.NUXT_SITE_URL ?? process.env.PROBE_BASE_URL ?? "",
    attempts: 1,
    delay: 15_000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === "--base" && value) {
      options.base = value;
      index += 1;
    } else if (argument === "--attempts" && value) {
      options.attempts = Number(value);
      index += 1;
    } else if (argument === "--delay" && value) {
      options.delay = Number(value);
      index += 1;
    } else {
      throw new Error(`Argument inconnu : ${argument}`);
    }
  }

  if (!options.base) {
    throw new Error("Origine à sonder manquante : passer --base <url> ou définir NUXT_SITE_URL.");
  }
  if (!Number.isInteger(options.attempts) || options.attempts < 1) {
    throw new Error("--attempts doit être un entier >= 1.");
  }
  if (!Number.isFinite(options.delay) || options.delay < 0) {
    throw new Error("--delay doit être un nombre de millisecondes >= 0.");
  }

  return { ...options, base: trimTrailingSlash(new URL(options.base).origin) };
}

/** @param {string} value */
function trimTrailingSlash(value) {
  return value.replace(/\/+$/u, "");
}

/** @param {string} base @param {string} path @param {string} token */
function buildUrl(base, path, token) {
  const url = new URL(`${base}${path}`);
  // Contourne le cache Fastly (max-age=600) pour ne jamais valider un déploiement
  // précédent en croyant valider celui qui vient d'être publié.
  url.searchParams.set("probe", token);
  return url.toString();
}

/** @param {string} url */
async function request(url) {
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": USER_AGENT, "cache-control": "no-cache" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return { status: response.status, headers: response.headers, body: await response.text() };
}

/** @param {string} body @param {string} loc */
function extractCanonical(body, loc) {
  const match = body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/u);
  return match?.[1] ?? `absent (attendu ${loc})`;
}

/** @param {string} body */
function hasNoindexDirective(body) {
  const match = body.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/u);
  return Boolean(match && /noindex|none/iu.test(match[1]));
}

/**
 * Exécute la suite complète de contrôles et retourne la liste des écarts.
 *
 * @param {string} base
 * @param {string} token
 * @returns {Promise<string[]>}
 */
async function runChecks(base, token) {
  const problems = [];

  // 1. `llms.txt` : présence et origine canonique déclarée (source unique).
  const llms = await request(buildUrl(base, "/llms.txt", token));
  if (llms.status !== 200) {
    problems.push(`/llms.txt : statut ${llms.status} au lieu de 200.`);
  }
  const originLine = llms.body.match(/^Origine canonique : (\S+)$/mu)?.[1];
  const canonicalOrigin = originLine ? `${trimTrailingSlash(originLine)}/` : "";
  if (!canonicalOrigin) {
    problems.push("/llms.txt : ligne « Origine canonique : … » absente ou illisible.");
  }
  if (problems.length > 0) {
    // Sans origine canonique, les contrôles suivants n'ont pas de référentiel.
    return problems;
  }

  // 2. `robots.txt` : servi, typé, et déclarant le sitemap absolu.
  const robots = await request(buildUrl(base, "/robots.txt", token));
  if (robots.status !== 200) {
    problems.push(`/robots.txt : statut ${robots.status} au lieu de 200.`);
  }
  if (!(robots.headers.get("content-type") ?? "").toLowerCase().startsWith("text/plain")) {
    problems.push(`/robots.txt : content-type « ${robots.headers.get("content-type")} » au lieu de text/plain.`);
  }
  if (!robots.body.includes(`Sitemap: ${canonicalOrigin}sitemap.xml`)) {
    problems.push(`/robots.txt : « Sitemap: ${canonicalOrigin}sitemap.xml » absent.`);
  }

  // 3. `sitemap.xml` : servi en XML, `loc` canoniques, sans doublon.
  const sitemap = await request(buildUrl(base, "/sitemap.xml", token));
  if (sitemap.status !== 200) {
    problems.push(
      `/sitemap.xml : statut ${sitemap.status} au lieu de 200 (Search Console : « Impossible de récupérer le sitemap »).`,
    );
  }
  if (!/xml/iu.test(sitemap.headers.get("content-type") ?? "")) {
    problems.push(`/sitemap.xml : content-type « ${sitemap.headers.get("content-type")} » au lieu d'un type XML.`);
  }
  const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1].trim());
  if (locs.length === 0) {
    problems.push("/sitemap.xml : aucune entrée <loc>.");
  }
  const duplicates = [...new Set(locs.filter((loc, index) => locs.indexOf(loc) !== index))];
  if (duplicates.length > 0) {
    problems.push(`/sitemap.xml : entrées dupliquées (${duplicates.join(", ")}).`);
  }
  if (!locs.includes(canonicalOrigin)) {
    problems.push(`/sitemap.xml : la racine ${canonicalOrigin} est absente.`);
  }

  for (const loc of locs) {
    if (!loc.startsWith(canonicalOrigin)) {
      problems.push(`/sitemap.xml : « ${loc} » n'appartient pas à l'origine canonique ${canonicalOrigin}.`);
      continue;
    }
    if (loc !== canonicalOrigin && !loc.endsWith("/")) {
      problems.push(
        `/sitemap.xml : « ${loc} » n'utilise pas la forme canonique « ${loc}/ » ` +
          "(l'hébergement redirige la forme sans barre : « Page avec redirection »).",
      );
      continue;
    }

    // 4. Chaque page listée répond 200 sans redirection, canonical concordant.
    const path = loc.slice(trimTrailingSlash(canonicalOrigin).length) || "/";
    const page = await request(buildUrl(base, path, token));
    if (page.status !== 200) {
      problems.push(`${path} : statut ${page.status} au lieu de 200.`);
      continue;
    }
    const canonicalHref = extractCanonical(page.body, loc);
    if (canonicalHref !== loc) {
      problems.push(`${path} : canonical « ${canonicalHref} » différent du loc « ${loc} ».`);
    }
    if (hasNoindexDirective(page.body)) {
      problems.push(`${path} : directive robots « noindex » en production.`);
    }
  }

  // 5. Artefacts AEO publiés (leur absence silencieuse casse la couverture AEO).
  for (const path of ["/llms-full.txt", "/sitemap.md"]) {
    const artifact = await request(buildUrl(base, path, token));
    if (artifact.status !== 200) {
      problems.push(`${path} : statut ${artifact.status} au lieu de 200.`);
    }
  }

  // 6. Les liens anciens sans barre finale continuent de rediriger (pas de 404).
  const redirectTarget = locs.find((loc) => loc !== canonicalOrigin);
  if (redirectTarget) {
    const path = redirectTarget.slice(trimTrailingSlash(canonicalOrigin).length);
    const legacy = await request(buildUrl(base, trimTrailingSlash(path), token));
    const location = legacy.headers.get("location");
    const locationPath = location ? new URL(location, `${base}/`).pathname : "";
    if (!REDIRECT_STATUSES.has(legacy.status) || locationPath !== trimTrailingSlash(path) + "/") {
      problems.push(
        `${trimTrailingSlash(path)} : redirection attendue vers ${trimTrailingSlash(path)}/ ` +
          `(statut ${legacy.status}, cible « ${location ?? "aucune"} »).`,
      );
    }
  }

  return problems;
}

async function main() {
  const { base, attempts, delay } = parseArguments(process.argv.slice(2));
  let lastProblems = [];

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    // Le jeton change à chaque tentative : une réponse mise en cache entre-temps
    // ne peut pas masquer un déploiement en cours de propagation.
    const token = `${Date.now()}-${attempt}`;
    try {
      lastProblems = await runChecks(base, token);
    } catch (error) {
      lastProblems = [`Échec réseau : ${error instanceof Error ? error.message : String(error)}`];
    }

    if (lastProblems.length === 0) {
      console.log(`Sonde de production : conforme après ${attempt} tentative(s) sur ${base}.`);
      return;
    }

    if (attempt < attempts) {
      console.log(`Tentative ${attempt}/${attempts} non conforme, nouvelle tentative dans ${delay} ms.`);
      await sleep(delay);
    }
  }

  console.error(`Sonde de production : ${lastProblems.length} écart(s) sur ${base}.`);
  for (const problem of lastProblems) {
    console.error(`  - ${problem}`);
  }
  process.exitCode = 1;
}

await main();
