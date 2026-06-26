---
baseline_commit: 15ada823eed910cf51613f57687efe0511723b46
---

# Story 8.2: Préserver les commandes et l'ouverture

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want que toutes les commandes du terminal marchent,
so that l'easter-egg reste fonctionnel après refonte (FR10, NFR9).

## Acceptance Criteria

**Given** le sous-système terminal restylé
**When** on teste l'ouverture modale et les commandes
**Then** `help`, `about`, `skills`, `projets`, `contact`, `clear` répondent sans régression
**And** le terminal reste draggable

## Tasks / Subtasks

- [x] Tâche 1 — Vérifier l'ouverture / la fermeture (AC: ouverture modale)
  - [x] Vérifier que `TerminalButton.vue` émet `open-terminal` et que le consommateur (manager/layout) crée bien une instance via `TerminalManagerComponent.createNewTerminal()`.
  - [x] Vérifier que la fenêtre s'affiche, prend le focus de l'input (`focusUserInput`) et se ferme via la pastille (`closeTerminal`) sans régression après le restyle (Story 8.1).
- [x] Tâche 2 — Vérifier le drag (AC: reste draggable)
  - [x] Drag depuis le header (`handleHeaderMouseDown` + écouteurs globaux `mousemove`/`mouseup`) déplace la fenêtre et la borne dans le viewport.
  - [x] Le resize (`.resize-handle`) et la remontée de z-index au focus continuent de fonctionner.
- [x] Tâche 3 — Vérifier les commandes existantes (AC: répondent sans régression)
  - [x] Recenser les programmes réellement enregistrés dans `ProgramManager.ts` et confirmer leur fonctionnement après restyle : `help`, `about`, `helloWorld`, `new`, `system-info`.
  - [x] Tester `help` (liste dynamique des commandes), `about` (bio + sortie riche), `system-info` (UAParser), `new` (ouvre un second terminal via `createNewTerminal`), `helloWorld`.
  - [x] Vérifier que les sorties HTML (`v-html`, tables `.table`) rendent toujours correctement avec le nouveau style (les sélecteurs `table`/`.table` du composant doivent rester opérants).
- [x] Tâche 4 — Ajouter les commandes manquantes (AC: `skills`, `projets`, `contact`, `clear`) — **DÉCISION PO : on ajoute les commandes (alignement UI kit, CAP-10).**
  - [x] Ajouter les programmes manquants `skills`, `projets`, `contact` comme nouveaux `IProgram` (`<script setup>`/TS, pattern existant) en réutilisant le contenu du UI kit (`TerminalScreen.jsx` : `skills`, `projets`, `contact`) et `data.js`, enregistrés dans `ProgramManager` et exportés dans le barrel `index.ts`.
  - [x] Implémenter `clear` : soit comme programme spécial vidant `commandLines`, soit en cas particulier dans `submitInput`/`runCommand` (cf. `TerminalScreen.jsx` qui traite `clear` à part en réinitialisant les lignes). Préciser le mécanisme retenu dans le File List.
  - [x] Vérifier que `help` (liste dynamique) affiche bien les nouvelles commandes une fois enregistrées.
- [x] Tâche 5 — Non-régression globale (AC: tout, NFR9)
  - [x] Historique de commandes (flèches haut/bas), « Commande inconnue : … », bannière `initialData` (ASCII S/J) toujours présents.
  - [x] `yarn lint` + `yarn generate` verts.

## Dev Notes

### Périmètre

- Cette story **valide le non-régression fonctionnel** du sous-système terminal après le restyle de la Story 8.1, et **couvre l'écart de commandes** entre l'AC d'epics et le code réel. Le style est traité en 8.1 ; ici l'accent est sur le comportement (ouverture, drag, commandes).
- Dépend de la Story 8.1 (restyle) et d'Epic 1 (stack verte). Pour le contenu de `skills`/`projets`/`contact`, s'appuie sur le UI kit / `data.js` (Epic 2+), sans dépendre d'une story future en particulier.

