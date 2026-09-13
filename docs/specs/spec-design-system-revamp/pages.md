# Pages — catalogue cible

Référence visuelle : `docs/design_system/ui_kits/jouan-site/` (ouvrir `index.html`).
Contenu français de départ : `ui_kits/jouan-site/data.js`. Chaque page compose
les primitives (voir `primitives.md`), elle ne les réimplémente pas.

| Route | Réf. UI kit | Statut route | Sections |
|---|---|---|---|
| `/` | `Home.jsx` | existe | hero · aperçu services · stats · projets sélectionnés |
| `/services` | `Services.jsx` | **à créer** | 3 offres (WordPress / Applications web / IA) · étapes du process |
| `/about` | `About.jsx` | existe | portrait · bio · timeline expérience · formation · stack |
| `/blog` | `Blog.jsx` | existe | index articles (+ empty-state soigné) |
| `/blog/[...slug]` | `Blog.jsx` (vue article) | existe | prose + blocs de code stylés (`@nuxt/content`) |
| `/contact` | `Contact.jsx` | **à créer** | formulaire (fake) · carte infos · CTA terminal · socials |
| Terminal (modal) | `TerminalScreen.jsx` | existe (`components/terminal/`) | easter-egg : `help` `about` `skills` `projets` `contact` `clear` |

## Notes par page

- **Home** — le hero a trois directions au prototype (Terminal A / Portrait B /
  Statement C). Une seule est livrée (cf. open question dans SPEC.md). Stats et
  projets viennent de `data.js`.
- **Services** — nouvelle route. 3 cartes d'offre + section process étapes.
- **About** — réutilise le portrait et les assets AI d'origine (`design_system/assets/`).
- **Blog** — réutilise le pipeline `@nuxt/content` déjà en place ; créer le
  dossier `content/`. Conserver l'empty-state existant, restylé.
- **Contact** — formulaire non fonctionnel côté serveur (site statique) ;
  validation/feedback front uniquement. CTA qui ouvre le terminal.
- **Layout global** — header fixe 56px (logo diamant), footer 56px, hexagones
  sociaux en footer/contact (motif patrimonial conservé).
