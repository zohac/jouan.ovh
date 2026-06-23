---
title: "Nuxt + Symfony : une architecture qui tient la route"
description: "Le découpage front/back que j'utilise sur keova.app, et pourquoi la Clean Architecture m'a fait gagner du temps."
date: "2026-05-28"
read: "11 min"
tags:
  - nuxt
  - symfony
  - clean-archi
image:
  src: "/images/hacker-den-2.png"
  alt: ""
---

Sur keova.app, le front Nuxt et l'API Symfony vivent dans deux dépôts distincts, reliés par un contrat d'API explicite. Ce découpage paraît lourd au départ ; il devient vite ce qui me permet d'avancer sans rien casser.

## Un contrat avant du code

Avant d'écrire une ligne de front, je fige le contrat : routes, payloads, codes d'erreur. Le front se développe alors contre des fixtures, sans attendre le back. Les deux côtés évoluent en parallèle.

## La Clean Architecture, sans dogme

Côté Symfony, je sépare le domaine (les règles métier) de l'infrastructure (Doctrine, HTTP). Le domaine ne connaît ni la base ni le framework — il se teste en quelques millisecondes, et reste lisible des années plus tard.

## Ce que ça coûte, ce que ça rapporte

Le surcoût initial est réel. Mais chaque fonctionnalité ajoutée derrière se branche proprement, et les régressions se voient tout de suite. Sur un produit que j'opère seul, c'est ce qui fait la différence entre tenir le rythme et crouler sous la dette.
