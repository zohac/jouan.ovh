**Button** — primary action control; mono label, Ubuntu-orange primary, used for CTAs, form submits, and terminal-flavoured actions.

```jsx
<Button variant="primary" size="lg" onClick={start}>Démarrer un projet</Button>
<Button variant="secondary">En savoir plus</Button>
<Button variant="terminal" icon={<TerminalIcon />}>./run</Button>
```

Variants: `primary` (orange), `secondary` (surface + border), `ghost` (text only), `terminal` (aubergine + green, hacker flavour), `danger`. Sizes: `sm` / `md` / `lg`. Pass `icon` / `iconRight` for inline SVGs, `as="a"` + `href` for links. Disabled via the native `disabled` attribute.
