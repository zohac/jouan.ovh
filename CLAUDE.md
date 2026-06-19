# jouan.ovh — Notes projet

## Développement : Docker uniquement

Le dev et l'outillage tournent **dans le conteneur Docker**, pas sur l'hôte.
Les `node_modules` vivent dans un **volume nommé** (`node_modules`) — l'hôte n'a
pas les dépendances installées. Toute commande pnpm doit donc passer par Docker.

```sh
docker compose up                          # dev server -> http://localhost:3000
docker compose run --rm web pnpm <cmd>     # commande ponctuelle (lint, generate, add…)
docker compose run --rm web pnpm lint      # lint (eslint + stylelint)
docker compose run --rm web pnpm add -D <pkg>   # ajouter une dépendance
docker compose down                        # stopper
```

- Image : `node:22-bookworm-slim`, pnpm activé via `corepack` (version pinnée par `package.json#packageManager`).
- Ne jamais lancer `pnpm install`/`pnpm add`/`pnpm lint` directement sur l'hôte :
  ça écrirait dans un `node_modules` hôte absent/divergent du conteneur.