### Écart IMPORTANT — commandes attendues vs commandes présentes

Inventaire réel de `components/terminal/programs/` (enregistrement dans `ProgramManager.ts`) :

| Commande (clé `command`) | Programme | Présent ? | Dans l'AC ? |
|---|---|---|---|
| `help` | `Help.ts` | Oui | Oui |
| `about` | `About.ts` | Oui | Oui |
| `helloWorld` | `HelloWorld.ts` | Oui | Non |
| `new` | `NewTerminal.ts` | Oui (ouvre un nouveau terminal) | Non |
| `system-info` | `SystemInfos.ts` | Oui (UAParser) | Non |
| `skills` | — | **Manquant** | Oui |
| `projets` | — | **Manquant** | Oui |
| `contact` | — | **Manquant** | Oui |
| `clear` | — | **Manquant** (aucun traitement de `clear` dans `TerminalComponent.vue`) | Oui |

- L'AC d'epics 8.2 (« `help`, `about`, `skills`, `projets`, `contact`, `clear` répondent sans régression ») suppose des commandes qui **n'existent pas encore** dans le code. Le UI kit cible (`ui_kits/jouan-site/TerminalScreen.jsx`) les définit pourtant (objet `COMMANDS` + cas spécial `clear`). Deux lectures possibles, à trancher avec le PO :
  1. **Aligner sur le UI kit** : ajouter `skills`, `projets`, `contact` et `clear` pour que le terminal Vue corresponde à la cible DS (recommandé — c'est l'intention de CAP-10). Le contenu vient de `TerminalScreen.jsx` / `data.js`.
  2. **Périmètre « préservation seule »** : ne vérifier que les commandes réellement présentes (`help`, `about`, `helloWorld`, `new`, `system-info`) et requalifier l'AC.
- Quelle que soit l'option, **NFR9 = aucune commande existante cassée** reste impératif : ne pas supprimer `helloWorld`/`new`/`system-info` même si elles ne sont pas dans l'AC.

### Fichiers concernés (lus — état actuel)

- **`components/terminal/programs/ProgramManager.ts`** — singleton ; `add(help)`, `add(helloWorld)`, `add(newTerminal)`, `add(systemInfo)`, `add(about)`. `add()` jette si la clé existe déjà → éviter les doublons en ajoutant `skills`/`projets`/`contact`.
- **`components/terminal/programs/index.ts`** — barrel des exports de programmes ; ajouter les nouveaux ici.
- **`components/terminal/programs/Help.ts`** — `help` liste dynamiquement `Object.values(programManager.programs)` → afficher de nouvelles commandes est automatique une fois enregistrées.
- **`components/terminal/programs/About.ts`** (`about`), **`SystemInfos.ts`** (`system-info`, UAParser), **`NewTerminal.ts`** (`new`, via `createNewTerminal`), **`HelloWorld.ts`** (`helloWorld`).
- **`components/terminal/interfaces/IProgram.ts`** — contrat : `{ command, description, initialData?, run(config?, createNewTerminal?, initialData?) => string | HTMLElement }`. Tout nouveau programme doit le respecter.
- **`components/terminal/TerminalComponent.vue`** — `submitInput` → `runCommand` → `programManager.get(command)`; sinon « Commande inconnue : … ». **Pas de traitement de `clear`** aujourd'hui → à ajouter si l'option 1 est retenue (vider `commandLines.value`). Drag/resize/focus/historique = handlers à préserver tels quels.
- **`components/terminal/TerminalManagerComponent.vue`** — `createNewTerminal()` instancie un terminal ; alimente l'ouverture et `new`.
- **`components/terminal/TerminalButton.vue`** — émet `open-terminal` (déclencheur d'ouverture modale).
- **`terminal.config.ts`** — `userName`/`domainName`/`initialData` ; ne pas casser.

### Ce qui doit être PRÉSERVÉ (NFR9 / CAP-10)

- Ouverture modale + focus input ; fermeture par la pastille close.
- **Drag** (header) et resize, remontée de z-index au focus.
- Exécution via `programManager` ; historique flèches haut/bas ; message « Commande inconnue ».
- Sorties HTML riches (`v-html`, tables `.table`) — vérifier le rendu sous le nouveau style.
- Toutes les commandes déjà enregistrées, y compris celles hors AC (`helloWorld`, `new`, `system-info`).

### Pièges / régressions à éviter

- Le `<style>` de `TerminalComponent.vue` est **non scoped** et contient les styles `table`/`.table` consommés par `about`/`system-info` via `v-html` — un restyle (8.1) peut les casser ; les revalider ici.
- `ProgramManager.add()` lève une erreur sur clé en double — ne pas réenregistrer une commande existante.
- Compatibilité prerender (NFR4) : `system-info` utilise UAParser côté client ; le terminal s'instancie via interaction utilisateur (post-mount), donc OK, mais ne pas déplacer cette logique en SSR.
- Ne pas régresser `CNAME` / déploiement (NFR5) ; `yarn generate` doit rester vert.
- Contenu en français, 1re personne, vouvoiement, pas d'emoji (NFR6) pour les nouvelles sorties `skills`/`projets`/`contact`.

### Testing standards

- Pas de framework de test (project-context.md). Validation = `yarn lint` + `yarn generate` verts + **vérification manuelle** :
  - ouvrir le terminal (bouton), constater le focus input ;
  - drag depuis le header + resize + close OK ;
  - exécuter chaque commande de l'AC retenue et vérifier la réponse (et `clear` qui vide l'écran) ;
  - exécuter les commandes legacy préservées (`helloWorld`, `new`, `system-info`) ;
  - historique flèches haut/bas + « Commande inconnue : … ».

