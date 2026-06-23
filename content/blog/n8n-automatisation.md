---
title: "Automatiser sa veille avec n8n et un peu de code"
description: "Un workflow n8n concret pour collecter, résumer et publier — le tout piloté par quelques nœuds et une touche de LLM."
date: "2026-05-09"
read: "6 min"
tags:
  - n8n
  - automatisation
  - ia
image:
  src: "/images/hacker-den-3.png"
  alt: ""
---

Je consacrais trop de temps à trier ma veille technique. Un workflow n8n m'a permis de récupérer ce temps, sans construire une usine à gaz : quelques nœuds, un appel LLM, et une publication automatique.

## Le pipeline en trois temps

Collecter, résumer, publier. n8n déclenche le flux à intervalle régulier, agrège les flux RSS qui m'intéressent, puis passe chaque article au résumé.

## Le LLM en touche finale

Le résumé est délégué à un LLM via un simple nœud HTTP. Je garde le prompt court et contraint — un titre, trois points clés — pour limiter le coût et la variabilité.

```text
Résume en 3 puces, ton neutre, 200 caractères max :
{{ $json.content }}
```

## Garder la main

Rien n'est publié sans relecture : le workflow dépose les brouillons dans une file que je valide d'un clic. L'automatisation me fait gagner du temps, pas le contrôle éditorial.
