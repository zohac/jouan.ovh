**Card** — the workhorse surface: card background, 1px hairline border, soft dark shadow + lit-from-above inset. Quiet by default so content leads.

```jsx
<Card>…</Card>
<Card interactive accent>…</Card>     // hover lift + top accent bar
<Card featured>Offre recommandée</Card>  // orange glow ring
```

Flags: `interactive` (hover lift), `accent` (orange→aubergine top bar), `featured` (glow ring for the highlighted offer), `padded` (default true). Compose freely inside.
