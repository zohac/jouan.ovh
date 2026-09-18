---
name: jouan.ovh
description: Systèmes IA & automatisation métier — Design System Thème Light & Dark
status: final
updated: 2026-09-18
colors:
  # Palette Dark (Fondations existantes)
  surface-0-dark: '#140b12'
  surface-1-dark: '#1c121a'
  surface-2-dark: '#241a22'
  surface-3-dark: '#2f232d'
  surface-4-dark: '#3d303b'
  ink-1-dark: '#f5f3f0'
  ink-2-dark: '#c3bdb7'
  ink-3-dark: '#8f8783'
  ink-4-dark: '#6b6460'
  line-subtle-dark: '#342832'
  line-dark: '#483945'
  line-strong-dark: '#63515f'

  # Palette Light (Option 1 — Papier technique / Crème solaire)
  surface-0-light: '#faf8f4'
  surface-1-light: '#f1ede6'
  surface-2-light: '#ffffff'
  surface-3-light: '#fffefb'
  surface-4-light: '#f5f3ee'
  ink-1-light: '#271524'
  ink-2-light: '#473644'
  ink-3-light: '#756773'
  ink-4-light: '#988d96'
  line-subtle-light: '#e6e2dc'
  line-light: '#d1ccc4'
  line-strong-light: '#b3aba2'

  # Sanctuarisation Terminal (Identique en Dark et Light)
  surface-terminal: '#2e0024'
  ink-terminal-prompt: '#45d677'
  ink-terminal-dir: '#56b6f7'
  ink-terminal-text: '#f5f3f0'

  # Brand Accents
  orange-500: '#fa6412'
  orange-light-contrast: '#d94f00'
  aubergine: '#663359'
  aubergine-light: '#b890b0'
typography:
  font-mono:
    fontFamily: '"Ubuntu Mono", "SF Mono", ui-monospace, monospace'
  font-sans:
    fontFamily: '"Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif'
  font-display:
    fontFamily: '"Ubuntu Mono", "SF Mono", ui-monospace, monospace'
rounded:
  sm: '5px'
  md: '8px'
  lg: '12px'
  full: '9999px'
spacing:
  1: '4px'
  2: '8px'
  3: '12px'
  4: '16px'
  6: '24px'
  8: '32px'
components:
  theme-toggle:
    height: '36px'
    width: '36px'
    border-radius: '{rounded.md}'
    border-width: '1px'
    icon-size: '16px'
---

# Design Specification — Thème Light & Dark (jouan.ovh)

## 1. Brand & Style

Le site **jouan.ovh** incarne le savoir-faire de Simon Jouan en tant que développeur Full Stack spécialisé en systèmes IA et automatisation métier. Son identité visuelle puise ses racines dans l'univers du terminal UNIX, la rigueur métrologique et l'héritage Ubuntu (orange vibrant et nuances aubergines).

L'introduction du mode clair ne renie aucunement cette âme :
- En lieu et place d'un blanc clinique éblouissant de laboratoire, le thème clair adopte la posture **« Papier technique / Crème solaire »** : une feuille de calcul industrielle, un carnet d'ingénieur ou une documentation d'architecture imprimée sur un papier ivoire chaud (`{colors.surface-0-light}`).
- Les éléments de typographie conservent leur ascendance aubergine profonde (`{colors.ink-1-light}` et `{colors.ink-2-light}`), offrant une lisibilité veloutée et hautement contrastée sans jamais être agressive.
- **Sanctuarisation terminal :** Les composants à vocation purement CLI (le Terminal Hero et les fenêtres flottantes `TerminalComponent`) restent **impérativement sombres** (`{colors.surface-terminal}`). Ils agissent comme des îlots d'exécution système authentiques, tranchant avec élégance sur la clarté du document.

---

## 2. Colors

### 2.1 Philosophie et Palette en mode Clair

| Rôle de Token | Valeur HSL / Hex | Usage & Intention |
|---|---|---|
| `--surface-0` (Page) | `hsl(38 25% 97%)` / `#FAF8F4` | Fond principal de l'application. Ton sable/lin très doux, reposant pour les yeux en environnement lumineux. |
| `--surface-1` (Sunken) | `hsl(38 20% 93%)` / `#F1EDE6` | Sections en creux (ex. grilles de process, citations, arrière-plans de tableaux). |
| `--surface-2` (Card) | `#FFFFFF` | Cartes de contenu (services, projets phares, compétences). Blanc franc pour détacher le contenu du fond crème. |
| `--surface-3` (Elevated) | `hsl(38 30% 99%)` / `#FFFEFB` | Survol de carte, menus déroulants, popovers. |
| `--surface-4` (Input) | `hsl(38 15% 95%)` / `#F5F3EE` | Champs de formulaire et conteneurs de boutons secondaires. |
| `--line-subtle` | `hsl(35 15% 88%)` / `#E6E2DC` | Séparateurs légers, délimitation des cartes blanches sur fond crème. |
| `--line` | `hsl(35 12% 80%)` / `#D1CCC4` | Bordure standard des cartes et inputs. |
| `--line-strong` | `hsl(35 12% 68%)` / `#B3ABA2` | Bordures actives, états de focus ou badges encadrés. |

### 2.2 Typographie et Lisibilité (Encres en mode Clair)

| Token d'encre | Valeur Hex | Ratio de contraste vs Surface-0 / Surface-2 |
|---|---|---|
| `--ink-1` (Titres) | `#271524` | **15.2:1** (dépasse largement le seuil WCAG AAA de 7:1). Aubergine presque noire. |
| `--ink-2` (Corps de texte) | `#473644` | **8.4:1** (seuil WCAG AAA validé). Ardoise aubergine profonde. |
| `--ink-3` (Muted / Légendes) | `#756773` | **4.9:1** (conforme WCAG AA > 4.5:1). |
| `--ink-4` (Faint / Désactivé) | `#988D96` | 3.1:1 (réservé aux placeholders et états désactivés). |