### References

- [Source: docs/planning-artifacts/epics.md#Epic 8 — Story 8.2]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-10, #Constraints (Easter-egg terminal conservé)]
- [Source: docs/design_system/ui_kits/jouan-site/TerminalScreen.jsx — COMMANDS (help/about/skills/projets/contact) + cas clear]
- [Source: components/terminal/programs/ProgramManager.ts, index.ts, Help.ts, About.ts, SystemInfos.ts, NewTerminal.ts, HelloWorld.ts]
- [Source: components/terminal/interfaces/IProgram.ts]
- [Source: components/terminal/TerminalComponent.vue, TerminalManagerComponent.vue, TerminalButton.vue, terminal.config.ts]
- [Source: docs/project-context.md#À préserver pendant la refonte, #Tests, #Langue]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story, effort high)

### Debug Log References

- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered) après ajout des 4 programmes + interception `clear`.
- Vérification fonctionnelle complète au navigateur (Chrome DevTools MCP, terminal réel ouvert depuis le header) :
  - **Ouverture** : input focalisé à l'ouverture (`focusedOnOpen: true`), bannière ASCII présente.
  - **`help`** liste dynamiquement les **9** commandes, dont les 4 nouvelles (skills/projets/contact/clear).
  - **Nouvelles commandes** : `skills` → « Ma stack : php · symfony · … » (séparateur `·` qui survit à `white-space: normal`) ; `projets` / `contact` → `<ul>` rendus correctement.
  - **`clear`** : vide tout (0 ligne de commande, 0 réponse, bannière incluse), ne laisse que le prompt vivant — sans écho ni ligne résiduelle.
  - **Commandes legacy préservées** : `system-info` (UAParser), `helloWorld`, `new` (ouvre un 2ᵉ terminal), `about` (ouvre un terminal avec **4 tables**) — toutes OK.
  - **Drag** 1:1 (déplacement = déplacement curseur, ex. +160/+108 px exacts), **resize** OK, **z-index** remonté au focus, **close** → `display:none`.
  - **Historique** flèches haut/bas correct (`skills`→`contact`→`skills`) ; **« Commande inconnue : … »** présent et **HTML échappé** (injection `<img onerror>` rendue inerte : `&lt;img …&gt;`, aucun `<img>` créé).

### Completion Notes List

- **Périmètre** : story de non-régression (8.1) **+** ajout des commandes manquantes (décision PO Tâche 4). Le sous-système reste en **Options API** (la migration `<script setup>` est la story 8.3) — on n'a touché qu'aux programmes TS et à un cas particulier `clear` dans `submitInput`, sans réécrire le composant.
- **Nouvelles commandes** (`programs/Skills.ts`, `Projets.ts`, `Contact.ts`) : nouveaux `IProgram` au pattern existant, contenu repris du UI kit (`TerminalScreen.jsx`) / `data.js`, en français/vouvoiement/sans emoji (NFR6). Enregistrées dans `ProgramManager` + barrel `index.ts`. `help` étant dynamique (`Object.values(programManager.programs)`), elles apparaissent automatiquement.
- **Sorties & interaction avec le fix 8.1** : `.terminal-response` est en `white-space: normal` (corrigé en 8.1) → les sorties multi-lignes utilisent du **HTML** (`<ul>`) et un séparateur **`·`** (les espaces consécutifs s'effondrent), pas de `\n`.
- **`clear`** (mécanisme retenu) : **cas particulier dans `TerminalComponent.submitInput`** (seul le composant possède le buffer `commandLines`) qui vide `commandLines` sans écho ni résidu ; un programme `programs/Clear.ts` est enregistré uniquement pour la **découvrabilité via `help`** (son `run` est un fallback défensif). Cf. `TerminalScreen.jsx` qui traite aussi `clear` à part.
- **Écart de doc corrigé** : la story référence `TerminalButton.vue` « émettant `open-terminal` » — **ce fichier n'existe pas**. Le déclencheur réel d'ouverture est le(s) `ZButton variant="terminal"` du **`HeaderComponent`** (desktop + menu mobile) → `terminalManager.createNewTerminal()`, et le lanceur partagé `useTerminal` (hero d'accueil). Ouverture vérifiée OK par ce chemin réel.
- **NFR9 respecté** : aucune commande existante cassée (`helloWorld`/`new`/`system-info` conservées et fonctionnelles) ; drag/resize/focus/historique/échappement inchangés et re-vérifiés.

### File List

- `app/components/terminal/programs/Skills.ts` (NOUVEAU — programme `skills`, stack technique reprise du UI kit/`data.js`)
- `app/components/terminal/programs/Projets.ts` (NOUVEAU — programme `projets`, liste `<ul>` des projets keova.app / patio-conseil.fr)
- `app/components/terminal/programs/Contact.ts` (NOUVEAU — programme `contact`, infos email/ville/statut/formulaire en `<ul>`)
- `app/components/terminal/programs/Clear.ts` (NOUVEAU — programme `clear` pour la découvrabilité `help` ; le vidage réel est intercepté dans `submitInput`)
- `app/components/terminal/programs/index.ts` (MODIFIÉ — barrel : export des 4 nouveaux programmes)
- `app/components/terminal/programs/ProgramManager.ts` (MODIFIÉ — import + `add()` des 4 nouveaux programmes)
- `app/components/terminal/TerminalComponent.vue` (MODIFIÉ — `submitInput` : interception de `clear` qui vide `commandLines` sans écho ; aucune autre logique touchée)
- `docs/implementation-artifacts/8-2-preserver-les-commandes-et-louverture.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)

## Change Log

| Date       | Version | Description                                                                                  |
| ---------- | ------- | -------------------------------------------------------------------------------------------- |
| 2026-06-26 | 0.1     | Non-régression terminal post-8.1 (ouverture/focus/close, drag 1:1/resize/z-index, commandes legacy, historique, échappement, bannière) **+** ajout des commandes `skills`/`projets`/`contact` (programmes `IProgram`, contenu UI kit/`data.js`) et `clear` (interception `submitInput` + programme pour `help`). Tout vérifié au navigateur ; lint + typecheck + generate verts. |
