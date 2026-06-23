---
title: "Intégrer un agent IA dans WordPress proprement"
description: "Comment brancher un LLM sur WordPress sans transformer votre site en usine à gaz — architecture, sécurité, et coûts."
date: "2026-06-12"
read: "8 min"
tags:
  - wordpress
  - ia
  - architecture
image:
  src: "/images/hacker-den-1.png"
  alt: ""
---

La plupart des intégrations IA échouent non pas sur le modèle, mais sur l'architecture autour. On greffe un appel d'API au mauvais endroit, et le site devient lent, fragile et impossible à maintenir. Voici l'approche que j'applique sur mes projets.

## Garder l'IA hors du chemin critique

L'idée centrale : un appel à un LLM est lent et faillible. Il ne doit jamais bloquer le rendu d'une page. On le déporte dans une file de traitement, on met en cache agressivement, et on prévoit toujours un repli.

```php
// file d'attente plutôt qu'appel synchrone
$queue->push('summarize', [
    'postId' => $post->ID,
    'prompt' => build_prompt($post),
]);
// le résultat arrive via webhook, mis en cache
```

## Mesurer le coût, toujours

Chaque appel a un prix. Je logue les tokens par requête et je fixe un budget mensuel — au-delà, le système bascule sur le cache ou désactive la fonctionnalité proprement. L'IA reste un confort, jamais une dépendance qui casse le site.