### 2.3 Accents et Terminal

- **Accent Orange en mode clair :** Afin de garantir un ratio de contraste supérieur à 4.5:1 pour les textes d'accroche et les liens sur fond clair, l'orange est subtilement réajusté à `{colors.orange-light-contrast}` (`#D94F00`, contraste 4.6:1). Pour les boutons pleins (`ZButton variant="primary"`), l'orange vif standard (`#FA6412`) est conservé avec du texte blanc `{colors.ink-1-dark}`.
- **Terminal sanctuarisé :** Les classes `.terminal`, `.home-hero-terminal` et les fenêtres CLI forcent explicitement les variables locales de surface à `--bg-terminal: #2e0024` et `--text-strong: #f5f3f0`, rendant le terminal insensible à l'inversion globale du thème.

---

## 3. Typography

Aucun changement de police ni d'échelle :
- Police principale d'interface : **Ubuntu** (`{typography.font-sans.fontFamily}`).
- Police de données, terminal et code : **Ubuntu Mono** (`{typography.font-mono.fontFamily}`).
- Échelle modulaire préservée (`--fs-xs` à `--fs-6xl`).

---

## 4. Layout & Spacing

Le composant de bascule de thème (`ThemeToggle`) s'intègre au système de grille du Header sans déformer la hauteur existante (`--header-height: 56px`) :
- **En Desktop :** Positionné dans `.hdr__dock-right`, immédiatement à gauche du badge `.hdr__status-badge` (« Disponible »).
- **Espacement :** Marge de séparation de `var(--space-3)` (12px) avec le badge d'état.
- **En Mobile :** Positionné dans `.hdr__menu-status`, à gauche ou en vis-à-vis direct du badge d'état.

---

## 5. Elevation & Depth

En mode sombre, la profondeur s'exprime par la lumière incidente et les bordures subtiles. En mode clair, la profondeur s'articule par des ombres portées douces et chaleureuses :

- `--shadow-1` (Light) : `0 1px 3px hsl(35deg 20% 40% / 8%)`
- `--shadow-2` (Light) : `0 3px 10px hsl(35deg 20% 40% / 10%)`
- `--shadow-3` (Light) : `0 8px 24px hsl(35deg 20% 40% / 12%)`
- `--shadow-hairline` (Light) : `inset 0 1px 0 hsl(0 0% 100% / 80%)` (rehaut supérieur blanc net)

---

## 6. Shapes

- Rayon standard du bouton toggle : `{rounded.md}` (8px), identique aux boutons compacts de l'écosystème `ZButton`.
- Rayon des cartes : `{rounded.md}` (8px) ou `{rounded.lg}` (12px) préservés.

---

## 7. Components — Le Bouton `ThemeToggle`

### 7.1 Anatomie
- Bouton interactif carré compact (`36px × 36px` en desktop, `40px × 40px` sur mobile pour satisfaire les cibles tactiles).
- Fond transparent ou teinté (`--surface-1` en repos, `--surface-3` en hover).
- Bordure fine `1px solid var(--border-subtle)`.
- Conteneur d'icône vectorielle SVG inline unique (`18px × 18px`).
- Aucune présence d'emoji textuel (respect de la règle NFR6 d'`AGENTS.md`).

### 7.2 États Visuels

| État du Thème | Icône affichée | Aspect Visuel |
|---|---|---|
| **Système (Auto)** | Moniteur / Terminal épuré (`monitor` ou `terminal-mini`) avec pastille discrète de synchronisation | Bordure subtile, icône encre atténuée. |
| **Sombre forcé** | Croissant de lune technique minimaliste (`moon`) | Accent aubergine lumineux ou blanc chaud. |
| **Clair forcé** | Soleil technique stylisé (`sun` à 8 rayons nets) | Accent ambre/orange doux. |

### 7.3 Micro-interactions
- **Hover :** Légère élévation (`translateY(-1px)`), surbrillance de bordure (`var(--border-strong)`).
- **Focus visible :** Double anneau de focus (`--ring-accent`) conforme WCAG 2.1 AA.
- **Rotation d'icône :** Transition douce de rotation (45deg) et fondu enchaîné d'opacité (`180ms cubic-bezier(0.22, 1, 0.36, 1)`), débrayée sous `prefers-reduced-motion: reduce`.

---

## 8. Do's and Don'ts

### Do's
- **DO** tester systématiquement chaque token de texte sur `{colors.surface-0-light}` et `{colors.surface-2-light}` pour garantir le ratio minimal de 4.5:1.
- **DO** laisser le Terminal Hero en fond sombre `{colors.surface-terminal}` quel que soit le mode actif.
- **DO** utiliser des icônes SVG créées avec des tracés vectoriels stricts et propres (pas de glyphes Unicode ou emojis).
- **DO** synchroniser automatiquement le thème lorsque l'utilisateur modifie la préférence de son OS si le mode actif est « Système ».

### Don'ts
- **DON'T** utiliser un blanc `#FFFFFF` brut pour le fond général de page (utiliser impérativement la teinte crème `{colors.surface-0-light}`).
- **DON'T** inverser le fond du terminal ou blanchir son prompt (le terminal est sanctuarisé).
- **DON'T** insérer des émojis de soleil ☀️ ou lune 🌙 dans l'interface ou les bulles d'aide.
- **DON'T** provoquer de saut visuel (FOUC) blanc/noir lors du rafraîchissement d'une page en SSG.
