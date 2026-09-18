# Observabilité SEO & Vérification Google Search Console

Ce document formalise la stratégie retenue pour la validation de propriété du domaine `jouan.ovh` dans Google Search Console ainsi que la génération des artefacts d'exploration (`sitemap.xml` et `robots.txt`).

---

## 1. Méthode Retenue : Vérification par Enregistrement DNS TXT chez OVH

Suite à l'arbitrage du propriétaire de projet, la vérification de propriété Google Search Console s'effectue exclusivement par voie DNS :

- **Périmètre :** Propriété de type « Domaine » couvrant l'ensemble du domaine apex `jouan.ovh` et ses sous-domaines (`dev.jouan.ovh`, etc.).
- **Action requise :** Création d'une entrée DNS de type `TXT` dans la zone DNS OVH du domaine `jouan.ovh` :
  ```text
  google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  ```
- **Impact sur le code applicatif :** Zéro modification requise dans le dépôt Git (pas de balise meta dans `nuxt.config.ts`, pas de fichier HTML à déposer dans `public/`).

---

## 2. Génération Statique du Sitemap XML (`sitemap.xml`)

- **URL de production :** `https://jouan.ovh/sitemap.xml`
- **Mécanisme :** Généré automatiquement lors de la commande `pnpm generate` (Nitro SSG).
- **Consommation de l'URL de base :** Préfixage impératif via `useSiteUrl()` conformément à la règle d'or d'[`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md) (aucun hardcoding de domaine).
- **Couverture des routes canoniques :**
  - Page d'accueil : `/`
  - Offres de services : `/services`
  - Profil & Biographie : `/about`
  - Contact : `/contact`
  - Blog & Index : `/blog`
  - Articles de blog : toutes les entrées présentes dans `content/blog/*.md`
  - Mentions légales : `/mentions-legales`
  - Politique de confidentialité : `/confidentialite`
- **Fréquence et priorité :** Balises `<lastmod>` calquées sur la dernière modification des fichiers, `<changefreq>` et `<priority>` ajustées selon l'importance de conversion (priorité maximale sur `/` et `/services`).

---

## 3. Configuration du Fichier `robots.txt`

Le fichier `public/robots.txt` est versionné dans le dépôt avec le contenu strict suivant :

```text
User-agent: *
Allow: /

# Emplacement du sitemap officiel
Sitemap: https://jouan.ovh/sitemap.xml
```

---

## 4. Démarche de Validation dans Google Search Console

1. Simon Jouan crée la propriété de type « Domaine » (`jouan.ovh`) dans Google Search Console.
2. Google fournit une chaîne de vérification TXT.
3. Simon ajoute l'entrée TXT sur l'interface OVH (Zone DNS).
4. La validation est confirmée dans GSC après propagation DNS.
5. Une fois le déploiement de `sitemap.xml` effectué sur `main`, Simon soumet l'URL `https://jouan.ovh/sitemap.xml` dans le menu « Sitemaps » de GSC pour déclencher l'exploration et l'indexation initiale.
